import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score
from sklearn.preprocessing import StandardScaler
import pickle
import warnings
warnings.filterwarnings("ignore")

# Load the CSV data
data = pd.read_csv('diabetes.csv')
data = data.dropna(subset=['Outcome'])

# Features and target
X = data.drop('Outcome', axis=1)
y = data['Outcome']

# Replace 0s with median in selected features
cols_with_zero = ['Glucose', 'BloodPressure', 'SkinThickness', 'Insulin', 'BMI']
for col in cols_with_zero:
    X[col] = X[col].replace(0, X[col].median())

# Feature scaling
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)

# Train-test split
X_train, X_test, y_train, y_test = train_test_split(X_scaled, y, test_size=0.2, random_state=42)

# Train RandomForest model
model = RandomForestClassifier(n_estimators=100, random_state=42)
model.fit(X_train, y_train)

# Predict and evaluate
y_pred = model.predict(X_test)
accuracy = accuracy_score(y_test, y_pred)
print("Accuracy: {:.2f}%".format(accuracy * 100))

# Save model to .pkl
# with open('model.pkl', 'wb') as model_file:
#     pickle.dump(model, model_file)

# # Save scaler to .pkl
# with open('scaler.pkl', 'wb') as scaler_file:
#     pickle.dump(scaler, scaler_file)

# print("Model and scaler have been saved as .pkl files.")