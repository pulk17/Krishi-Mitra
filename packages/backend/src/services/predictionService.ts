import { spawn } from 'child_process';
import path from 'path';
import { YieldPredictionRequest, YieldPredictionResponse } from '@krishi-mitra/types';
import ApiError from '../utils/ApiError';

class PredictionService {
  private pythonPath: string;
  private scriptPath: string;

  constructor() {
    // SIMPLIFIED: Instead of a hardcoded path, we'll just use 'python'.
    // This relies on the virtual environment being activated in the terminal
    // where the server is run, which is standard practice.
    this.pythonPath = 'python'; 
    
    // The path to the script relative to the compiled 'dist' directory.
    this.scriptPath = path.join(__dirname, '../python/predict.py');
  }

  /**
   * Executes the Python prediction script as a child process.
   * @param features The input data for the model.
   * @returns A promise that resolves with the prediction result.
   */
  async getYieldPrediction(features: YieldPredictionRequest): Promise<YieldPredictionResponse> {
    return new Promise((resolve, reject) => {
      console.log(`[PredictionService] Spawning: ${this.pythonPath} ${this.scriptPath}`);
      const pythonProcess = spawn(this.pythonPath, [this.scriptPath]);

      let stdoutData = '';
      let stderrData = '';

      pythonProcess.stdout.on('data', (data) => {
        stdoutData += data.toString();
      });

      pythonProcess.stderr.on('data', (data) => {
        stderrData += data.toString();
      });

      pythonProcess.on('close', (code) => {
        console.log(`[PredictionService] Python script exited with code ${code}`);
        if (code === 0) {
          try {
            const result = JSON.parse(stdoutData);
            if (result.error) {
               reject(new ApiError(500, `Python script error: ${result.error}`));
            } else {
               resolve(result as YieldPredictionResponse);
            }
          } catch (e) {
            reject(new ApiError(500, 'Failed to parse Python script output.'));
          }
        } else {
          console.error(`[PredictionService] Stderr: ${stderrData}`);
          try {
            const errorJson = JSON.parse(stderrData);
            reject(new ApiError(500, `Prediction script failed: ${errorJson.error}`));
          } catch {
            reject(new ApiError(500, `Prediction script failed with exit code ${code}. Stderr: ${stderrData}`));
          }
        }
      });
      
      pythonProcess.on('error', (err) => {
        console.error('[PredictionService] Failed to spawn Python process:', err);
        reject(new ApiError(500, `Failed to start the prediction service. Make sure Python is installed and the virtual environment is activated.`));
      });

      console.log('[PredictionService] Sending feature data to Python script.');
      pythonProcess.stdin.write(JSON.stringify(features));
      pythonProcess.stdin.end();
    });
  }
}

export const predictionService = new PredictionService();