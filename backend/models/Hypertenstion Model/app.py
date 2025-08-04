# Import necessary libraries
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score, confusion_matrix, classification_report, roc_auc_score
from sklearn.preprocessing import StandardScaler
import numpy as np
import joblib
# --- 1. Load Your Dataset ---
# IMPORTANT: Replace 'hypertension_data.csv' with the actual path to your dataset file.
try:
    # Assuming the data is in a CSV file. If it's Excel, use pd.read_excel()
    df = pd.read_csv('hypertension.csv')
    print("Dataset loaded successfully!")
    print("First 5 rows of the dataset:")
    print(df.head())
except FileNotFoundError:
    print("Error: 'hypertension.csv' not found.")
    print("Please make sure your data file is in the same directory as this script, or provide the full path.")
    exit() # Exit the script if the file is not found


# --- 2. Data Preprocessing ---
# A simple check for missing values.
print("\nChecking for missing values...")
print(df.isnull().sum())

# For this example, we'll fill missing values with the median of each column.
# For a real-world project, you might consider more advanced imputation techniques.
for col in df.columns:
    if df[col].isnull().any():
        median_val = df[col].median()
        df[col].fillna(median_val, inplace=True)
        print(f"Filled missing values in '{col}' with median value: {median_val}")

# --- 3. Define Features (X) and Target (y) ---
# Based on your screenshot, 'Risk' is the target variable.
# All other columns are features.
try:
    X = df.drop('Risk', axis=1)
    y = df['Risk']
    
    # Store feature names for later use
    feature_names = X.columns.tolist()

except KeyError:
    print("\nError: 'Risk' column not found in the dataframe.")
    print("Please ensure your target column is named 'Risk'.")
    exit()

print("\nFeatures (X):")
print(X.head())
print("\nTarget (y):")
print(y.head())


# --- 4. Scale Numerical Features ---
# Scaling features helps the model converge faster and perform better.
# We use StandardScaler to give all features a similar scale.
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)

# Convert the scaled array back to a DataFrame to keep column names
X_scaled = pd.DataFrame(X_scaled, columns=feature_names)

print("\nScaled Features (first 5 rows):")
print(X_scaled.head())


# --- 5. Split Data into Training and Testing Sets ---
# We'll use 80% of the data for training and 20% for testing.
# `random_state` ensures that the split is the same every time you run the code.
X_train, X_test, y_train, y_test = train_test_split(X_scaled, y, test_size=0.2, random_state=42, stratify=y)

print(f"\nTraining set size: {X_train.shape[0]} samples")
print(f"Testing set size: {X_test.shape[0]} samples")


# --- 6. Train the Logistic Regression Model ---
# We initialize the model and then 'fit' it to our training data.
model = LogisticRegression(random_state=42)
print("\nTraining the Logistic Regression model...")
model.fit(X_train, y_train)
print("Model training complete!")


# --- 7. Evaluate the Model ---
print("\n--- Model Evaluation ---")
# Make predictions on the test data
y_pred = model.predict(X_test)
y_pred_proba = model.predict_proba(X_test)[:, 1] # Probability of risk (class 1)

# Calculate and print performance metrics
accuracy = accuracy_score(y_test, y_pred)
roc_auc = roc_auc_score(y_test, y_pred_proba)
conf_matrix = confusion_matrix(y_test, y_pred)
class_report = classification_report(y_test, y_pred)

print(f"Accuracy: {accuracy:.4f}")
print(f"ROC AUC Score: {roc_auc:.4f}")
print("\nConfusion Matrix:")
print(conf_matrix)
print("\nClassification Report:")
print(class_report)


# --- 8. Interpreting the Model ---
# The coefficients tell us the importance of each feature.
# A positive coefficient increases the log-odds of having hypertension risk, and a negative one decreases it.
print("\n--- Model Interpretation ---")
coefficients = pd.DataFrame(model.coef_[0], index=feature_names, columns=['Coefficient'])
coefficients = coefficients.sort_values(by='Coefficient', ascending=False)
print("Model Coefficients:")
print(coefficients)


# --- 9. Example: Predict on New Data ---
# This shows how you would use the trained model to predict the risk for a new person.
print("\n--- Example Prediction on a New Patient ---")
# Create a dictionary with the new patient's data.
# IMPORTANT: The keys must match the feature names exactly.
new_patient_data = {
    'male': [1],          # 1 for male, 0 for female
    'age': [55],
    'currentSmoker': [1], # 1 for yes, 0 for no
    'cigsPerDay': [20],
    'BPMeds': [0],        # 1 for yes, 0 for no
    'diabetes': [0],      # 1 for yes, 0 for no
    'totChol': [260],
    'sysBP': [145],
    'diaBP': [92],
    'BMI': [30.3],
    'heartRate': [78],
    'glucose': [99]
}

# Convert the dictionary to a DataFrame
new_patient_df = pd.DataFrame(new_patient_data)

# IMPORTANT: Apply the same scaling to the new data that was used for the training data.
new_patient_scaled = scaler.transform(new_patient_df)

# Make the prediction
prediction = model.predict(new_patient_scaled)
prediction_probability = model.predict_proba(new_patient_scaled)

print(f"\nNew Patient Data: {new_patient_data}")
print(f"Predicted Risk (0=No, 1=Yes): {prediction[0]}")
print(f"Prediction Probabilities [No Risk, Risk]: {prediction_probability[0]}")
print(f"The predicted probability of this patient having hypertension risk is: {prediction_probability[0][1]*100:.2f}%")

# --- 10. Save the Model and Scaler to .pkl Files ---
# We save the trained model and the scaler so we can use them later without retraining.
# This is essential for deploying the model in an application.
print("\n--- Saving Model and Scaler ---")
model_filename = 'hypertension_model.pkl'
scaler_filename = 'scaler.pkl'

# Save to the current directory (Hypertenstion Model folder)
joblib.dump(model, model_filename)
joblib.dump(scaler, scaler_filename)

print(f"Model saved to '{model_filename}'")
print(f"Scaler saved to '{scaler_filename}'")

# Verify the saved files
print("\n--- Verifying Saved Files ---")
import os
if os.path.exists(model_filename):
    test_model = joblib.load(model_filename)
    print(f"✅ Model verification: {type(test_model)} - Has predict: {hasattr(test_model, 'predict')}")
else:
    print("❌ Model file not found after saving")

if os.path.exists(scaler_filename):
    test_scaler = joblib.load(scaler_filename)
    print(f"✅ Scaler verification: {type(test_scaler)} - Has transform: {hasattr(test_scaler, 'transform')}")
else:
    print("❌ Scaler file not found after saving")
