import { Router, Request, Response } from 'express';
import { StorageService } from '../services/storageService';
import { catchAsync } from '../utils/catchAsync';
import ApiError from '../utils/ApiError';

const router: Router = Router();
const storageService = new StorageService();

// GET /api/user/diagnoses - Fetch diagnosis history
router.get('/diagnoses', catchAsync(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new ApiError(401, 'Unauthorized');
  }
  const diagnoses = await storageService.getDiagnoses(req.user.id);
  res.status(200).json(diagnoses);
}));

// GET /api/user/profile - Fetch user profile
router.get('/profile', catchAsync(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new ApiError(401, 'Unauthorized');
  }
  const profile = await storageService.getProfile(req.user);
  if (!profile) {
    // This case should be rare due to the self-healing getProfile method
    throw new ApiError(404, 'Profile not found and could not be created.');
  }
  res.status(200).json(profile);
}));

// PUT /api/user/profile - Update user profile
router.put('/profile', catchAsync(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new ApiError(401, 'Unauthorized');
  }

  const { full_name } = req.body;
  if (typeof full_name !== 'string' || full_name.trim() === '') {
    throw new ApiError(400, 'Full name must be a non-empty string.');
  }

  const updatedProfile = await storageService.updateProfile(req.user.id, { full_name });
  res.status(200).json(updatedProfile);
}));

export { router as userRouter };