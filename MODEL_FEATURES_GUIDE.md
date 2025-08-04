# ML Model Features Guide

## 🌐 Production API Endpoints
**Live Backend**: https://web-production-1e69f.up.railway.app/api  
**Note**: Examples below use production URLs. For local development, replace with `http://localhost:5000/api`

---

## Overview
This guide documents the exact feature requirements for each ML model in BloomBuddy based on your trained models.

## Model Feature Requirements

### 1. Diabetes Model (RandomForestClassifier)
**Features Required (8 total):**
```
[Pregnancies, Glucose, BloodPressure, SkinThickness, Insulin, BMI, DiabetesPedigreeFunction, Age]
```

**Form Fields Mapping:**
- `pregnancies` → Number of pregnancies
- `glucose` → Glucose level (mg/dL)
- `bloodPressure` → Diastolic blood pressure (mmHg)
- `skinThickness` → Triceps skin fold thickness (mm)
- `insulin` → 2-Hour serum insulin (mu U/ml)
- `bmi` → Body mass index (kg/m²)
- `diabetesPedigreeFunction` → Diabetes pedigree function score
- `age` → Age in years

### 2. Heart Disease Model (XGBClassifier)
**Features Required (13 total):**
```
[age, sex, cp, trestbps, chol, fbs, restecg, thalach, exang, oldpeak, slope, ca, thal]
```

**Form Fields Mapping:**
- `age` → Age in years
- `sex` → Sex (0: Female, 1: Male)
- `chestPain` → Chest pain type (0-3)
- `restingBP` → Resting blood pressure (mmHg)
- `cholesterol` → Serum cholesterol (mg/dL)
- `fastingBS` → Fasting blood sugar > 120 mg/dl (0: No, 1: Yes)
- `restingECG` → Resting electrocardiographic results (0-2)
- `maxHeartRate` → Maximum heart rate achieved (bpm)
- `exerciseAngina` → Exercise induced angina (0: No, 1: Yes)
- `oldpeak` → ST depression induced by exercise
- `slope` → Slope of peak exercise ST segment (0-2)
- `ca` → Number of major vessels colored by fluoroscopy (0-3)
- `thal` → Thalassemia (1: Normal, 2: Fixed defect, 3: Reversible defect)

### 3. Hypertension Model (LogisticRegression)
**Features Required (12 total):**
```
[male, age, currentSmoker, cigsPerDay, BPMeds, diabetes, totChol, sysBP, diaBP, BMI, heartRate, glucose]
```

**Form Fields Mapping:**
- `sex` → Sex (0: Female, 1: Male)
- `age` → Age in years
- `currentSmoker` → Current smoker (0: No, 1: Yes)
- `cigsPerDay` → Cigarettes per day
- `BPMeds` → Blood pressure medication (0: No, 1: Yes)
- `diabetes` → Diabetes (0: No, 1: Yes)
- `totChol` → Total cholesterol (mg/dL)
- `sysBP` → Systolic blood pressure (mmHg)
- `diaBP` → Diastolic blood pressure (mmHg)
- `bmi` → Body mass index (kg/m²)
- `heartRate` → Heart rate (bpm)
- `glucose` → Glucose level (mg/dL)

## Frontend Integration

### Updated Form Fields
The frontend forms have been updated to collect the exact features required by each model:

**Diabetes Form:** 8 fields matching the trained model
**Heart Disease Form:** 13 fields matching the trained model  
**Hypertension Form:** 12 fields matching the trained model

### API Payload Structure
Each prediction sends features in the exact order expected by the trained models:

```typescript
// Diabetes API call
{
  "features": [pregnancies, glucose, bloodPressure, skinThickness, insulin, bmi, diabetesPedigreeFunction, age]
}

// Heart Disease API call  
{
  "features": [age, sex, cp, trestbps, chol, fbs, restecg, thalach, exang, oldpeak, slope, ca, thal]
}

// Hypertension API call
{
  "features": [male, age, currentSmoker, cigsPerDay, BPMeds, diabetes, totChol, sysBP, diaBP, BMI, heartRate, glucose]
}
```

## Model Performance
Based on your model analysis:

| Model | Algorithm | Accuracy | Precision | Recall | F1-Score |
|-------|-----------|----------|-----------|--------|----------|
| Diabetes | RandomForest | 94.16% | 94.12% | 88.89% | 91.43% |
| Heart Disease | XGBoost | 96.72% | 94.29% | 100% | 97.06% |
| Hypertension | LogisticRegression | 86.82% | 80.27% | 76.50% | 78.34% |

## Testing Your Models

### 1. Start the ML API Server
```bash
cd models
python ../ml-api-server.py
```

### 2. Test Individual Predictions
```bash
# Test Diabetes
curl -X POST http://localhost:5000/api/predict/diabetes \
  -H "Content-Type: application/json" \
  -d '{"features": [1, 120, 70, 20, 80, 25.5, 0.5, 35]}'

# Test Heart Disease  
curl -X POST http://localhost:5000/api/predict/heart \
  -H "Content-Type: application/json" \
  -d '{"features": [45, 1, 0, 120, 200, 0, 0, 150, 0, 1.0, 1, 0, 1]}'

# Test Hypertension
curl -X POST http://localhost:5000/api/predict/hypertension \
  -H "Content-Type: application/json" \
  -d '{"features": [1, 45, 1, 10, 0, 0, 220, 140, 90, 28, 75, 95]}'
```

### 3. Debug Model Loading
```bash
curl http://localhost:5000/debug/models
```

## Troubleshooting

### Common Issues:
1. **Feature Count Mismatch:** Ensure frontend sends exact number of features
2. **Feature Order:** Features must be in exact order as training data
3. **Data Types:** Ensure numeric fields are converted to numbers
4. **Missing Values:** Handle with appropriate defaults

### Default Values Used:
- **Diabetes:** pregnancies=0, glucose=100, bloodPressure=70, etc.
- **Heart:** sex=1, chestPain=0, restingBP=120, etc.  
- **Hypertension:** sex=0, smoking=0, cigsPerDay=0, etc.

## Next Steps
1. Test each model endpoint individually
2. Verify feature mappings in frontend forms
3. Check model loading in ML API server
4. Validate prediction accuracy with known test cases
