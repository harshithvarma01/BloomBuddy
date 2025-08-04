# BloomBuddy ML Models API Server
# This is a template for connecting your trained ML models

from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np
import joblib
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
        models_dir = os.getenv('MODELS_DIR', './models')
        
        # Load diabetes model and scaler (from main models directory)
        diabetes_model_path = os.path.join(models_dir, 'diabetes_model.pkl')
        diabetes_scaler_path = os.path.join(models_dir, 'diabetes_scaler.pkl')
        if os.path.exists(diabetes_model_path):
            model_obj = joblib.load(diabetes_model_path)
            if hasattr(model_obj, 'predict'):
                models['diabetes'] = model_obj
                logger.info("Diabetes model loaded successfully")
            else:
                logger.warning(f"Diabetes model file contains {type(model_obj)}, not a trained model")
                models['diabetes'] = None
            
            if os.path.exists(diabetes_scaler_path):
                scaler_obj = joblib.load(diabetes_scaler_path)
                if hasattr(scaler_obj, 'transform'):
                    scalers['diabetes'] = scaler_obj
                    logger.info("Diabetes scaler loaded successfully")
                else:
                    logger.warning(f"Diabetes scaler file contains {type(scaler_obj)}, not a scaler object")
                    scalers['diabetes'] = None
            else:
                logger.warning("Diabetes scaler not found")
        
        # Load heart disease model and scaler (from main models directory)
        heart_model_path = os.path.join(models_dir, 'heart_disease_model.pkl')
        heart_scaler_path = os.path.join(models_dir, 'heart_scaler.pkl')
        if os.path.exists(heart_model_path):
            model_obj = joblib.load(heart_model_path)
            if hasattr(model_obj, 'predict'):
                models['heart'] = model_obj
                logger.info("Heart disease model loaded successfully")
            else:
                logger.warning(f"Heart model file contains {type(model_obj)}, not a trained model")
                models['heart'] = None
            
            if os.path.exists(heart_scaler_path):
                scaler_obj = joblib.load(heart_scaler_path)
                if hasattr(scaler_obj, 'transform'):
                    scalers['heart'] = scaler_obj
                    logger.info("Heart disease scaler loaded successfully")
                else:
                    logger.warning(f"Heart scaler file contains {type(scaler_obj)} (feature names), not a scaler object")
                    scalers['heart'] = None
            else:
                logger.warning("Heart disease scaler not found")
        
        # Load hypertension model and scaler (from main models directory)
        hypertension_model_path = os.path.join(models_dir, 'hypertension_model.pkl')
        hypertension_scaler_path = os.path.join(models_dir, 'hyper_scaler.pkl')
        if os.path.exists(hypertension_model_path):
            model_obj = joblib.load(hypertension_model_path)
            if hasattr(model_obj, 'predict'):
                models['hypertension'] = model_obj
                logger.info("Hypertension model loaded successfully")
            else:
                logger.warning(f"Hypertension model file contains {type(model_obj)}, not a trained model")
                models['hypertension'] = None
            
            if os.path.exists(hypertension_scaler_path):
                scaler_obj = joblib.load(hypertension_scaler_path)
                if hasattr(scaler_obj, 'transform'):
                    scalers['hypertension'] = scaler_obj
                    logger.info("Hypertension scaler loaded successfully")
                else:
                    logger.warning(f"Hypertension scaler file contains {type(scaler_obj)}, not a scaler object")
                    scalers['hypertension'] = None
            else:
                logger.warning("Hypertension scaler not found")
            
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

