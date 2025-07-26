# BloomBuddy ML Models Integration

This guide explains how to integrate your trained ML models (diabetes, heart disease, hypertension) with the BloomBuddy application.

## Setup Instructions

### 1. Prepare Your ML Models

Place your trained ML model files in a `models/` directory:

```
models/
├── diabetes_model.pkl
├── diabetes_scaler.pkl
├── heart_model.pkl
├── heart_scaler.pkl
├── hypertension_model.pkl
└── hypertension_scaler.pkl
```

**Note**: Your models should be saved using `pickle` or `joblib`. If you used different formats (like TensorFlow/PyTorch), you'll need to modify the loading code in `ml-api-server.py`.

**Important**: If you used StandardScaler, MinMaxScaler, or any other preprocessing during training, make sure to save and include the scaler files. The same scaling must be applied to input features during prediction.

### How to Save Your Scalers

If you used scaling during training, make sure to save the scaler objects:

```python
import pickle
from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier

# Example for diabetes model
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Create and fit scaler
scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)

# Train your model
model = RandomForestClassifier()
model.fit(X_train_scaled, y_train)

# Save both model and scaler
with open('models/diabetes_model.pkl', 'wb') as f:
    pickle.dump(model, f)
    
with open('models/diabetes_scaler.pkl', 'wb') as f:
    pickle.dump(scaler, f)
```

**Note**: Repeat this process for all three models (diabetes, heart, hypertension) if you used scaling.

### Helper Script for Existing Models

If you already have trained models but haven't saved the scalers, use the provided helper script:

```bash
python save_scalers_helper.py
```

**Important**: You'll need to modify the helper script with your actual data loading and preprocessing steps to ensure the scalers match your training process.

### 2. Set Up the Python API Server

1. **Install Python dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

2. **Configure environment variables (optional):**
   ```bash
   export MODELS_DIR="./models"
   export PORT=5000
   export DEBUG=false
   ```

3. **Run the API server:**
   ```bash
   python ml-api-server.py
   ```

   The server will start on `http://localhost:5000`

### 3. Configure the Frontend

Update your `.env` file in the React app:

```bash
VITE_ML_API_URL=http://localhost:5000/api
```

### 4. Model Input Specifications

#### Diabetes Model
Expected features (in order):
1. `pregnancies` - Number of pregnancies
2. `glucose` - Glucose level (mg/dL)
3. `blood_pressure` - Blood pressure (mmHg)
4. `skin_thickness` - Skin thickness (mm)
5. `insulin` - Insulin level (mu U/ml)
6. `bmi` - Body Mass Index
7. `diabetes_pedigree_function` - Diabetes pedigree function
8. `age` - Age in years

#### Heart Disease Model
Expected features (in order):
1. `age` - Age in years
2. `sex` - Sex (0: Female, 1: Male)
3. `chest_pain_type` - Chest pain type (0-3)
4. `resting_bp` - Resting blood pressure (mmHg)
5. `cholesterol` - Cholesterol level (mg/dL)
6. `fasting_bs` - Fasting blood sugar (0: <120mg/dl, 1: >120mg/dl)
7. `resting_ecg` - Resting ECG (0-2)
8. `max_hr` - Maximum heart rate achieved
9. `exercise_angina` - Exercise-induced angina (0: No, 1: Yes)
10. `oldpeak` - ST depression induced by exercise
11. `st_slope` - Slope of peak exercise ST segment (0-2)

#### Hypertension Model
Expected features (in order):
1. `age` - Age in years
2. `systolic_bp` - Systolic blood pressure (mmHg)
3. `diastolic_bp` - Diastolic blood pressure (mmHg)
4. `bmi` - Body Mass Index
5. `smoking` - Smoking status (0: No, 1: Yes)
6. `alcohol` - Alcohol consumption (0: No, 1: Yes)
7. `exercise` - Regular exercise (0: No, 1: Yes)
8. `family_history` - Family history of hypertension (0: No, 1: Yes)
9. `stress` - Stress level (0-10 scale)

## API Endpoints

### Health Check
```
GET /health
```
Returns server health status and loaded models.

### Diabetes Prediction
```
POST /api/predict/diabetes
Content-Type: application/json

{
  "features": [pregnancies, glucose, blood_pressure, skin_thickness, insulin, bmi, diabetes_pedigree_function, age]
}
```

### Heart Disease Prediction
```
POST /api/predict/heart
Content-Type: application/json

{
  "features": [age, sex, chest_pain_type, resting_bp, cholesterol, fasting_bs, resting_ecg, max_hr, exercise_angina, oldpeak, st_slope]
}
```

### Hypertension Prediction
```
POST /api/predict/hypertension
Content-Type: application/json

{
  "features": [age, systolic_bp, diastolic_bp, bmi, smoking, alcohol, exercise, family_history, stress]
}
```

### Model Information
```
GET /api/models/info
```
Returns information about all loaded models and their expected features.

## Response Format

All prediction endpoints return:

```json
{
  "probability": 0.75,      // Risk probability (0-1)
  "prediction": 1,          // Binary prediction (0 or 1)
  "confidence": 0.85,       // Model confidence
  "model_version": "1.0"    // Model version
}
```

## Customization

### Adding Preprocessing
If your models require preprocessing (scaling, normalization), modify the `preprocess_features()` function in `ml-api-server.py`.

### Different Model Formats
If you're using TensorFlow, PyTorch, or other formats, update the model loading code in the `load_models()` function.

### Additional Features
You can add more endpoints or modify existing ones based on your specific model requirements.

## Production Deployment

For production deployment:

1. **Use Gunicorn:**
   ```bash
   gunicorn -w 4 -b 0.0.0.0:5000 ml-api-server:app
   ```

2. **Use Docker:**
   ```dockerfile
   FROM python:3.9-slim
   WORKDIR /app
   COPY requirements.txt .
   RUN pip install -r requirements.txt
   COPY . .
   EXPOSE 5000
   CMD ["gunicorn", "-w", "4", "-b", "0.0.0.0:5000", "ml-api-server:app"]
   ```

3. **Environment Variables:**
   - `MODELS_DIR`: Path to model files
   - `PORT`: Server port (default: 5000)
   - `DEBUG`: Debug mode (default: False)

## Testing the Integration

1. Start the ML API server
2. Start the React development server
3. Navigate to the prediction form in the app
4. Fill out the form and submit
5. You should see:
   - ML model predictions with risk percentages
   - AI-generated suggestions based on the risk level
   - Comprehensive recommendations and next steps

## Troubleshooting

- **Models not loading**: Check that your model files are in the correct format and location
- **CORS issues**: Ensure Flask-CORS is properly configured
- **Feature mismatch**: Verify that your model expects the correct number and order of features
- **API connection**: Check that `VITE_ML_API_URL` is correctly set in your `.env` file
- **Scaler issues**: 
  - If you used scaling during training but don't have scaler files, the API will log warnings and use raw features (predictions may be inaccurate)
  - Make sure scaler files are saved with the same preprocessing steps used during training
  - Verify scaler files are in the same directory as model files
  - Check the `/health` endpoint to confirm both models and scalers are loaded
- **Poor prediction accuracy**: This often indicates scaler mismatch - ensure the same preprocessing is applied during both training and prediction
