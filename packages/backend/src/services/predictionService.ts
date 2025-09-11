import { YieldPredictionRequest, YieldPredictionResponse } from '@krishi-mitra/types';
import ApiError from '../utils/ApiError';
import { env } from '../config/env';

class PredictionService {
  private predictionServiceUrl: string;

  constructor() {
    this.predictionServiceUrl = `${env.PREDICTION_SERVICE_URL}/predict`;
    console.log(`[PredictionService] Initialized. Targetting: ${this.predictionServiceUrl}`);
  }

  /**
   * Calls the dedicated Python prediction microservice to get a yield prediction.
   * @param features The input data for the model.
   * @returns A promise that resolves with the prediction result.
   */
  async getYieldPrediction(features: YieldPredictionRequest): Promise<YieldPredictionResponse> {
    try {
      console.log('[PredictionService] Sending prediction request to Python service...');
      
      const response = await fetch(this.predictionServiceUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(features),
      });

      if (!response.ok) {
        const errorBody = await response.json().catch(() => ({ error: 'Unknown error from prediction service.' }));
        console.error(`[PredictionService] Error from prediction service (Status: ${response.status}):`, errorBody);
        throw new ApiError(response.status, `Prediction service failed: ${errorBody.error}`);
      }

      const result = await response.json() as YieldPredictionResponse;
      console.log('[PredictionService] Successfully received prediction:', result);
      return result;

    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      console.error('[PredictionService] Failed to communicate with the prediction service:', error);
      throw new ApiError(503, 'The prediction service is currently unavailable. Please try again later.');
    }
  }
}

export const predictionService = new PredictionService();