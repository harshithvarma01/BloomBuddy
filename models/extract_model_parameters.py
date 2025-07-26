
import joblib
import pandas as pd
import numpy as np
from datetime import datetime
import json
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, roc_auc_score, classification_report
from sklearn.model_selection import train_test_split
import warnings
warnings.filterwarnings('ignore')

def evaluate_model_performance(all_parameters):
    """
    Evaluate model performance metrics by loading datasets and making predictions
    """
    print("\n" + "="*80)
    print("MODEL PERFORMANCE EVALUATION")
    print("="*80)
    
    performance_data = {
        "performance_metrics": {}
    }
    
    # Dataset mappings
    dataset_mappings = {
        "diabetes": {
            "file": "diabetes.csv",
            "target_column": "Outcome"
        },
        "heart": {
            "file": "heart.csv", 
            "target_column": "target"
        },
        "hypertension": {
            "file": "hypertension.csv",
            "target_column": "Risk"
        }
    }
    
    # Model paths
    model_paths = {
        "diabetes": {
            "model": "Diabetes Model/diabetes_model.pkl",
            "scaler": "Diabetes Model/diabetes_scaler.pkl"
        },
        "heart": {
            "model": "Heart Model/heart_model.pkl", 
            "scaler": "Heart Model/heart_scaler.pkl"
        },
        "hypertension": {
            "model": "Hypertenstion Model/hypertension_model.pkl",
            "scaler": "Hypertenstion Model/scaler.pkl"
        }
    }
    
    performance_table = []
    
    for model_name in ["diabetes", "heart", "hypertension"]:
        if model_name not in all_parameters["models"] or "error" in all_parameters["models"][model_name]:
            continue
            
        try:
            print(f"\nEvaluating {model_name.upper()} model...")
            
            # Load dataset
            dataset_info = dataset_mappings[model_name]
            print(f"  Loading dataset: {dataset_info['file']}")
            df = pd.read_csv(dataset_info["file"])
            print(f"  Dataset shape: {df.shape}")
            print(f"  Target column: {dataset_info['target_column']}")
            
            # Check if target column exists
            if dataset_info["target_column"] not in df.columns:
                print(f"  Error: Target column '{dataset_info['target_column']}' not found in dataset")
                print(f"  Available columns: {list(df.columns)}")
                continue
            
            # Prepare features and target
            X = df.drop(dataset_info["target_column"], axis=1)
            y = df[dataset_info["target_column"]]
            print(f"  Features shape: {X.shape}")
            print(f"  Target shape: {y.shape}")
            print(f"  Target values: {sorted(y.unique())}")
            
            # Check for NaN values and clean the data
            print(f"  Checking for NaN values...")
            nan_count_features = X.isnull().sum().sum()
            nan_count_target = y.isnull().sum()
            print(f"  NaN values in features: {nan_count_features}")
            print(f"  NaN values in target: {nan_count_target}")
            
            if nan_count_features > 0 or nan_count_target > 0:
                print(f"  Cleaning NaN values...")
                # Remove rows with NaN in target
                mask = ~y.isnull()
                X = X[mask]
                y = y[mask]
                
                # Remove rows with NaN in features
                mask = ~X.isnull().any(axis=1)
                X = X[mask]
                y = y[mask]
                
                print(f"  After cleaning - Features shape: {X.shape}")
                print(f"  After cleaning - Target shape: {y.shape}")
                print(f"  After cleaning - Target values: {sorted(y.unique())}")
            
            # Ensure we have enough data
            if len(y) < 10:
                print(f"  Error: Not enough data points ({len(y)}) after cleaning")
                continue
            
            # Load model and scaler
            print(f"  Loading model: {model_paths[model_name]['model']}")
            model = joblib.load(model_paths[model_name]["model"])
            print(f"  Loading scaler: {model_paths[model_name]['scaler']}")
            scaler = joblib.load(model_paths[model_name]["scaler"])
            
            # Scale features
            print(f"  Scaling features...")
            X_scaled = scaler.transform(X)
            
            # Split data (using same random state as training for consistency)
            print(f"  Splitting data...")
            X_train, X_test, y_train, y_test = train_test_split(
                X_scaled, y, test_size=0.2, random_state=42, stratify=y
            )
            print(f"  Test set size: {len(y_test)}")
            
            # Make predictions
            print(f"  Making predictions...")
            y_pred = model.predict(X_test)
            y_pred_proba = model.predict_proba(X_test)[:, 1] if hasattr(model, 'predict_proba') else None
            
            # Calculate metrics
            print(f"  Calculating metrics...")
            accuracy = accuracy_score(y_test, y_pred)
            precision = precision_score(y_test, y_pred, average='binary')
            recall = recall_score(y_test, y_pred, average='binary')
            f1 = f1_score(y_test, y_pred, average='binary')
            
            # AUC-ROC if probabilities available
            auc_roc = None
            if y_pred_proba is not None:
                try:
                    auc_roc = roc_auc_score(y_test, y_pred_proba)
                except Exception as auc_error:
                    print(f"  Warning: Could not calculate AUC-ROC: {auc_error}")
                    auc_roc = None
            
            # Store metrics
            metrics = {
                "accuracy": accuracy,
                "precision": precision,
                "recall": recall,
                "f1_score": f1,
                "auc_roc": auc_roc,
                "test_size": len(y_test),
                "positive_class_ratio": y_test.mean()
            }
            
            performance_data["performance_metrics"][model_name] = metrics
            
            # Add to comparison table
            performance_row = {
                "Model": model_name.title(),
                "Algorithm": all_parameters["models"][model_name]["model_type"],
                "Accuracy": f"{accuracy:.4f}",
                "Precision": f"{precision:.4f}",
                "Recall": f"{recall:.4f}",
                "F1-Score": f"{f1:.4f}",
                "AUC-ROC": f"{auc_roc:.4f}" if auc_roc is not None else "N/A",
                "Test_Size": len(y_test)
            }
            
            performance_table.append(performance_row)
            
            print(f"  Accuracy: {accuracy:.4f}")
            print(f"  Precision: {precision:.4f}")
            print(f"  Recall: {recall:.4f}")
            print(f"  F1-Score: {f1:.4f}")
            if auc_roc is not None:
                print(f"  AUC-ROC: {auc_roc:.4f}")
            print(f"  ✓ Evaluation completed successfully")
            
        except Exception as e:
            print(f"Error evaluating {model_name} model: {str(e)}")
            import traceback
            print(f"Traceback: {traceback.format_exc()}")
            performance_data["performance_metrics"][model_name] = {"error": str(e)}
    
    # Create performance comparison DataFrame
    performance_df = pd.DataFrame(performance_table)
    
    if not performance_df.empty:
        print(f"\n\nPERFORMANCE COMPARISON TABLE:")
        print("-" * 80)
        print(performance_df.to_string(index=False))
        
        # Performance insights
        print(f"\n\nPERFORMANCE INSIGHTS:")
        print("-" * 80)
        
        if len(performance_table) > 1:
            # Find best performing models
            accuracies = [float(row["Accuracy"]) for row in performance_table]
            precisions = [float(row["Precision"]) for row in performance_table]
            recalls = [float(row["Recall"]) for row in performance_table]
            f1_scores = [float(row["F1-Score"]) for row in performance_table]
            
            best_accuracy_idx = np.argmax(accuracies)
            best_precision_idx = np.argmax(precisions)
            best_recall_idx = np.argmax(recalls)
            best_f1_idx = np.argmax(f1_scores)
            
            print(f"Best Accuracy: {performance_table[best_accuracy_idx]['Model']} ({accuracies[best_accuracy_idx]:.4f})")
            print(f"Best Precision: {performance_table[best_precision_idx]['Model']} ({precisions[best_precision_idx]:.4f})")
            print(f"Best Recall: {performance_table[best_recall_idx]['Model']} ({recalls[best_recall_idx]:.4f})")
            print(f"Best F1-Score: {performance_table[best_f1_idx]['Model']} ({f1_scores[best_f1_idx]:.4f})")
            
            print(f"\nAverage Performance:")
            print(f"  Mean Accuracy: {np.mean(accuracies):.4f}")
            print(f"  Mean Precision: {np.mean(precisions):.4f}")
            print(f"  Mean Recall: {np.mean(recalls):.4f}")
            print(f"  Mean F1-Score: {np.mean(f1_scores):.4f}")
    
    performance_data["performance_comparison_table"] = performance_table
    return performance_data

