import React, { useState } from 'react';
import axios from 'axios';
import { Heart, Activity, AlertCircle } from 'lucide-react';

interface PredictionResult {
  prediction: number;
  probability: number;
}

function App() {
  const [formData, setFormData] = useState({
    Age: 45,
    Sex: 'Male',
    Cholesterol: 200,
    Blood_Pressure: 120,
    Heart_Rate: 75,
    Diabetes: false,
    Family_History: false,
    Smoking: false,
    Obesity: false,
    Alcohol_Consumption: 'None',
    Exercise_Hours_Per_Week: 3,
    Diet: 'Average',
    Previous_Heart_Problems: false,
    Medication_Use: false,
    Stress_Level: 5,
    Sedentary_Hours_Per_Day: 8,
    Income: 50000,
    BMI: 25,
    Triglycerides: 150,
    Physical_Activity_Days_Per_Week: 3,
    Sleep_Hours_Per_Day: 7,
    Country: 'USA',
    Continent: 'North America',
    Hemisphere: 'Northern'
  });

  const [result, setResult] = useState<PredictionResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post('http://localhost:5000/predict', formData);
      setResult(response.data);
    } catch (err) {
      setError('Error making prediction. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : 
              type === 'number' ? Number(value) : value
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <Heart className="mx-auto h-12 w-12 text-red-500" />
          <h1 className="mt-3 text-3xl font-extrabold text-gray-900">
            Heart Attack Risk Prediction
          </h1>
          <p className="mt-2 text-lg text-gray-600">
            Enter your health information to assess your heart attack risk
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6 bg-white p-8 rounded-lg shadow">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {/* Personal Information */}
            <div className="col-span-2">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Personal Information</h3>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Age</label>
              <input
                type="number"
                name="Age"
                value={formData.Age}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Sex</label>
              <select
                name="Sex"
                value={formData.Sex}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>

            {/* Health Metrics */}
            <div className="col-span-2">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Health Metrics</h3>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Cholesterol (mg/dL)</label>
              <input
                type="number"
                name="Cholesterol"
                value={formData.Cholesterol}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Blood Pressure (mmHg)</label>
              <input
                type="number"
                name="Blood_Pressure"
                value={formData.Blood_Pressure}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Heart Rate (bpm)</label>
              <input
                type="number"
                name="Heart_Rate"
                value={formData.Heart_Rate}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">BMI</label>
              <input
                type="number"
                name="BMI"
                value={formData.BMI}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Triglycerides (mg/dL)</label>
              <input
                type="number"
                name="Triglycerides"
                value={formData.Triglycerides}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>

            {/* Medical History */}
            <div className="col-span-2">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Medical History</h3>
            </div>

            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="Diabetes"
                  checked={formData.Diabetes}
                  onChange={handleInputChange}
                  className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <span className="ml-2 text-sm text-gray-700">Diabetes</span>
              </label>
            </div>

            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="Family_History"
                  checked={formData.Family_History}
                  onChange={handleInputChange}
                  className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <span className="ml-2 text-sm text-gray-700">Family History of Heart Disease</span>
              </label>
            </div>

            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="Previous_Heart_Problems"
                  checked={formData.Previous_Heart_Problems}
                  onChange={handleInputChange}
                  className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <span className="ml-2 text-sm text-gray-700">Previous Heart Problems</span>
              </label>
            </div>

            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="Medication_Use"
                  checked={formData.Medication_Use}
                  onChange={handleInputChange}
                  className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <span className="ml-2 text-sm text-gray-700">Currently Using Medication</span>
              </label>
            </div>

            {/* Lifestyle Factors */}
            <div className="col-span-2">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Lifestyle Factors</h3>
            </div>

            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="Smoking"
                  checked={formData.Smoking}
                  onChange={handleInputChange}
                  className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <span className="ml-2 text-sm text-gray-700">Smoking</span>
              </label>
            </div>

            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="Obesity"
                  checked={formData.Obesity}
                  onChange={handleInputChange}
                  className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <span className="ml-2 text-sm text-gray-700">Obesity</span>
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Alcohol Consumption</label>
              <select
                name="Alcohol_Consumption"
                value={formData.Alcohol_Consumption}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              >
                <option value="None">None</option>
                <option value="Light">Light</option>
                <option value="Moderate">Moderate</option>
                <option value="Heavy">Heavy</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Diet</label>
              <select
                name="Diet"
                value={formData.Diet}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              >
                <option value="Poor">Poor</option>
                <option value="Average">Average</option>
                <option value="Good">Good</option>
                <option value="Excellent">Excellent</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Exercise Hours Per Week</label>
              <input
                type="number"
                name="Exercise_Hours_Per_Week"
                value={formData.Exercise_Hours_Per_Week}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Physical Activity Days Per Week</label>
              <input
                type="number"
                name="Physical_Activity_Days_Per_Week"
                value={formData.Physical_Activity_Days_Per_Week}
                onChange={handleInputChange}
                min="0"
                max="7"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Sleep Hours Per Day</label>
              <input
                type="number"
                name="Sleep_Hours_Per_Day"
                value={formData.Sleep_Hours_Per_Day}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Sedentary Hours Per Day</label>
              <input
                type="number"
                name="Sedentary_Hours_Per_Day"
                value={formData.Sedentary_Hours_Per_Day}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Stress Level (1-10)</label>
              <input
                type="number"
                name="Stress_Level"
                value={formData.Stress_Level}
                onChange={handleInputChange}
                min="1"
                max="10"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>

            {/* Demographic Information */}
            <div className="col-span-2">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Demographic Information</h3>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Income</label>
              <input
                type="number"
                name="Income"
                value={formData.Income}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Country</label>
              <input
                type="text"
                name="Country"
                value={formData.Country}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Continent</label>
              <select
                name="Continent"
                value={formData.Continent}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              >
                <option value="North America">North America</option>
                <option value="South America">South America</option>
                <option value="Europe">Europe</option>
                <option value="Asia">Asia</option>
                <option value="Africa">Africa</option>
                <option value="Australia">Australia</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Hemisphere</label>
              <select
                name="Hemisphere"
                value={formData.Hemisphere}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              >
                <option value="Northern">Northern</option>
                <option value="Southern">Southern</option>
              </select>
            </div>
          </div>

          <div className="flex justify-center">
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              {loading ? (
                <Activity className="animate-spin h-5 w-5 mr-3" />
              ) : (
                'Predict Risk'
              )}
            </button>
          </div>
        </form>

        {error && (
          <div className="mt-4 p-4 bg-red-50 rounded-md">
            <div className="flex">
              <AlertCircle className="h-5 w-5 text-red-400" />
              <p className="ml-3 text-sm text-red-700">{error}</p>
            </div>
          </div>
        )}

        {result && (
          <div className="mt-8 bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-medium text-gray-900">Prediction Result</h2>
            <div className="mt-4">
              <p className="text-sm text-gray-500">
                Risk Level: <span className="font-medium text-gray-900">
                  {result.prediction === 1 ? 'High Risk' : 'Low Risk'}
                </span>
              </p>
              <p className="text-sm text-gray-500">
                Probability: <span className="font-medium text-gray-900">
                  {(result.probability * 100).toFixed(2)}%
                </span>
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;