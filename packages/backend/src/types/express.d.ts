import { User } from '@supabase/supabase-js';

// This merges custom properties into the Express Request type
declare global {
  namespace Express {
    export interface Request {
      user?: User;
    }
  }
}