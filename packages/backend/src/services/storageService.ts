import prisma from '../lib/prisma';
import { Prisma, Profile } from '@prisma/client';
import { supabaseAdmin } from '../lib/supabase';
import { DiagnosisResult } from '@krishi-mitra/types';
import { randomUUID } from 'crypto';
import { User } from '@supabase/supabase-js';

type ProfileUpdate = Prisma.ProfileUpdateInput;
type ProfileRow = Profile;
type DiagnosisRow = Prisma.DiagnosisGetPayload<{}>;

const BUCKET_NAME = 'plant-images';

export class StorageService {
  async uploadImageAndSaveDiagnosis(
    userId: string,
    image: { buffer: Buffer; mimeType: string },
    diagnosisResult: DiagnosisResult
  ): Promise<DiagnosisRow> {
    const fileExt = image.mimeType.split('/')[1] || 'jpg';
    const fileName = `${randomUUID()}.${fileExt}`;
    const filePath = `${userId}/${fileName}`;

    const { error: uploadError } = await supabaseAdmin.storage
      .from(BUCKET_NAME)
      .upload(filePath, image.buffer, { contentType: image.mimeType });

    if (uploadError) {
      console.error('Failed to upload image to Supabase Storage:', uploadError);
      throw new Error('Failed to upload image');
    }

    const {
      data: { publicUrl },
    } = supabaseAdmin.storage.from(BUCKET_NAME).getPublicUrl(filePath);

    try {
      const savedDiagnosis = await prisma.diagnosis.create({
        data: {
          image_url: publicUrl,
          // CORRECTED: Accessing nested 'en' object for legacy fields
          disease_name: diagnosisResult.en.disease_name,
          confidence: diagnosisResult.confidence,
          symptoms: diagnosisResult.en.symptoms,
          treatment: diagnosisResult.en.treatment,
          prevention: diagnosisResult.en.prevention,
          language: 'bilingual',
          details: diagnosisResult as any,
          Profile: {
            connect: {
              id: userId,
            },
          },
        },
      });
      return savedDiagnosis;
    } catch (error) {
      console.error('Failed to save diagnosis to Prisma:', error);
      throw new Error('Failed to save diagnosis');
    }
  }

  async getDiagnoses(userId: string): Promise<DiagnosisRow[]> {
    try {
      return await prisma.diagnosis.findMany({
        where: { user_id: userId },
        orderBy: { created_at: 'desc' },
        take: 50,
      });
    } catch (error) {
      console.error('Failed to get diagnoses from Prisma:', error);
      throw new Error('Failed to retrieve diagnoses');
    }
  }

  async getProfile(user: User): Promise<ProfileRow | null> {
    try {
      const profile = await prisma.profile.upsert({
        where: { id: user.id },
        update: {},
        create: {
          id: user.id,
          email: user.email!,
          full_name: user.user_metadata?.full_name,
          avatar_url: user.user_metadata?.avatar_url,
        },
      });
      return profile;
    } catch (error) {
      console.error('Failed to get or create profile from Prisma:', error);
      throw new Error('Failed to retrieve profile');
    }
  }

  async updateProfile(userId: string, updates: ProfileUpdate): Promise<ProfileRow> {
    try {
      return await prisma.profile.update({
        where: { id: userId },
        data: updates,
      });
    } catch (error) {
      console.error('Failed to update profile in Prisma:', error);
      throw new Error('Failed to update profile');
    }
  }

  /**
   * NEW METHOD
   * Deletes all diagnosis records for a specific user.
   * @param userId The ID of the user.
   * @returns The result of the deleteMany operation.
   */
  async deleteAllDiagnoses(userId: string) {
    try {
      return await prisma.diagnosis.deleteMany({
        where: { user_id: userId },
      });
    } catch (error) {
      console.error('Failed to delete diagnoses from Prisma:', error);
      throw new Error('Failed to delete diagnoses');
    }
  }
}