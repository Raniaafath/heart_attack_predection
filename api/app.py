from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import numpy as np
from sklearn.preprocessing import StandardScaler
import logging
import traceback

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Initialize Flask app
app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Load the model
try:
    model = joblib.load('trained_rfc_model.pkl')
    scaler = StandardScaler()  # You'll need to save and load your scaler as well
    logger.info("Model loaded successfully")
except Exception as e:
    logger.error(f"Error loading model: {str(e)}")
    logger.error(traceback.format_exc())

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({"status": "healthy"}), 200

@app.route('/predict', methods=['POST'])
def predict():
    try:
        # Get data from request
        data = request.json
        
        # Validate input data
        required_features = [
            'Age', 'Sex', 'Cholesterol', 'Blood_Pressure', 
            'Heart_Rate', 'Diabetes', 'Family_History', 
            'Smoking', 'Obesity', 'Alcohol_Consumption',
            'Exercise_Hours_Per_Week', 'Diet', 'Previous_Heart_Problems',
            'Medication_Use', 'Stress_Level', 'Sedentary_Hours_Per_Day',
            'Income', 'BMI', 'Triglycerides', 'Physical_Activity_Days_Per_Week',
            'Sleep_Hours_Per_Day', 'Country', 'Continent', 'Hemisphere'
        ]
        
        for feature in required_features:
            if feature not in data:
                return jsonify({
                    "error": f"Missing required feature: {feature}"
                }), 400
        
        # Prepare input data
        features = np.array([data[feature] for feature in required_features]).reshape(1, -1)
        
        # Scale features
        scaled_features = scaler.transform(features)
        
        # Make prediction
        prediction = model.predict(scaled_features)
        prediction_proba = model.predict_proba(scaled_features)
        
        # Log prediction
        logger.info(f"Prediction made for input: {data}")
        
        return jsonify({
            "prediction": int(prediction[0]),
            "probability": float(prediction_proba[0][1])
        })
        
    except Exception as e:
        logger.error(f"Error making prediction: {str(e)}")
        logger.error(traceback.format_exc())
        return jsonify({"error": str(e)}), 500

@app.route('/model-info', methods=['GET'])
def model_info():
    return jsonify({
        "model_type": "Random Forest Classifier",
        "features": [
            {"name": "Age", "type": "numeric", "description": "Age of the patient"},
            {"name": "Sex", "type": "categorical", "description": "Gender of the patient"},
            {"name": "Cholesterol", "type": "numeric", "description": "Cholesterol level"},
            {"name": "Blood_Pressure", "type": "numeric", "description": "Blood pressure reading"},
            {"name": "Heart_Rate", "type": "numeric", "description": "Heart rate"},
            {"name": "Diabetes", "type": "boolean", "description": "Whether patient has diabetes"},
            {"name": "Family_History", "type": "boolean", "description": "Family history of heart disease"},
            {"name": "Smoking", "type": "boolean", "description": "Smoking status"},
            {"name": "Obesity", "type": "boolean", "description": "Obesity status"},
            {"name": "Alcohol_Consumption", "type": "categorical", "description": "Level of alcohol consumption"},
            {"name": "Exercise_Hours_Per_Week", "type": "numeric", "description": "Hours of exercise per week"},
            {"name": "Diet", "type": "categorical", "description": "Type of diet"},
            {"name": "Previous_Heart_Problems", "type": "boolean", "description": "History of heart problems"},
            {"name": "Medication_Use", "type": "boolean", "description": "Current medication use"},
            {"name": "Stress_Level", "type": "numeric", "description": "Stress level (1-10)"},
            {"name": "Sedentary_Hours_Per_Day", "type": "numeric", "description": "Hours of sedentary activity per day"},
            {"name": "Income", "type": "numeric", "description": "Income level"},
            {"name": "BMI", "type": "numeric", "description": "Body Mass Index"},
            {"name": "Triglycerides", "type": "numeric", "description": "Triglycerides level"},
            {"name": "Physical_Activity_Days_Per_Week", "type": "numeric", "description": "Days of physical activity per week"},
            {"name": "Sleep_Hours_Per_Day", "type": "numeric", "description": "Hours of sleep per day"},
            {"name": "Country", "type": "categorical", "description": "Country of residence"},
            {"name": "Continent", "type": "categorical", "description": "Continent of residence"},
            {"name": "Hemisphere", "type": "categorical", "description": "Hemisphere of residence"}
        ],
        "version": "1.0.0"
    })

if __name__ == '__main__':
    app.run(debug=True, port=5000)