from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import pandas as pd
import numpy as np
import logging
import traceback
import json

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app)

try:
    # Load the saved model and scaler
    model = joblib.load('trained_rfc_model.pkl')
    scaler = joblib.load('scaler.pkl')
    feature_names = joblib.load('feature_names.pkl')
    logger.info("Model and scaler loaded successfully")
except Exception as e:
    logger.error(f"Error loading model: {e}")
    logger.error(traceback.format_exc())

def preprocess_input_data(data):
    # Map frontend field names to backend field names
    field_mapping = {
        'Age': 'Age',
        'Sex_Male': 'Sex_Male',
        'Sex_Female': 'Sex_Female',
        'Cholesterol': 'Cholesterol',
        'BP_Systolic': 'BP_Systolic',
        'BP_Diastolic': 'BP_Diastolic',
        'Heart_Rate': 'Heart Rate',
        'Diabetes': 'Diabetes',
        'Family_History': 'Family History',
        'Smoking': 'Smoking',
        'Obesity': 'Obesity',
        'Alcohol_Consumption': 'Alcohol Consumption',
        'Exercise_Hours_Per_Week': 'Exercise Hours Per Week',
        'Diet': 'Diet',
        'Previous_Heart_Problems': 'Previous Heart Problems',
        'Medication_Use': 'Medication Use',
        'Stress_Level': 'Stress Level',
        'Sedentary_Hours_Per_Day': 'Sedentary Hours Per Day',
        'Income': 'Income',
        'BMI': 'BMI',
        'Triglycerides': 'Triglycerides',
        'Physical_Activity_Days_Per_Week': 'Physical Activity Days Per Week',
        'Sleep_Hours_Per_Day': 'Sleep Hours Per Day'
    }

    # Create DataFrame from input
    df = pd.DataFrame([data])
    logger.debug(f"Initial DataFrame: {df}")

    # Process Blood Pressure
    try:
        if 'Blood Pressure' in df.columns:
            bp = df['Blood Pressure'].iloc[0]
            if isinstance(bp, str) and '/' in bp:
                systolic, diastolic = bp.split('/')
                df['BP_Systolic'] = int(systolic)
                df['BP_Diastolic'] = int(diastolic)
            else:
                raise ValueError("Blood Pressure must be in format 'systolic/diastolic'")
            df.drop('Blood Pressure', axis=1, inplace=True)
        logger.debug(f"DataFrame after processing Blood Pressure: {df}")
    except Exception as e:
        raise ValueError(f"Error processing Blood Pressure: {str(e)}")

    # Process Diet
    #try:
      #  if 'Diet' in df.columns:
         #   diet_map = {'Healthy': 2, 'Average': 1, 'Unhealthy': 0}
          #  if df['Diet'].iloc[0] not in diet_map:
             #   raise ValueError("Diet must be one of: Healthy, Average, Unhealthy")
            # df['Diet'] = df['Diet'].map(diet_map)
      #  logger.debug(f"DataFrame after processing Diet: {df}")
   # except Exception as e:
       # raise ValueError(f"Error processing Diet: {str(e)}")

    try:
        if 'Sex' in df.columns:
            sex = df['Sex'].iloc[0]
            if sex not in ['Male', 'Female']:
                raise ValueError("Sex must be either 'Male' or 'Female'")
            df['Sex_Female'] = 1 if sex == 'Female' else 0
            df['Sex_Male'] = 1 if sex == 'Male' else 0
            df.drop('Sex', axis=1, inplace=True)
        logger.debug(f"DataFrame after processing Sex: {df}")
    except Exception as e:
        raise ValueError(f"Error processing Sex: {str(e)}")

    # Ensure all numeric columns are numeric
    numeric_columns = [
        'Age', 'Cholesterol', 'Heart Rate', 'Diabetes', 'Family History',
        'Smoking', 'Obesity', 'Alcohol Consumption', 'Exercise Hours Per Week',
        'Previous Heart Problems', 'Medication Use', 'Stress Level',
        'Sedentary Hours Per Day', 'Income', 'BMI', 'Triglycerides',
        'Physical Activity Days Per Week', 'Sleep Hours Per Day'
    ]
    
    for col in numeric_columns:
        if col in df.columns:
            try:
                df[col] = pd.to_numeric(df[col])
            except Exception:
                raise ValueError(f"Column {col} must be numeric and contain valid numeric values")
        logger.debug(f"DataFrame after ensuring numeric columns: {df}")

    # Map frontend field names to backend field names
    processed_data = {field_mapping[key]: value for key, value in data.items()}
    logger.debug(f"Processed data: {processed_data}")

    # Ensure all required features are present
    missing_cols = set(feature_names) - set(processed_data.keys())
    if missing_cols:
        raise ValueError(f"Missing required features: {missing_cols}")

    # Reorder columns to match training data
    final_df = pd.DataFrame([processed_data])[feature_names]
    logger.debug(f"Final DataFrame: {final_df}")
    return final_df

@app.route('/predict', methods=['POST', 'OPTIONS'])
def predict():
    if request.method == 'OPTIONS':
        return '', 200
        
    try:
        # Get JSON data from request
        data = request.json
        logger.info("Received Data: %s", json.dumps(data, indent=4))  # Logging

        # Preprocess the input data
        processed_data = preprocess_input_data(data)
        
        # Scale the processed data
        scaled_data = scaler.transform(processed_data)
        
        # Make prediction
        prediction = model.predict(scaled_data)
        prediction_proba = model.predict_proba(scaled_data)
        
        # Prepare response
        response = {
            'prediction': int(prediction[0]),
            'probability': float(prediction_proba[0][1]),
            'message': 'Prediction successful'
        }
        
        return jsonify(response)
        
    except ValueError as ve:
        logger.error(f"Validation error: {str(ve)}")
        return jsonify({
            'error': str(ve),
            'error_type': 'validation'
        }), 400
        
    except Exception as e:
        logger.error(f"Error making prediction: {e}")
        logger.error(traceback.format_exc())
        return jsonify({
            'error': 'An unexpected error occurred',
            'error_type': 'server'
        }), 500

if __name__ == '__main__':
    app.run(debug=True)
