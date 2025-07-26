# BloomBuddy ML Models API Server
# This is a template for connecting your trained ML models

from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np
import pickle
import logging
from typing import Dict, List, Any
import os
import requests
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Global variables to store loaded models and scalers
models = {
    'diabetes': None,
    'heart': None,
    'hypertension': None
}

scalers = {
    'diabetes': None,
    'heart': None,
    'hypertension': None
}

def load_models():
    """Load your trained ML models and scalers"""
    try:
        # Replace these paths with your actual model files
        models_dir = os.getenv('MODELS_DIR', './models')
        
        # Load diabetes model and scaler
        diabetes_model_path = os.path.join(models_dir, 'diabetes_model.pkl')
        diabetes_scaler_path = os.path.join(models_dir, 'diabetes_scaler.pkl')
        if os.path.exists(diabetes_model_path):
            with open(diabetes_model_path, 'rb') as f:
                models['diabetes'] = pickle.load(f)
            logger.info("Diabetes model loaded successfully")
            
            if os.path.exists(diabetes_scaler_path):
                with open(diabetes_scaler_path, 'rb') as f:
                    scalers['diabetes'] = pickle.load(f)
                logger.info("Diabetes scaler loaded successfully")
            else:
                logger.warning("Diabetes scaler not found - predictions may be inaccurate if scaling was used during training")
        
        # Load heart disease model and scaler
        heart_model_path = os.path.join(models_dir, 'heart_model.pkl')
        heart_scaler_path = os.path.join(models_dir, 'heart_scaler.pkl')
        if os.path.exists(heart_model_path):
            with open(heart_model_path, 'rb') as f:
                models['heart'] = pickle.load(f)
            logger.info("Heart disease model loaded successfully")
            
            if os.path.exists(heart_scaler_path):
                with open(heart_scaler_path, 'rb') as f:
                    scalers['heart'] = pickle.load(f)
                logger.info("Heart disease scaler loaded successfully")
            else:
                logger.warning("Heart disease scaler not found - predictions may be inaccurate if scaling was used during training")
        
        # Load hypertension model and scaler
        hypertension_model_path = os.path.join(models_dir, 'hypertension_model.pkl')
        hypertension_scaler_path = os.path.join(models_dir, 'hypertension_scaler.pkl')
        if os.path.exists(hypertension_model_path):
            with open(hypertension_model_path, 'rb') as f:
                models['hypertension'] = pickle.load(f)
            logger.info("Hypertension model loaded successfully")
            
            if os.path.exists(hypertension_scaler_path):
                with open(hypertension_scaler_path, 'rb') as f:
                    scalers['hypertension'] = pickle.load(f)
                logger.info("Hypertension scaler loaded successfully")
            else:
                logger.warning("Hypertension scaler not found - predictions may be inaccurate if scaling was used during training")
            
    except Exception as e:
        logger.error(f"Error loading models: {str(e)}")

def preprocess_features(features: List[float], model_type: str) -> np.ndarray:
    """Preprocess features based on model requirements"""
    try:
        # Convert to numpy array
        features_array = np.array(features).reshape(1, -1)
        
        # Apply scaling if scaler is available
        if scalers[model_type] is not None:
            logger.info(f"Applying {model_type} scaler to features")
            features_array = scalers[model_type].transform(features_array)
        else:
            logger.warning(f"No scaler found for {model_type} - using raw features")
        
        return features_array
    except Exception as e:
        logger.error(f"Error preprocessing features: {str(e)}")
        raise

@app.route('/api/llm/chat', methods=['POST'])
def llm_chat():
    """Proxy endpoint for LLM API calls to avoid CORS issues"""
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({'error': 'No data provided'}), 400
        
        # Get the provider from the request (default to anthropic)
        provider = data.get('provider', 'anthropic')
        
        if provider == 'anthropic':
            return handle_anthropic_request(data)
        else:
            return jsonify({'error': f'Unsupported provider: {provider}'}), 400
            
    except Exception as e:
        logger.error(f"LLM chat error: {str(e)}")
        return jsonify({'error': str(e)}), 500

