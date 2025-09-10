import joblib
import numpy as np
import warnings
import os

warnings.filterwarnings('ignore')

class CropYieldPredictor:
    def __init__(self, model_path):
        """
        Load the trained model for making predictions.
        """
        if not os.path.exists(model_path):
            raise FileNotFoundError(f"Model file not found at: {model_path}")
            
        try:
            self.model_package = joblib.load(model_path)
            self.model = self.model_package['model']
            self.scaler = self.model_package.get('scaler') # Use .get for optional scaler
            self.feature_cols = self.model_package['feature_cols']
        except Exception as e:
            raise IOError(f"Error loading model from {model_path}: {str(e)}")

    def predict_single(self, feature_values):
        """
        Make a prediction for a single sample provided as a dictionary.
        """
        try:
            # Ensure all required features are present
            missing_features = set(self.feature_cols) - set(feature_values.keys())
            if missing_features:
                raise ValueError(f"Missing features: {', '.join(missing_features)}")

            # Create a numpy array in the correct feature order
            X_sample = np.array([feature_values[col] for col in self.feature_cols]).reshape(1, -1)

            # Apply scaler if it exists
            if self.scaler:
                X_sample = self.scaler.transform(X_sample)
            
            # Make the prediction
            prediction = self.model.predict(X_sample)[0]
            
            return prediction
        except Exception as e:
            raise RuntimeError(f"Error during prediction: {str(e)}")