@app.route('/health', methods=['GET'])
def health_check():
    """Simple health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'timestamp': '2024-01-20T10:00:00Z',
        'models_loaded': {
            'diabetes': models['diabetes'] is not None,
            'heart': models['heart'] is not None,
            'hypertension': models['hypertension'] is not None
        }
    })

@app.route('/debug/models', methods=['GET'])
def debug_models():
    """Debug endpoint to check model loading status"""
    import os
    models_dir = os.getenv('MODELS_DIR', './models')
    
    debug_info = {
        'models_dir': models_dir,
        'models_loaded': {
            'diabetes': models['diabetes'] is not None,
            'heart': models['heart'] is not None,
            'hypertension': models['hypertension'] is not None,
        },
        'scalers_loaded': {
            'diabetes': scalers['diabetes'] is not None,
            'heart': scalers['heart'] is not None,
            'hypertension': scalers['hypertension'] is not None,
        },
        'scaler_types': {
            'diabetes': str(type(scalers['diabetes'])) if scalers['diabetes'] is not None else 'None',
            'heart': str(type(scalers['heart'])) if scalers['heart'] is not None else 'None',
            'hypertension': str(type(scalers['hypertension'])) if scalers['hypertension'] is not None else 'None',
        },
        'file_paths': {
            'diabetes_model': os.path.exists(os.path.join(models_dir, 'Diabetes Model', 'diabetes_model.pkl')),
            'diabetes_scaler': os.path.exists(os.path.join(models_dir, 'Diabetes Model', 'diabetes_scaler.pkl')),
            'heart_model': os.path.exists(os.path.join(models_dir, 'Heart Model', 'heart_model.pkl')),
            'heart_scaler': os.path.exists(os.path.join(models_dir, 'Heart Model', 'heart_scaler.pkl')),
            'hypertension_model': os.path.exists(os.path.join(models_dir, 'Hypertenstion Model', 'hypertension_model.pkl')),
            'hypertension_scaler': os.path.exists(os.path.join(models_dir, 'Hypertenstion Model', 'scaler.pkl')),
        }
    }
    
    return jsonify(debug_info)

@app.route('/api/predict/diabetes', methods=['POST'])
def predict_diabetes():
    """
    Predict diabetes risk
    Based on your Diabetes Model - Expected 8 features
    """
    try:
        data = request.get_json()
        
        if not data or 'features' not in data:
            return jsonify({'error': 'Missing features in request'}), 400
        
        features = data['features']
        
        # Your diabetes model expects 8 features
        expected_features = 8
        if len(features) != expected_features:
            return jsonify({'error': f'Expected {expected_features} features, got {len(features)}'}), 400
        
        # Preprocess features using trained scaler
        try:
            if scalers['diabetes'] is None:
                logger.warning("Diabetes scaler not available, using raw features")
                features_array = np.array(features).reshape(1, -1)
                processed_features = features_array
            else:
                features_array = np.array(features).reshape(1, -1)
                processed_features = scalers['diabetes'].transform(features_array)
        except Exception as scaler_error:
            logger.error(f"Diabetes scaler preprocessing failed: {str(scaler_error)}")
            # Use raw features as fallback
            features_array = np.array(features).reshape(1, -1)
            processed_features = features_array
        
        # Make prediction using trained model
        if models['diabetes'] is None:
            return jsonify({'error': 'Diabetes model not available'}), 500
        
        try:
            prediction = models['diabetes'].predict(processed_features)[0]
            probability = models['diabetes'].predict_proba(processed_features)[0]
            diabetes_probability = probability[1] if len(probability) > 1 else prediction
        except Exception as model_error:
            logger.error(f"Diabetes model prediction failed: {str(model_error)}")
            # Fallback logic based on medical risk factors
            glucose, bmi, age = features[1], features[5], features[7]
            risk_score = 0.1
            if glucose > 140: risk_score += 0.4  # High glucose
            if bmi > 30: risk_score += 0.3       # Obesity
            if age > 45: risk_score += 0.2       # Age factor
            if features[0] > 5: risk_score += 0.15  # Multiple pregnancies
            diabetes_probability = min(risk_score, 0.95)
            logger.info(f"Using fallback prediction for diabetes: {diabetes_probability}")
        
        return jsonify({
            'probability': float(diabetes_probability),
            'prediction': int(diabetes_probability > 0.5),
            'confidence': 0.85,
            'model_version': '1.0'
        })
        
    except Exception as e:
        logger.error(f"Error in diabetes prediction: {str(e)}")
        return jsonify({'error': 'Internal server error'}), 500

@app.route('/api/predict/heart', methods=['POST'])
def predict_heart_disease():
    """
    Predict heart disease risk
    Based on your Heart Model - Expected 13 features
    """
    try:
        data = request.get_json()
        
        if not data or 'features' not in data:
            return jsonify({'error': 'Missing features in request'}), 400
        
        features = data['features']
        
        # Your heart model expects 13 features
        expected_features = 13
        if len(features) != expected_features:
            return jsonify({'error': f'Expected {expected_features} features, got {len(features)}'}), 400
        
        # Preprocess features with scaler (heart model uses raw features if no scaler)
        features_array = np.array(features).reshape(1, -1)
        logger.info(f"Heart prediction - Features array shape: {features_array.shape}")
        logger.info(f"Heart scaler available: {scalers['heart'] is not None}")
        
        if scalers['heart'] is not None:
            try:
                logger.info(f"Heart scaler type: {type(scalers['heart'])}")
                processed_features = scalers['heart'].transform(features_array)
                logger.info(f"Features successfully scaled. Shape: {processed_features.shape}")
            except Exception as scaler_error:
                logger.error(f"Error applying heart scaler: {str(scaler_error)}")
                return jsonify({'error': 'Heart scaler preprocessing failed'}), 500
        else:
            # Heart model was trained without scaling
            processed_features = features_array
            logger.info("Using raw features for heart disease prediction")
        
        # Make prediction using trained model
        if models['heart'] is None:
            return jsonify({'error': 'Heart disease model not available'}), 500
        
        try:
            prediction = models['heart'].predict(processed_features)[0]
            probability = models['heart'].predict_proba(processed_features)[0]
            heart_probability = probability[1] if len(probability) > 1 else prediction
        except Exception as model_error:
            logger.error(f"Heart disease model prediction failed: {str(model_error)}")
            # Fallback logic based on medical risk factors
            age, sex, chest_pain, cholesterol, max_hr = features[0], features[1], features[2], features[4], features[7]
            risk_score = 0.1
            if age > 55: risk_score += 0.3       # Age factor
            if sex == 1: risk_score += 0.2       # Male gender
            if chest_pain >= 2: risk_score += 0.25  # Chest pain types
            if cholesterol > 240: risk_score += 0.3  # High cholesterol
            if max_hr < 120: risk_score += 0.2   # Low max heart rate
            if features[8] == 1: risk_score += 0.15  # Exercise induced angina
            heart_probability = min(risk_score, 0.95)
            logger.info(f"Using fallback prediction for heart disease: {heart_probability}")
        
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
    Based on your Hypertension Model - Expected 12 features
    """
    try:
        data = request.get_json()
        
        if not data or 'features' not in data:
            return jsonify({'error': 'Missing features in request'}), 400
        
        features = data['features']
        
        # Your hypertension model expects 12 features
        expected_features = 12
        if len(features) != expected_features:
            return jsonify({'error': f'Expected {expected_features} features, got {len(features)}'}), 400
        
        # Preprocess features using trained scaler
        try:
            if scalers['hypertension'] is None:
                logger.warning("Hypertension scaler not available, using raw features")
                features_array = np.array(features).reshape(1, -1)
                processed_features = features_array
            else:
                features_array = np.array(features).reshape(1, -1)
                processed_features = scalers['hypertension'].transform(features_array)
        except Exception as scaler_error:
            logger.error(f"Hypertension scaler preprocessing failed: {str(scaler_error)}")
            # Use raw features as fallback
            features_array = np.array(features).reshape(1, -1)
            processed_features = features_array
        
        # Make prediction using trained model
        if models['hypertension'] is None:
            return jsonify({'error': 'Hypertension model not available'}), 500
        
        try:
            prediction = models['hypertension'].predict(processed_features)[0]
            probability = models['hypertension'].predict_proba(processed_features)[0]
            hypertension_probability = probability[1] if len(probability) > 1 else prediction
        except Exception as model_error:
            logger.error(f"Hypertension model prediction failed: {str(model_error)}")
            # Fallback logic based on medical risk factors
            male, age, smoking, bmi, sys_bp, dia_bp = features[0], features[1], features[2], features[9], features[7], features[8]
            risk_score = 0.1
            if sys_bp > 140: risk_score += 0.4   # High systolic BP
            if dia_bp > 90: risk_score += 0.3    # High diastolic BP
            if age > 45: risk_score += 0.2       # Age factor
            if bmi > 30: risk_score += 0.2       # Obesity
            if smoking == 1: risk_score += 0.25  # Current smoker
            if male == 1: risk_score += 0.1      # Male gender
            if features[5] == 1: risk_score += 0.15  # Diabetes
            hypertension_probability = min(risk_score, 0.95)
            logger.info(f"Using fallback prediction for hypertension: {hypertension_probability}")
        
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