def handle_anthropic_request(data):
    """Handle Anthropic API requests"""
    try:
        # Get API key from environment variable
        api_key = os.getenv('ANTHROPIC_API_KEY')
        if not api_key:
            return jsonify({'error': 'Anthropic API key not configured'}), 500
        
        # Extract request data
        messages = data.get('messages', [])
        options = data.get('options', {})
        
        if not messages:
            return jsonify({'error': 'No messages provided'}), 400
        
        # Prepare the request for Anthropic API
        anthropic_request = {
            'model': data.get('model', 'claude-3-5-sonnet-20241022'),
            'messages': messages,
            'max_tokens': options.get('maxTokens', 8000),
            'temperature': options.get('temperature', 0.7)
        }
        
        # Add system message if provided
        system_message = data.get('system')
        if system_message:
            anthropic_request['system'] = system_message
        
        # Make request to Anthropic API
        headers = {
            'Content-Type': 'application/json',
            'x-api-key': api_key,
            'anthropic-version': '2023-06-01'
        }
        
        response = requests.post(
            'https://api.anthropic.com/v1/messages',
            headers=headers,
            json=anthropic_request,
            timeout=60
        )
        
        if response.status_code == 200:
            anthropic_data = response.json()
            
            # Format response to match our frontend expectations
            return jsonify({
                'content': anthropic_data.get('content', [{}])[0].get('text', ''),
                'usage': {
                    'promptTokens': anthropic_data.get('usage', {}).get('input_tokens', 0),
                    'completionTokens': anthropic_data.get('usage', {}).get('output_tokens', 0),
                    'totalTokens': (
                        anthropic_data.get('usage', {}).get('input_tokens', 0) + 
                        anthropic_data.get('usage', {}).get('output_tokens', 0)
                    )
                },
                'model': anthropic_data.get('model', 'claude-3-5-sonnet-20241022'),
                'provider': 'anthropic'
            })
        else:
            error_data = response.json() if response.headers.get('content-type', '').startswith('application/json') else {'error': response.text}
            logger.error(f"Anthropic API error: {response.status_code} - {error_data}")
            return jsonify({
                'error': f"Anthropic API error: {error_data.get('error', {}).get('message', 'Unknown error')}"
            }), response.status_code
            
    except requests.exceptions.RequestException as e:
        logger.error(f"Request error: {str(e)}")
        return jsonify({'error': f'Request failed: {str(e)}'}), 500
    except Exception as e:
        logger.error(f"Anthropic request error: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'models_loaded': {
            'diabetes': {
                'model': models['diabetes'] is not None,
                'scaler': scalers['diabetes'] is not None
            },
            'heart': {
                'model': models['heart'] is not None,
                'scaler': scalers['heart'] is not None
            },
            'hypertension': {
                'model': models['hypertension'] is not None,
                'scaler': scalers['hypertension'] is not None
            }
        }
    })

@app.route('/api/predict/diabetes', methods=['POST'])
def predict_diabetes():
    """
    Predict diabetes risk
    Expected features: [pregnancies, glucose, blood_pressure, skin_thickness, insulin, bmi, diabetes_pedigree_function, age]
    """
    try:
        data = request.get_json()
        
        if not data or 'features' not in data:
            return jsonify({'error': 'Missing features in request'}), 400
        
        features = data['features']
        
        # Validate feature count (adjust based on your model)
        expected_features = 8  # Adjust this based on your diabetes model
        if len(features) != expected_features:
            return jsonify({'error': f'Expected {expected_features} features, got {len(features)}'}), 400
        
        # Preprocess features
        processed_features = preprocess_features(features, 'diabetes')
        
        # Make prediction
        if models['diabetes'] is not None:
            # Use your trained model
            prediction = models['diabetes'].predict(processed_features)[0]
            probability = models['diabetes'].predict_proba(processed_features)[0]
            
            # Get probability of positive class (diabetes = 1)
            diabetes_probability = probability[1] if len(probability) > 1 else prediction
            
        else:
            # Fallback prediction logic (remove this when you have actual models)
            logger.warning("Diabetes model not loaded, using fallback logic")
            glucose, bmi, age = features[1], features[5], features[7]
            
            # Simple rule-based fallback
            risk_score = 0.1  # Base risk
            if glucose > 140: risk_score += 0.4
            if bmi > 30: risk_score += 0.3
            if age > 45: risk_score += 0.2
            
            diabetes_probability = min(risk_score, 0.95)
        
        return jsonify({
            'probability': float(diabetes_probability),
            'prediction': int(diabetes_probability > 0.5),
            'confidence': 0.85,  # You can calculate this based on your model
            'model_version': '1.0'
        })
        
    except Exception as e:
        logger.error(f"Error in diabetes prediction: {str(e)}")
        return jsonify({'error': 'Internal server error'}), 500

