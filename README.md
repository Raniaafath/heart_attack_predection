# heart_attack_predection
# Heart Disease Prediction API

This is a Flask-based API for predicting the likelihood of heart disease based on various health parameters. The API uses a trained Random Forest Classifier (RFC) model and a data scaler to preprocess inputs before making predictions.

## Features
- Receives user health data via JSON requests
- Preprocesses input data, including feature transformations and scaling
- Uses a trained model to predict heart disease probability
- Provides informative logging and error handling

## Technologies Used
- Flask
- Flask-CORS
- Pandas
- NumPy
- Joblib
- Scikit-learn
- Logging

## Installation & Setup

1. **Clone the Repository**

2. **Create a Virtual Environment (Optional but Recommended)**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On macOS/Linux
   venv\Scripts\activate     # On Windows
   ```

3. **Install Dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Ensure Model and Scaler Files Exist**
   Place the following pre-trained model files in the root directory:
   - `trained_rfc_model.pkl`
   - `scaler.pkl`
   - `feature_names.pkl`

## Running the API

To start the Flask server:
```bash
python app.py
```
The API will run on `http://127.0.0.1:5000/`.

## API Endpoints

### 1. Predict Heart Disease Risk
**Endpoint:** `/predict`
**Method:** `POST`
**Request Body (JSON):**
```json
{
    "Age": 45,
    "Sex": "Male",
    "Cholesterol": 200,
    "BP_Systolic": 130,
    "BP_Diastolic": 85,
    "Heart_Rate": 75,
    "Diabetes": 0,
    "Family_History": 1,
    "Smoking": 0,
    "Obesity": 1,
    "Alcohol_Consumption": 2,
    "Exercise_Hours_Per_Week": 3,
    "Diet": "Average",
    "Previous_Heart_Problems": 0,
    "Medication_Use": 1,
    "Stress_Level": 4,
    "Sedentary_Hours_Per_Day": 8,
    "Income": 50000,
    "BMI": 25,
    "Triglycerides": 150,
    "Physical_Activity_Days_Per_Week": 4,
    "Sleep_Hours_Per_Day": 6
}
```

**Response:**
```json
{
    "prediction": 1,
    "probability": 0.85,
    "message": "Prediction successful"
}
```

## Error Handling
- **Validation Errors (400)**: Missing or incorrect fields in the request.
- **Server Errors (500)**: Unexpected issues such as missing model files.

## Contributing
Feel free to submit issues or pull requests to enhance the project.

## License
This project is open-source and available under the MIT License.

## Author
Rania Fathallah 



