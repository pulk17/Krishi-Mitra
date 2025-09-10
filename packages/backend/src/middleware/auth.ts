import { Request, Response, NextFunction } from 'express';
import { createSupabaseClient } from '../lib/supabase';

/**
 * Middleware to verify Supabase JWT and attach the user object to the request.
 */
export const auth = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ detail: 'Missing or invalid authorization header' });
  }

  const token = authHeader.split(' ')[1];

  try {
    // Create a temporary client just to validate the token
    const tempSupabase = createSupabaseClient(token);
    const {
      data: { user },
      error,
    } = await tempSupabase.auth.getUser();

    if (error || !user) {
      return res.status(401).json({ detail: 'Invalid or expired token' });
    }

    // Attach the validated user object to the request
    req.user = user;

    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(401).json({ detail: 'Unauthorized' });
  }
};