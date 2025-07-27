import pandas as pd
import joblib
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import accuracy_score, precision_score, classification_report
from xgboost import XGBClassifier

# Step 1: Load dataset
data = pd.read_csv('heart.csv')

# Step 2: Handle missing values (if any)
data = data.dropna()

# Step 3: Features & Target
X = data.drop('target', axis=1)
y = data['target']

# Step 4: Feature Scaling
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)

# Step 5: Train-Test Split
X_train, X_test, y_train, y_test = train_test_split(X_scaled, y, test_size=0.2, random_state=42)

# Step 6: Model
model = XGBClassifier(use_label_encoder=False, eval_metric='logloss', random_state=42)
model.fit(X_train, y_train)

# Step 7: Evaluation
y_pred = model.predict(X_test)
accuracy = accuracy_score(y_test, y_pred)
precision = precision_score(y_test, y_pred)

print("Accuracy: {:.2f}%".format(accuracy * 100))
print("Precision: {:.2f}%".format(precision * 100))
print("\nClassification Report:\n", classification_report(y_test, y_pred))

# Step 8: Save model and scaler as .pkl files
joblib.dump(model, 'heart_disease_model.pkl')
joblib.dump(scaler, 'heart_scaler.pkl')

print("\nModel and scaler saved as 'heart_disease_model.pkl' and 'heart_scaler.pkl'")