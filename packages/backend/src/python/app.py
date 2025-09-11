import os
from flask import Flask, request, jsonify
from predictor import CropYieldPredictor

app = Flask(__name__)

# --- MODEL LOADING ---
# Load the model once when the application starts.
# This is far more efficient than loading it on every request.
try:
    print("🚀 Initializing Flask server...")
    script_dir = os.path.dirname(os.path.abspath(__file__))
    model_path = os.path.join(script_dir, 'model', 'production_lightgbm_model.pkl')
    print(f"🔍 Loading model from: {model_path}")
    
    if not os.path.exists(model_path):
        raise FileNotFoundError(f"CRITICAL: Model file not found at the specified path: {model_path}")
        
    predictor = CropYieldPredictor(model_path=model_path)
    print("✅ Model loaded successfully. Server is ready.")
except Exception as e:
    print(f"❌ FATAL: Failed to load model on startup: {e}")
    # If the model can't be loaded, the service is useless.
    # In a real-world scenario, you might want a more graceful shutdown
    # or alerting mechanism here.
    predictor = None

# --- API ROUTES ---
@app.route('/health', methods=['GET'])
def health_check():
    """A simple health check endpoint."""
    if predictor:
        return jsonify({"status": "ok", "model_loaded": True}), 200
    else:
        return jsonify({"status": "error", "model_loaded": False, "message": "Model could not be loaded on startup."}), 500

@app.route('/predict', methods=['POST'])
def predict():
    """The main prediction endpoint."""
    if not predictor:
        return jsonify({"error": "Model is not available due to a startup error."}), 503

    try:
        features = request.get_json()
        if not features:
            return jsonify({"error": "Invalid input: No JSON data received."}), 400

        print(f"📨 Received prediction request with {len(features)} features.")
        
        # Make the prediction
        prediction = predictor.predict_single(features)
        
        # Prepare and send the successful response
        result = {"predicted_yield": prediction}
        print(f"✅ Prediction successful. Result: {result}")
        return jsonify(result), 200

    except ValueError as e:
        # Handle cases like missing features
        print(f"⚠️ Bad Request Error: {e}")
        return jsonify({"error": f"Invalid input: {str(e)}"}), 400
    except Exception as e:
        # Handle unexpected errors during prediction
        print(f"❌ Internal Server Error: {e}")
        return jsonify({"error": f"An unexpected error occurred: {str(e)}"}), 500

if __name__ == '__main__':
    # This block is for local development testing only
    app.run(host='0.0.0.0', port=8080, debug=True)