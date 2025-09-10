import { Router, Request, Response } from 'express';
import multer from 'multer';
import { GeminiService } from '../services/geminiService';
import { StorageService } from '../services/storageService';
import { DiagnosisRequest } from '@krishi-mitra/types';
import { catchAsync } from '../utils/catchAsync';
import ApiError from '../utils/ApiError';
import { auth } from '../middleware/auth';

const router: Router = Router();
const geminiService = new GeminiService();
const storageService = new StorageService();

// Configure multer for in-memory file storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10 MB limit
  },
});

router.post('/', upload.single('image'), auth, catchAsync(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new ApiError(401, 'Unauthorized');
  }

  if (!req.file) {
    throw new ApiError(400, 'Image file is required');
  }

  const { buffer: imageBuffer, mimetype: mimeType } = req.file;

  // 1. Get AI analysis from Gemini
  const analysisResult = await geminiService.analyzePlantDisease({
    imageBuffer,
    mimeType,
    // The `language` property has been removed from this call.
  });

  // 2. Upload image and save diagnosis to DB
  await storageService.uploadImageAndSaveDiagnosis(
    req.user.id,
    { buffer: imageBuffer, mimeType },
    analysisResult
  );

  // 3. Return the full analysis result from Gemini to the frontend
  res.status(200).json(analysisResult);
}));

export { router as diagnosisRouter };