@app.route('/api/predict/heart', methods=['POST'])
def predict_heart_disease():
    """
    Predict heart disease risk
    Expected features: [age, sex, chest_pain_type, resting_bp, cholesterol, fasting_bs, resting_ecg, max_hr, exercise_angina, oldpeak, st_slope]
    """
    try:
        data = request.get_json()
        
        if not data or 'features' not in data:
            return jsonify({'error': 'Missing features in request'}), 400
        
        features = data['features']
        
        # Validate feature count
        expected_features = 11  # Adjust based on your heart disease model
        if len(features) != expected_features:
            return jsonify({'error': f'Expected {expected_features} features, got {len(features)}'}), 400
        
        # Preprocess features
        processed_features = preprocess_features(features, 'heart')
        
        # Make prediction
        if models['heart'] is not None:
            # Use your trained model
            prediction = models['heart'].predict(processed_features)[0]
            probability = models['heart'].predict_proba(processed_features)[0]
            
            # Get probability of positive class (heart disease = 1)
            heart_probability = probability[1] if len(probability) > 1 else prediction
            
        else:
            # Fallback prediction logic
            logger.warning("Heart disease model not loaded, using fallback logic")
            age, cholesterol, max_hr = features[0], features[4], features[7]
            
            # Simple rule-based fallback
            risk_score = 0.1  # Base risk
            if age > 55: risk_score += 0.3
            if cholesterol > 240: risk_score += 0.4
            if max_hr < 120: risk_score += 0.2
            
            heart_probability = min(risk_score, 0.95)
        
        return jsonify({
            'probability': float(heart_probability),
            'prediction': int(heart_probability > 0.5),
            'confidence': 0.88,
            'model_version': '1.0'
        })
        
    except Exception as e:
        logger.error(f"Error in heart disease prediction: {str(e)}")
        return jsonify({'error': 'Internal server error'}), 500

@app.route('/api/predict/hypertension', methods=['POST'])
def predict_hypertension():
    """
    Predict hypertension risk
    Expected features: [age, systolic_bp, diastolic_bp, bmi, smoking, alcohol, exercise, family_history, stress]
    """
    try:
        data = request.get_json()
        
        if not data or 'features' not in data:
            return jsonify({'error': 'Missing features in request'}), 400
        
        features = data['features']
        
        # Validate feature count
        expected_features = 9  # Adjust based on your hypertension model
        if len(features) != expected_features:
            return jsonify({'error': f'Expected {expected_features} features, got {len(features)}'}), 400
        
        # Preprocess features
        processed_features = preprocess_features(features, 'hypertension')
        
        # Make prediction
        if models['hypertension'] is not None:
            # Use your trained model
            prediction = models['hypertension'].predict(processed_features)[0]
            probability = models['hypertension'].predict_proba(processed_features)[0]
            
            # Get probability of positive class (hypertension = 1)
            hypertension_probability = probability[1] if len(probability) > 1 else prediction
            
        else:
            # Fallback prediction logic
            logger.warning("Hypertension model not loaded, using fallback logic")
            age, systolic_bp, bmi, smoking = features[0], features[1], features[3], features[4]
            
            # Simple rule-based fallback
            risk_score = 0.1  # Base risk
            if systolic_bp > 140: risk_score += 0.4
            if age > 45: risk_score += 0.2
            if bmi > 30: risk_score += 0.2
            if smoking: risk_score += 0.3
            
            hypertension_probability = min(risk_score, 0.95)
        
        return jsonify({
            'probability': float(hypertension_probability),
            'prediction': int(hypertension_probability > 0.5),
            'confidence': 0.82,
            'model_version': '1.0'
        })
        
    except Exception as e:
        logger.error(f"Error in hypertension prediction: {str(e)}")
        return jsonify({'error': 'Internal server error'}), 500

@app.route('/api/models/info', methods=['GET'])
def get_models_info():
    """Get information about loaded models"""
    return jsonify({
        'models': {
            'diabetes': {
                'model_loaded': models['diabetes'] is not None,
                'scaler_loaded': scalers['diabetes'] is not None,
                'features': ['pregnancies', 'glucose', 'blood_pressure', 'skin_thickness', 'insulin', 'bmi', 'diabetes_pedigree_function', 'age']
            },
            'heart': {
                'model_loaded': models['heart'] is not None,
                'scaler_loaded': scalers['heart'] is not None,
                'features': ['age', 'sex', 'chest_pain_type', 'resting_bp', 'cholesterol', 'fasting_bs', 'resting_ecg', 'max_hr', 'exercise_angina', 'oldpeak', 'st_slope']
            },
            'hypertension': {
                'model_loaded': models['hypertension'] is not None,
                'scaler_loaded': scalers['hypertension'] is not None,
                'features': ['age', 'systolic_bp', 'diastolic_bp', 'bmi', 'smoking', 'alcohol', 'exercise', 'family_history', 'stress']
            }
        }
    })

if __name__ == '__main__':
    # Load models on startup
    load_models()
    
    # Get configuration from environment variables
    port = int(os.getenv('PORT', 5000))
    debug = os.getenv('DEBUG', 'False').lower() == 'true'
    
    app.run(host='0.0.0.0', port=port, debug=debug)
