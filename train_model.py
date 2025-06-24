import pandas as pd
import numpy as np
import joblib
from sklearn.model_selection import train_test_split, GridSearchCV
from sklearn.preprocessing import LabelEncoder, StandardScaler
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report, confusion_matrix
import matplotlib.pyplot as plt
import seaborn as sns
import os

def add_derived_features(df):
    """Add derived features to the dataset"""
    # Calculate derived features
    df['EMI_to_Income_Ratio'] = df['EMI_Existing_Loans'] / df['Monthly_Income']
    df['Loan_to_Income_Ratio'] = df['Loan_Amount_Requested'] / df['Monthly_Income']
    df['Loan_to_Balance_Ratio'] = df['Loan_Amount_Requested'] / df['Bank_Balance']
    
    # Add rule-based features
    df['CIBIL_Score_Good'] = (df['CIBIL_Score'] >= 650).astype(int)
    df['CIBIL_Score_Excellent'] = (df['CIBIL_Score'] >= 750).astype(int)
    df['Bank_Balance_Good'] = (df['Bank_Balance'] >= 50000).astype(int)
    df['EMI_Ratio_Good'] = (df['EMI_to_Income_Ratio'] < 0.4).astype(int)
    df['Age_Good'] = ((df['Age'] >= 21) & (df['Age'] <= 60)).astype(int)
    df['Loan_Amount_Good'] = (df['Loan_Amount_Requested'] <= df['Monthly_Income'] * 12).astype(int)
    df['Loan_Tenure_Good'] = (df['Loan_Tenure_Months'] <= 60).astype(int)
    
    return df

def create_sample_data():

    data = pd.read_csv("Loan_Approval_Indian_Customers.csv")
    
    # Create DataFrame
    df = pd.DataFrame(data)
    
    # Add derived features
    df = add_derived_features(df)
    
    # Generate loan status based on rules
    df['Loan_Status'] = (
        (df['CIBIL_Score'] >= 650) &
        (df['Bank_Balance'] >= 50000) &
        (df['EMI_to_Income_Ratio'] < 0.4) &
        (df['Age'] >= 21) &
        (df['Age'] <= 60) &
        (df['Loan_Amount_Requested'] <= df['Monthly_Income'] * 12) &
        (df['Loan_Tenure_Months'] <= 60) &
        (df['Employment_Type'].isin(['Full-Time', 'Self-Employed'])) &
        (df['Income_Source'].isin(['Salary', 'Business']))
    )
    
    return df

def train_model():
    """Train the loan approval prediction model"""
    # Load or create dataset
    if os.path.exists("Loan_Approval_Indian_Customers.csv"):
        print("Loading existing dataset...")
        df = pd.read_csv("Loan_Approval_Indian_Customers.csv")
        # Add derived features if they don't exist
        df = add_derived_features(df)
    else:
        print("No dataset found. Creating sample data...")
        df = create_sample_data()
        df.to_csv("Loan_Approval_Indian_Customers.csv", index=False)
    
    # Encode categorical variables
    label_encoders = {}
    categorical_columns = ["Gender", "Existing_Loans", "Income_Source", "Employment_Type", "Banks_Name", "Loan_Status"]
    
    for col in categorical_columns:
        df[col] = df[col].astype(str)
        le = LabelEncoder()
        df[col] = le.fit_transform(df[col])
        label_encoders[col] = le
    
    # Define features and target
    feature_columns = [
        "Customer_ID", "Name", "Age", "Gender", "Phone_Number", "Email", "Address", "City", "State", "Pincode",
        "Bank_Balance", "CIBIL_Score", "Existing_Loans", "Loan_Amount_Requested", "Loan_Tenure_Months",
        "Monthly_Income", "Income_Source", "Employment_Type", "Other_Loans", "EMI_Existing_Loans", "Banks_Name"
    ]
    
    X = df[feature_columns]
    y = df["Loan_Status"]
    
    # Split dataset
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    # Scale numerical features
    scaler = StandardScaler()
    numerical_cols = ['Age', 'Monthly_Income', 'Bank_Balance', 'CIBIL_Score',
                     'Loan_Amount_Requested', 'Loan_Tenure_Months', 'Other_Loans',
                     'EMI_Existing_Loans', 'EMI_to_Income_Ratio', 'Loan_to_Income_Ratio',
                     'Loan_to_Balance_Ratio']
    
    X_train[numerical_cols] = scaler.fit_transform(X_train[numerical_cols])
    X_test[numerical_cols] = scaler.transform(X_test[numerical_cols])
    
    # Train Random Forest model with hyperparameter tuning
    param_grid = {
        'n_estimators': [100, 200, 300],
        'max_depth': [10, 20, 30, None],
        'min_samples_split': [2, 5, 10],
        'min_samples_leaf': [1, 2, 4]
    }
    
    rf = RandomForestClassifier(random_state=42)
    grid_search = GridSearchCV(rf, param_grid, cv=5, scoring='f1', n_jobs=-1)
    grid_search.fit(X_train, y_train)
    
    # Get best model
    best_model = grid_search.best_estimator_
    
    # Evaluate model
    y_pred = best_model.predict(X_test)
    print("\nClassification Report:")
    print(classification_report(y_test, y_pred))
    
    # Plot feature importance
    plt.figure(figsize=(12, 6))
    feature_importance = pd.DataFrame({
        'feature': feature_columns,
        'importance': best_model.feature_importances_
    })
    feature_importance = feature_importance.sort_values('importance', ascending=False)
    sns.barplot(x='importance', y='feature', data=feature_importance.head(10))
    plt.title('Top 10 Most Important Features')
    plt.tight_layout()
    plt.savefig('feature_importance.png')
    plt.close()
    
    # Save model and encoders
    joblib.dump(best_model, "loan_model.pkl")
    joblib.dump(label_encoders, "label_encoders.pkl")
    joblib.dump(scaler, "feature_scaler.pkl")
    
    print("\nModel, encoders, and scaler saved successfully!")
    print(f"Best parameters: {grid_search.best_params_}")
    
    return best_model, label_encoders, scaler

if __name__ == "__main__":
    train_model() 