def compare_models(all_parameters):
    """
    Create a comprehensive comparison of all models
    """
    print("\n" + "="*80)
    print("MODEL COMPARISON ANALYSIS")
    print("="*80)
    
    comparison_data = {
        "model_comparison": {
            "summary": {},
            "detailed_comparison": {},
            "recommendations": {}
        }
    }
    
    # Create comparison table
    comparison_table = []
    
    for model_name, model_info in all_parameters["models"].items():
        if "error" in model_info:
            continue
            
        model_row = {
            "Model": model_name.title(),
            "Algorithm": model_info["model_type"],
            "Scaler": model_info["scaler_type"],
            "Features": model_info["model_attributes"].get("n_features_in", "N/A"),
            "Classes": len(model_info["model_attributes"].get("classes", [])) if model_info["model_attributes"].get("classes") else "N/A"
        }
        
        # Add algorithm-specific parameters
        if model_info["model_type"] == "LogisticRegression":
            model_row["C"] = model_info["model_parameters"].get("C", "N/A")
            model_row["Solver"] = model_info["model_parameters"].get("solver", "N/A")
            model_row["Max_Iter"] = model_info["model_parameters"].get("max_iter", "N/A")
        elif model_info["model_type"] == "XGBClassifier":
            n_est = model_info["model_parameters"].get("n_estimators")
            model_row["N_Estimators"] = n_est if n_est is not None else "N/A"
            
            lr = model_info["model_parameters"].get("learning_rate")
            model_row["Learning_Rate"] = lr if lr is not None else "N/A"
            
            max_d = model_info["model_parameters"].get("max_depth")
            model_row["Max_Depth"] = max_d if max_d is not None else "N/A"
        
        comparison_table.append(model_row)
    
    # Convert to DataFrame for better display
    comparison_df = pd.DataFrame(comparison_table)
    
    print("\nMODEL OVERVIEW COMPARISON:")
    print("-" * 80)
    print(comparison_df.to_string(index=False))
    
    # Detailed analysis
    print("\n\nDETAILED MODEL ANALYSIS:")
    print("-" * 80)
    
    for model_name, model_info in all_parameters["models"].items():
        if "error" in model_info:
            continue
            
        print(f"\n{model_name.upper()} MODEL:")
        print(f"  Algorithm: {model_info['model_type']}")
        print(f"  Purpose: {get_model_purpose(model_name)}")
        print(f"  Complexity: {assess_model_complexity(model_info)}")
        print(f"  Interpretability: {assess_interpretability(model_info['model_type'])}")
        
        # Feature analysis
        if "coefficients" in model_info["model_attributes"]:
            coef = np.array(model_info["model_attributes"]["coefficients"]).flatten()
            print(f"  Feature Importance Range: {coef.min():.4f} to {coef.max():.4f}")
            print(f"  Most Important Features: Top {min(3, len(coef))} coefficient magnitudes")
        
        if "feature_importances" in model_info["model_attributes"]:
            importance = np.array(model_info["model_attributes"]["feature_importances"])
            print(f"  Feature Importance Range: {importance.min():.4f} to {importance.max():.4f}")
            print(f"  Feature Importance Sum: {importance.sum():.4f}")
    
    # Model comparison insights
    print(f"\n\nMODEL COMPARISON INSIGHTS:")
    print("-" * 80)
    
    # Compare model types
    model_types = [info["model_type"] for info in all_parameters["models"].values() if "error" not in info]
    unique_types = set(model_types)
    
    print(f"Algorithms Used: {', '.join(unique_types)}")
    
    # Algorithm comparison
    if "LogisticRegression" in unique_types:
        print("\nLogistic Regression Models:")
        print("  + Pros: Highly interpretable, fast training, probabilistic output")
        print("  - Cons: Assumes linear relationship, sensitive to outliers")
        print("  Best for: When interpretability is crucial, linear relationships")
    
    if "XGBClassifier" in unique_types:
        print("\nXGBoost Models:")
        print("  + Pros: High accuracy, handles non-linear relationships, feature importance")
        print("  - Cons: Less interpretable, can overfit, requires tuning")
        print("  Best for: When accuracy is priority, complex patterns")
    
    # Feature count comparison
    feature_counts = []
    for info in all_parameters["models"].values():
        if "error" not in info and "n_features_in" in info["model_attributes"]:
            feature_counts.append(info["model_attributes"]["n_features_in"])
    
    if feature_counts:
        print(f"\nFeature Count Analysis:")
        print(f"  Range: {min(feature_counts)} to {max(feature_counts)} features")
        print(f"  Average: {np.mean(feature_counts):.1f} features")
    
    comparison_data["model_comparison"]["summary"] = {
        "total_models": len([info for info in all_parameters["models"].values() if "error" not in info]),
        "algorithms_used": list(unique_types),
        "feature_count_range": [min(feature_counts), max(feature_counts)] if feature_counts else None,
        "comparison_table": comparison_df.to_dict('records') if not comparison_df.empty else []
    }
    
    return comparison_data

