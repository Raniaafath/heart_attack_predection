import React, { useState } from 'react';
import axios from 'axios';
import { Heart, Activity, AlertCircle, Info } from 'lucide-react';

interface PredictionResult {
  prediction: number;
  probability: number;
}

function App() {
  const [formData, setFormData] = useState({
    Age: 45,
    Sex: 'Male',
    Cholesterol: 200,
    Blood_Pressure: '120/80',
    Heart_Rate: 75,
    Diabetes: 0,
    Family_History: 0,
    Smoking: 0,
    Obesity: 0,
    Alcohol_Consumption: 0,
    Exercise_Hours_Per_Week: 3,
    Diet: 'Average',
    Previous_Heart_Problems: 0,
    Medication_Use: 0,
    Stress_Level: 5,
    Sedentary_Hours_Per_Day: 8,
    Income: 50000,
    BMI: 25,
    Triglycerides: 150,
    Physical_Activity_Days_Per_Week: 3,
    Sleep_Hours_Per_Day: 7
  });

  const [result, setResult] = useState<PredictionResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const [BP_Systolic, BP_Diastolic] = formData.Blood_Pressure.split('/').map(Number);
      const Sex_Male = formData.Sex === 'Male' ? 1 : 0;
      const Sex_Female = formData.Sex === 'Female' ? 1 : 0;

      const apiData = {
        Age: formData.Age,
        Sex_Male: Sex_Male,
        Sex_Female: Sex_Female,
        Cholesterol: formData.Cholesterol,
        BP_Systolic: BP_Systolic,
        BP_Diastolic: BP_Diastolic,
        Heart_Rate: formData.Heart_Rate,
        Diabetes: Number(formData.Diabetes),
        Family_History: Number(formData.Family_History),
        Smoking: Number(formData.Smoking),
        Obesity: Number(formData.Obesity),
        Alcohol_Consumption: formData.Alcohol_Consumption,
        Exercise_Hours_Per_Week: formData.Exercise_Hours_Per_Week,
        Diet: formData.Diet === 'Unhealthy' ? 0 : formData.Diet === 'Average' ? 1 : 2,
        Previous_Heart_Problems: Number(formData.Previous_Heart_Problems),
        Medication_Use: Number(formData.Medication_Use),
        Stress_Level: formData.Stress_Level,
        Sedentary_Hours_Per_Day: formData.Sedentary_Hours_Per_Day,
        Income: formData.Income,
        BMI: formData.BMI,
        Triglycerides: formData.Triglycerides,
        Physical_Activity_Days_Per_Week: formData.Physical_Activity_Days_Per_Week,
        Sleep_Hours_Per_Day: formData.Sleep_Hours_Per_Day
      };

      console.log("Sending Data:", JSON.stringify(apiData, null, 2));

      const response = await axios.post('http://localhost:5000/predict', apiData);
      setResult(response.data);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Error making prediction. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;

    let processedValue: any;
    if (type === 'checkbox') {
      processedValue = (e.target as HTMLInputElement).checked ? 1 : 0;
    } else if (type === 'number') {
      processedValue = Number(value);
    } else {
      processedValue = value;
    }

    setFormData(prev => ({
      ...prev,
      [name]: processedValue
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-red-100 mb-4">
            <Heart className="h-12 w-12 text-red-500" />
          </div>
          <h1 className="mt-3 text-4xl font-extrabold text-gray-900 tracking-tight">
            Heart Attack Risk Prediction
          </h1>
          <p className="mt-4 text-xl text-gray-600 max-w-2xl mx-auto">
            Enter your health information below to receive a personalized heart attack risk assessment
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-8 bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
            {/* Personal Information */}
            <div className="col-span-2">
              <div className="flex items-center space-x-2 mb-6">
                <h3 className="text-xl font-semibold text-gray-900">Personal Information</h3>
                <div className="h-px flex-1 bg-gray-200"></div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Age</label>
              <input
                type="number"
                name="Age"
                value={formData.Age}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 transition-colors"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Sex</label>
              <select
                name="Sex"
                value={formData.Sex}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 transition-colors"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>

            {/* Health Metrics */}
            <div className="col-span-2">
              <div className="flex items-center space-x-2 mb-6 mt-4">
                <h3 className="text-xl font-semibold text-gray-900">Health Metrics</h3>
                <div className="h-px flex-1 bg-gray-200"></div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                <div className="flex items-center space-x-1">
                  <span>Cholesterol (mg/dL)</span>
                  <Info className="h-4 w-4 text-gray-400" />
                </div>
              </label>
              <input
                type="number"
                name="Cholesterol"
                value={formData.Cholesterol}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 transition-colors"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Blood Pressure (systolic/diastolic)</label>
              <input
                type="text"
                name="Blood_Pressure"
                value={formData.Blood_Pressure}
                onChange={handleInputChange}
                placeholder="120/80"
                className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 transition-colors"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Heart Rate (bpm)</label>
              <input
                type="number"
                name="Heart_Rate"
                value={formData.Heart_Rate}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 transition-colors"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">BMI</label>
              <input
                type="number"
                name="BMI"
                value={formData.BMI}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 transition-colors"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Triglycerides (mg/dL)</label>
              <input
                type="number"
                name="Triglycerides"
                value={formData.Triglycerides}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 transition-colors"
              />
            </div>

            {/* Medical History */}
            <div className="col-span-2">
              <div className="flex items-center space-x-2 mb-6 mt-4">
                <h3 className="text-xl font-semibold text-gray-900">Medical History</h3>
                <div className="h-px flex-1 bg-gray-200"></div>
              </div>
            </div>

            <div className="space-y-4">
              <label className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
                <input
                  type="checkbox"
                  name="Diabetes"
                  checked={Boolean(formData.Diabetes)}
                  onChange={handleInputChange}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 h-5 w-5"
                />
                <span className="text-sm text-gray-700">Diabetes</span>
              </label>
            </div>

            <div className="space-y-4">
              <label className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
                <input
                  type="checkbox"
                  name="Family_History"
                  checked={Boolean(formData.Family_History)}
                  onChange={handleInputChange}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 h-5 w-5"
                />
                <span className="text-sm text-gray-700">Family History of Heart Disease</span>
              </label>
            </div>

            {/* Lifestyle Factors */}
            <div className="col-span-2">
              <div className="flex items-center space-x-2 mb-6 mt-4">
                <h3 className="text-xl font-semibold text-gray-900">Lifestyle Factors</h3>
                <div className="h-px flex-1 bg-gray-200"></div>
              </div>
            </div>

            <div className="space-y-4">
              <label className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
                <input
                  type="checkbox"
                  name="Smoking"
                  checked={Boolean(formData.Smoking)}
                  onChange={handleInputChange}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 h-5 w-5"
                />
                <span className="text-sm text-gray-700">Smoking</span>
              </label>
            </div>

            <div className="space-y-4">
              <label className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
                <input
                  type="checkbox"
                  name="Obesity"
                  checked={Boolean(formData.Obesity)}
                  onChange={handleInputChange}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 h-5 w-5"
                />
                <span className="text-sm text-gray-700">Obesity</span>
              </label>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Alcohol Consumption</label>
              <select
                name="Alcohol_Consumption"
                value={formData.Alcohol_Consumption}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 transition-colors"
              >
                <option value={0}>No</option>
                <option value={1}>Yes</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Diet</label>
              <select
                name="Diet"
                value={formData.Diet}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 transition-colors"
              >
                <option value="Unhealthy">Unhealthy</option>
                <option value="Average">Average</option>
                <option value="Healthy">Healthy</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Exercise Hours Per Week</label>
              <input
                type="number"
                name="Exercise_Hours_Per_Week"
                value={formData.Exercise_Hours_Per_Week}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 transition-colors"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Physical Activity Days Per Week</label>
              <input
                type="number"
                name="Physical_Activity_Days_Per_Week"
                value={formData.Physical_Activity_Days_Per_Week}
                onChange={handleInputChange}
                min="0"
                max="7"
                className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 transition-colors"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Sleep Hours Per Day</label>
              <input
                type="number"
                name="Sleep_Hours_Per_Day"
                value={formData.Sleep_Hours_Per_Day}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 transition-colors"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Sedentary Hours Per Day</label>
              <input
                type="number"
                name="Sedentary_Hours_Per_Day"
                value={formData.Sedentary_Hours_Per_Day}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 transition-colors"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Stress Level (1-10)</label>
              <input
                type="number"
                name="Stress_Level"
                value={formData.Stress_Level}
                onChange={handleInputChange}
                min="1"
                max="10"
                className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 transition-colors"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Income</label>
              <input
                type="number"
                name="Income"
                value={formData.Income}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 transition-colors"
              />
            </div>
          </div>

          <div className="flex justify-center pt-6">
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center px-8 py-4 border border-transparent text-lg font-medium rounded-xl text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow-lg transform transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {loading ? (
                <>
                  <Activity className="animate-spin h-5 w-5 mr-3" />
                  Processing...
                </>
              ) : (
                'Calculate Risk'
              )}
            </button>
          </div>
        </form>

        {error && (
          <div className="mt-6 p-4 bg-red-50 rounded-xl border border-red-100">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 text-red-400 flex-shrink-0" />
              <p className="ml-3 text-sm text-red-700">{error}</p>
            </div>
          </div>
        )}

        {result && (
          <div className="mt-8 bg-white p-8 rounded-xl shadow-lg border border-gray-100">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Your Risk Assessment</h2>
            <div className="space-y-4">
              <div className={`p-4 rounded-lg ${
                result.prediction === 1 
                  ? 'bg-red-50 border-2 border-red-100' 
                  : 'bg-green-50 border-2 border-green-100'
              }`}>
                <p className="text-lg font-medium">
                  Risk Level: {' '}
                  <span className={
                    result.prediction === 1 ? 'text-red-700' : 'text-green-700'
                  }>
                    {result.prediction === 1 ? 'High Risk' : 'Low Risk'}
                  </span>
                </p>
                <div className="mt-2 bg-white rounded-lg p-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Risk Probability</span>
                    <span className="text-sm font-medium text-gray-900">
                      {(result.probability * 100).toFixed(2)}%
                    </span>
                  </div>
                  <div className="mt-2 h-2 bg-gray-200 rounded-full">
                    <div
                      className={`h-2 rounded-full ${
                        result.prediction === 1 ? 'bg-red-500' : 'bg-green-500'
                      }`}
                      style={{ width: `${result.probability * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
