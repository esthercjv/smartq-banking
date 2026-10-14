import pandas as pd
import numpy as np
import joblib

from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression
from sklearn.tree import DecisionTreeRegressor
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score

# ==========================================
# LOAD DATA
# ==========================================
print("Loading dataset...")

df = pd.read_csv("queue_data.csv")

df = df[
    [
        "arrival_time",
        "start_time",
        "finish_time",
        "wait_time",
        "queue_length"
    ]
]

# ==========================================
# REMOVE INVALID RECORDS
# ==========================================
df = df[df["wait_time"] >= 0]

print(f"Records after cleaning: {len(df)}")

# ==========================================
# FEATURE ENGINEERING
# ==========================================

def extract_hour(text):
    try:
        time_part = str(text).split(" ")[1]
        return int(float(time_part))
    except:
        return 0

df["arrival_hour"] = df["arrival_time"].apply(extract_hour)

df["peak_hour"] = df["arrival_hour"].apply(
    lambda x: 1 if (9 <= x <= 11) or (14 <= x <= 16) else 0
)

# ==========================================
# FEATURES & TARGET
# ==========================================
X = df[
    [
        "queue_length",
        "arrival_hour",
        "peak_hour"
    ]
]

y = df["wait_time"]

# ==========================================
# TRAIN TEST SPLIT
# ==========================================
X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.2,
    random_state=42
)

# ==========================================
# MODELS
# ==========================================
models = {
    "Linear Regression":
        LinearRegression(),

    "Decision Tree":
        DecisionTreeRegressor(
            random_state=42,
            max_depth=8
        ),

    "Random Forest":
        RandomForestRegressor(
            random_state=42,
            n_estimators=100
        )
}

results = {}

print("\nTraining Models...\n")

for name, model in models.items():

    model.fit(X_train, y_train)

    predictions = model.predict(X_test)

    mae = mean_absolute_error(y_test, predictions)

    rmse = np.sqrt(
        mean_squared_error(y_test, predictions)
    )

    r2 = r2_score(y_test, predictions)

    results[name] = {
        "MAE": mae,
        "RMSE": rmse,
        "R2": r2,
        "model": model
    }

    print("=" * 50)
    print(name)
    print(f"MAE  : {mae:.4f}")
    print(f"RMSE : {rmse:.4f}")
    print(f"R²   : {r2:.4f}")
    print("=" * 50)

# ==========================================
# BEST MODEL
# ==========================================
best_name = min(
    results,
    key=lambda x: results[x]["MAE"]
)

best_model = results[best_name]["model"]

print("\nBEST MODEL")
print("=" * 50)
print(best_name)
print(f"MAE  : {results[best_name]['MAE']:.4f}")
print(f"RMSE : {results[best_name]['RMSE']:.4f}")
print(f"R²   : {results[best_name]['R2']:.4f}")

# ==========================================
# SAVE MODEL
# ==========================================
joblib.dump(
    best_model,
    "model.pkl"
)

print("\nmodel.pkl saved successfully.")