def get_model_purpose(model_name):
    """Get the purpose/domain of each model"""
    purposes = {
        "diabetes": "Diabetes risk prediction and management",
        "heart": "Cardiovascular disease risk assessment", 
        "hypertension": "Blood pressure and hypertension risk evaluation"
    }
    return purposes.get(model_name, "Health risk prediction")

def assess_model_complexity(model_info):
    """Assess the complexity of the model"""
    model_type = model_info["model_type"]
    
    if model_type == "LogisticRegression":
        return "Low - Linear model with few parameters"
    elif model_type == "XGBClassifier":
        n_estimators = model_info["model_parameters"].get("n_estimators", 100)
        # Handle None case
        if n_estimators is None:
            n_estimators = 100
        
        if n_estimators > 200:
            return "High - Many trees in ensemble"
        elif n_estimators > 100:
            return "Medium-High - Moderate ensemble size"
        else:
            return "Medium - Standard ensemble size"
    else:
        return "Unknown"

def assess_interpretability(model_type):
    """Assess how interpretable the model is"""
    interpretability = {
        "LogisticRegression": "High - Clear coefficient interpretation",
        "XGBClassifier": "Medium - Feature importance available",
        "RandomForestClassifier": "Medium - Feature importance available",
        "SVC": "Low - Complex decision boundary",
        "MLPClassifier": "Very Low - Black box neural network"
    }
    return interpretability.get(model_type, "Unknown")

