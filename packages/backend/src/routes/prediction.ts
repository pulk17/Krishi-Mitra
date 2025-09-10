import { Router, Request, Response } from 'express';
import multer from 'multer';
import { predictionService } from '../services/predictionService';
import { GeminiService } from '../services/geminiService';
import { catchAsync } from '../utils/catchAsync';
import ApiError from '../utils/ApiError';
import { auth } from '../middleware/auth';
import { YieldPredictionRequest } from '@krishi-mitra/types';

const router: Router = Router();
const geminiService = new GeminiService();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB per file
});

// Endpoint to run the Python model and get a yield prediction
router.post('/yield', auth, catchAsync(async (req: Request, res: Response) => {
  const features: YieldPredictionRequest = req.body;
  
  // Basic validation
  if (!features || Object.keys(features).length < 8) {
    throw new ApiError(400, 'All 8 feature values are required for prediction.');
  }

  const result = await predictionService.getYieldPrediction(features);
  res.status(200).json(result);
}));

// Endpoint for the "Not Sure" feature to estimate inputs from images
router.post('/estimate-inputs', auth, upload.array('images', 5), catchAsync(async (req: Request, res: Response) => {
  if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
    throw new ApiError(400, 'At least one image file is required.');
  }
  
  const { location } = req.body;
  if (!location) {
    throw new ApiError(400, 'Location is required for estimation.');
  }
  
  const imagePayloads = req.files.map(file => ({
    buffer: file.buffer,
    mimeType: file.mimetype,
  }));
  
  const estimatedInputs = await geminiService.estimateInputsFromImages(imagePayloads, location);
  
  res.status(200).json(estimatedInputs);
}));

export { router as predictionRouter };