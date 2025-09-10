import sys
import json
import os
from predictor import CropYieldPredictor

def main():
    """
    Main execution function.
    Reads input from stdin, makes a prediction, and prints the result to stdout.
    """
    try:
        # Read the input data (a single JSON string) from stdin
        input_data = sys.stdin.read()
        
        if not input_data:
            raise ValueError("No input data received from stdin.")

        features = json.loads(input_data)

        # Construct the absolute path to the model file
        # This script's directory -> src/python/ -> model/
        script_dir = os.path.dirname(os.path.abspath(__file__))
        model_path = os.path.join(script_dir, 'model', 'production_lightgbm_model.pkl')

        # Initialize the predictor and make a prediction
        predictor = CropYieldPredictor(model_path=model_path)
        prediction = predictor.predict_single(features)

        # Prepare the successful output
        result = {"predicted_yield": prediction}
        print(json.dumps(result))
        sys.stdout.flush()

    except Exception as e:
        # Print any errors to stderr for Node.js to capture
        error_output = {"error": str(e)}
        print(json.dumps(error_output), file=sys.stderr)
        sys.stderr.flush()
        sys.exit(1)

if __name__ == "__main__":
    main()