def extract_model_parameters():
    """
    Extract parameters from all saved models and scalers in the workspace
    """
    
    print("=" * 80)
    print("MODEL PARAMETERS EXTRACTION REPORT")
    print("=" * 80)
    print(f"Generated on: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print("=" * 80)
    
    # Initialize results dictionary
    all_parameters = {
        "extraction_timestamp": datetime.now().isoformat(),
        "models": {}
    }
    
    # Model paths
    model_paths = {
        "diabetes": {
            "model": "Diabetes Model/diabetes_model.pkl",
            "scaler": "Diabetes Model/diabetes_scaler.pkl"
        },
        "heart": {
            "model": "Heart Model/heart_model.pkl", 
            "scaler": "Heart Model/heart_scaler.pkl"
        },
        "hypertension": {
            "model": "Hypertenstion Model/hypertension_model.pkl",
            "scaler": "Hypertenstion Model/scaler.pkl"
        }
    }
    
    # Extract parameters for each model
    for model_name, paths in model_paths.items():
        print(f"\n{'='*20} {model_name.upper()} MODEL {'='*20}")
        
        try:
            # Load model
            model = joblib.load(paths["model"])
            scaler = joblib.load(paths["scaler"])
            
            # Initialize model info
            model_info = {
                "model_type": type(model).__name__,
                "scaler_type": type(scaler).__name__,
                "model_parameters": {},
                "scaler_parameters": {},
                "model_attributes": {},
                "scaler_attributes": {}
            }
            
            print(f"Model Type: {type(model).__name__}")
            print(f"Scaler Type: {type(scaler).__name__}")
            
            # Extract model parameters
            print(f"\n--- {model_name.upper()} MODEL PARAMETERS ---")
            if hasattr(model, 'get_params'):
                model_params = model.get_params()
                model_info["model_parameters"] = model_params
                for param, value in model_params.items():
                    print(f"{param}: {value}")
            
            # Extract model attributes (trained parameters)
            print(f"\n--- {model_name.upper()} MODEL ATTRIBUTES ---")
            
            # Common attributes for different model types
            if hasattr(model, 'coef_'):
                coef = model.coef_
                if isinstance(coef, np.ndarray):
                    coef = coef.tolist()
                model_info["model_attributes"]["coefficients"] = coef
                print(f"Coefficients shape: {np.array(model.coef_).shape}")
                print(f"Coefficients: {coef}")
            
            if hasattr(model, 'intercept_'):
                intercept = model.intercept_
                if isinstance(intercept, np.ndarray):
                    intercept = intercept.tolist()
                model_info["model_attributes"]["intercept"] = intercept
                print(f"Intercept: {intercept}")
            
            if hasattr(model, 'n_features_in_'):
                model_info["model_attributes"]["n_features_in"] = int(model.n_features_in_)
                print(f"Number of features: {model.n_features_in_}")
            
            if hasattr(model, 'classes_'):
                classes = model.classes_
                if isinstance(classes, np.ndarray):
                    classes = classes.tolist()
                model_info["model_attributes"]["classes"] = classes
                print(f"Classes: {classes}")
            
            # For XGBoost models
            if hasattr(model, 'feature_importances_'):
                importance = model.feature_importances_
                if isinstance(importance, np.ndarray):
                    importance = importance.tolist()
                model_info["model_attributes"]["feature_importances"] = importance
                print(f"Feature importances: {importance}")
            
            if hasattr(model, 'n_estimators'):
                model_info["model_attributes"]["n_estimators"] = model.n_estimators
                print(f"Number of estimators: {model.n_estimators}")
            
            # Extract scaler parameters
            print(f"\n--- {model_name.upper()} SCALER PARAMETERS ---")
            if hasattr(scaler, 'get_params'):
                scaler_params = scaler.get_params()
                model_info["scaler_parameters"] = scaler_params
                for param, value in scaler_params.items():
                    print(f"{param}: {value}")
            
            # Extract scaler attributes
            print(f"\n--- {model_name.upper()} SCALER ATTRIBUTES ---")
            
            if hasattr(scaler, 'mean_'):
                mean = scaler.mean_
                if isinstance(mean, np.ndarray):
                    mean = mean.tolist()
                model_info["scaler_attributes"]["mean"] = mean
                print(f"Feature means: {mean}")
            
            if hasattr(scaler, 'scale_'):
                scale = scaler.scale_
                if isinstance(scale, np.ndarray):
                    scale = scale.tolist()
                model_info["scaler_attributes"]["scale"] = scale
                print(f"Feature scales: {scale}")
            
            if hasattr(scaler, 'var_'):
                var = scaler.var_
                if isinstance(var, np.ndarray):
                    var = var.tolist()
                model_info["scaler_attributes"]["variance"] = var
                print(f"Feature variances: {var}")
            
            if hasattr(scaler, 'n_features_in_'):
                model_info["scaler_attributes"]["n_features_in"] = int(scaler.n_features_in_)
                print(f"Scaler features: {scaler.n_features_in_}")
            
            # Store in main dictionary
            all_parameters["models"][model_name] = model_info
            
        except Exception as e:
            print(f"Error loading {model_name} model: {str(e)}")
            all_parameters["models"][model_name] = {"error": str(e)}
    
    # Perform model comparison
    comparison_data = compare_models(all_parameters)
    
    # Perform performance evaluation
    performance_data = evaluate_model_performance(all_parameters)
    
    # Merge comparison and performance data with parameters
    all_parameters.update(comparison_data)
    all_parameters.update(performance_data)
    
    # Save to JSON file
    with open('all_model_parameters_and_comparison.json', 'w') as f:
        json.dump(all_parameters, f, indent=2)
    
    # Save to comprehensive text file
    with open('all_model_parameters_and_comparison.txt', 'w') as f:
        f.write("COMPREHENSIVE MODEL ANALYSIS REPORT\n")
        f.write("="*80 + "\n")
        f.write(f"Generated on: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n")
        f.write("="*80 + "\n\n")
        
        # Write model comparison first
        f.write("MODEL COMPARISON SUMMARY\n")
        f.write("-"*40 + "\n")
        
        if comparison_data["model_comparison"]["summary"]["comparison_table"]:
            comparison_df = pd.DataFrame(comparison_data["model_comparison"]["summary"]["comparison_table"])
            f.write(comparison_df.to_string(index=False))
            f.write("\n\n")
        
        f.write(f"Total Models: {comparison_data['model_comparison']['summary']['total_models']}\n")
        f.write(f"Algorithms Used: {', '.join(comparison_data['model_comparison']['summary']['algorithms_used'])}\n")
        
        if comparison_data['model_comparison']['summary']['feature_count_range']:
            f.write(f"Feature Count Range: {comparison_data['model_comparison']['summary']['feature_count_range'][0]} to {comparison_data['model_comparison']['summary']['feature_count_range'][1]}\n")
        
        # Write performance comparison
        f.write("\n" + "="*80 + "\n")
        f.write("MODEL PERFORMANCE COMPARISON\n")
        f.write("="*80 + "\n")
        
        if performance_data["performance_comparison_table"]:
            performance_df = pd.DataFrame(performance_data["performance_comparison_table"])
            f.write(performance_df.to_string(index=False))
            f.write("\n\n")
            
            # Performance insights
            if len(performance_data["performance_comparison_table"]) > 1:
                accuracies = [float(row["Accuracy"]) for row in performance_data["performance_comparison_table"]]
                precisions = [float(row["Precision"]) for row in performance_data["performance_comparison_table"]]
                recalls = [float(row["Recall"]) for row in performance_data["performance_comparison_table"]]
                f1_scores = [float(row["F1-Score"]) for row in performance_data["performance_comparison_table"]]
                
                best_accuracy_idx = np.argmax(accuracies)
                best_precision_idx = np.argmax(precisions)
                best_recall_idx = np.argmax(recalls)
                best_f1_idx = np.argmax(f1_scores)
                
                f.write("PERFORMANCE INSIGHTS:\n")
                f.write(f"Best Accuracy: {performance_data['performance_comparison_table'][best_accuracy_idx]['Model']} ({accuracies[best_accuracy_idx]:.4f})\n")
                f.write(f"Best Precision: {performance_data['performance_comparison_table'][best_precision_idx]['Model']} ({precisions[best_precision_idx]:.4f})\n")
                f.write(f"Best Recall: {performance_data['performance_comparison_table'][best_recall_idx]['Model']} ({recalls[best_recall_idx]:.4f})\n")
                f.write(f"Best F1-Score: {performance_data['performance_comparison_table'][best_f1_idx]['Model']} ({f1_scores[best_f1_idx]:.4f})\n")
                
                f.write(f"\nAverage Performance:\n")
                f.write(f"Mean Accuracy: {np.mean(accuracies):.4f}\n")
                f.write(f"Mean Precision: {np.mean(precisions):.4f}\n")
                f.write(f"Mean Recall: {np.mean(recalls):.4f}\n")
                f.write(f"Mean F1-Score: {np.mean(f1_scores):.4f}\n")
        else:
            f.write("No performance metrics available.\n")
        
        f.write("\n" + "="*80 + "\n")
        f.write("DETAILED MODEL PARAMETERS\n")
        f.write("="*80 + "\n")
        
        for model_name, model_info in all_parameters["models"].items():
            if "error" in model_info:
                f.write(f"\n{model_name.upper()} MODEL - ERROR: {model_info['error']}\n")
                continue
                
            f.write(f"\n{'='*20} {model_name.upper()} MODEL {'='*20}\n")
            f.write(f"Model Type: {model_info['model_type']}\n")
            f.write(f"Scaler Type: {model_info['scaler_type']}\n")
            f.write(f"Purpose: {get_model_purpose(model_name)}\n")
            f.write(f"Complexity: {assess_model_complexity(model_info)}\n")
            f.write(f"Interpretability: {assess_interpretability(model_info['model_type'])}\n")
            
            f.write(f"\n--- MODEL PARAMETERS ---\n")
            for param, value in model_info['model_parameters'].items():
                f.write(f"{param}: {value}\n")
            
            f.write(f"\n--- MODEL ATTRIBUTES ---\n")
            for attr, value in model_info['model_attributes'].items():
                if attr == "coefficients" and isinstance(value, list) and value:
                    try:
                        coef_values = [float(x) for x in value if x is not None]
                        if coef_values:
                            f.write(f"{attr}: {len(value)} coefficients (range: {min(coef_values):.4f} to {max(coef_values):.4f})\n")
                        else:
                            f.write(f"{attr}: {len(value)} coefficients\n")
                    except (ValueError, TypeError):
                        f.write(f"{attr}: {value}\n")
                elif attr == "feature_importances" and isinstance(value, list) and value:
                    try:
                        imp_values = [float(x) for x in value if x is not None]
                        if imp_values:
                            f.write(f"{attr}: {len(value)} importances (sum: {sum(imp_values):.4f})\n")
                        else:
                            f.write(f"{attr}: {len(value)} importances\n")
                    except (ValueError, TypeError):
                        f.write(f"{attr}: {value}\n")
                else:
                    f.write(f"{attr}: {value}\n")
            
            f.write(f"\n--- SCALER PARAMETERS ---\n")
            for param, value in model_info['scaler_parameters'].items():
                f.write(f"{param}: {value}\n")
            
            f.write(f"\n--- SCALER ATTRIBUTES ---\n")
            for attr, value in model_info['scaler_attributes'].items():
                if isinstance(value, list) and len(value) > 5:
                    try:
                        numeric_values = [float(x) for x in value if x is not None]
                        if numeric_values:
                            f.write(f"{attr}: {len(value)} values (mean: {np.mean(numeric_values):.4f}, std: {np.std(numeric_values):.4f})\n")
                        else:
                            f.write(f"{attr}: {len(value)} values\n")
                    except (ValueError, TypeError):
                        f.write(f"{attr}: {value}\n")
                else:
                    f.write(f"{attr}: {value}\n")
            
            f.write("\n" + "-"*60 + "\n")
        
        # Add recommendations section
        f.write("\n" + "="*80 + "\n")
        f.write("MODEL RECOMMENDATIONS\n")
        f.write("="*80 + "\n")
        
        f.write("\nModel Selection Guidelines:\n")
        f.write("- For maximum interpretability: Use Logistic Regression models\n")
        f.write("- For highest accuracy: Use XGBoost models\n")
        f.write("- For fast inference: Logistic Regression models\n")
        f.write("- For handling complex patterns: XGBoost models\n")
        
        # Performance-based recommendations
        if performance_data["performance_comparison_table"]:
            f.write("\nPerformance-Based Recommendations:\n")
            accuracies = [float(row["Accuracy"]) for row in performance_data["performance_comparison_table"]]
            if accuracies:
                best_model_idx = np.argmax(accuracies)
                best_model = performance_data["performance_comparison_table"][best_model_idx]
                f.write(f"- Overall best performer: {best_model['Model']} (Accuracy: {best_model['Accuracy']})\n")
                
                # Check for balanced performance
                precisions = [float(row["Precision"]) for row in performance_data["performance_comparison_table"]]
                recalls = [float(row["Recall"]) for row in performance_data["performance_comparison_table"]]
                f1_scores = [float(row["F1-Score"]) for row in performance_data["performance_comparison_table"]]
                
                for i, row in enumerate(performance_data["performance_comparison_table"]):
                    if abs(precisions[i] - recalls[i]) < 0.05:  # Balanced precision and recall
                        f.write(f"- Most balanced model: {row['Model']} (Precision: {row['Precision']}, Recall: {row['Recall']})\n")
                        break
        
        f.write("\nDeployment Considerations:\n")
        f.write("- All models require their respective scalers for preprocessing\n")
        f.write("- Ensure feature names and order match training data\n")
        f.write("- Consider model size and inference speed for production\n")
        f.write("- Regularly retrain models with new data\n")
        f.write("- Monitor performance metrics in production environment\n")
        f.write("- Consider ensemble methods for improved performance\n")
    
    print(f"\n{'='*80}")
    print("EXTRACTION AND COMPARISON COMPLETE!")
    print("Files saved:")
    print("- all_model_parameters_and_comparison.json (machine-readable)")
    print("- all_model_parameters_and_comparison.txt (comprehensive human-readable)")
    print(f"{'='*80}")
    
    return all_parameters

if __name__ == "__main__":
    parameters = extract_model_parameters()
