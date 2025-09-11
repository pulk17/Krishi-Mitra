import app from './server';
import { env } from './config/env';

const PORT = env.PORT || 3003;

app.listen(PORT, () => {
  console.log(`🚀 Backend server running on http://localhost:${PORT}`);
  if (env.NODE_ENV === 'development') {
    console.log(`📡 Accepting requests from: ${env.FRONTEND_URL}`);
  }
});