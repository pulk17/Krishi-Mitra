import prisma from '../lib/prisma';
import { Prisma, Profile } from '@prisma/client';
import { supabaseAdmin } from '../lib/supabase';
import { DiagnosisResult } from '@krishi-mitra/types';
import { randomUUID } from 'crypto';
import { User } from '@supabase/supabase-js';

// Define reusable types based on the generated Prisma Client
type ProfileUpdate = Prisma.ProfileUpdateInput;
type ProfileRow = Profile;
type DiagnosisRow = Prisma.DiagnosisGetPayload<{}>;

const BUCKET_NAME = 'plant-images';

export class StorageService {
  /**
   * Orchestrates uploading an image to Supabase Storage and saving the
   * corresponding diagnosis result to the database via Prisma.
   */
  async uploadImageAndSaveDiagnosis(
    userId: string,
    image: { buffer: Buffer; mimeType: string },
    diagnosisResult: DiagnosisResult
  ): Promise<DiagnosisRow> {
    // 1. Upload image to Supabase Storage
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

    // 2. Save the diagnosis to the database using Prisma
    try {
      const savedDiagnosis = await prisma.diagnosis.create({
        data: {
          image_url: publicUrl,
          disease_name: diagnosisResult.disease_name,
          confidence: diagnosisResult.confidence,
          symptoms: diagnosisResult.symptoms,
          treatment: diagnosisResult.treatment,
          prevention: diagnosisResult.prevention,
          language: diagnosisResult.language,
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
      // TODO: Implement a rollback for the image upload if the DB write fails.
      throw new Error('Failed to save diagnosis');
    }
  }

  async getDiagnoses(userId: string): Promise<DiagnosisRow[]> {
    try {
      return await prisma.diagnosis.findMany({
        where: { user_id: userId },
        orderBy: { created_at: 'desc' },
        take: 50, // Limit for performance
      });
    } catch (error) {
      console.error('Failed to get diagnoses from Prisma:', error);
      throw new Error('Failed to retrieve diagnoses');
    }
  }

  /**
   * Retrieves a user profile. If the profile does not exist for the
   * authenticated user, it creates one automatically, making the system self-healing.
   * @param user The authenticated user object from Supabase.
   * @returns The user's profile object.
   */
  async getProfile(user: User): Promise<ProfileRow | null> {
    try {
      // Use Prisma's upsert to find the profile OR create it if it doesn't exist.
      const profile = await prisma.profile.upsert({
        where: { id: user.id },
        update: {}, // No updates needed if it's found
        create: {
          id: user.id,
          email: user.email!, // Email is guaranteed on a valid user
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
}