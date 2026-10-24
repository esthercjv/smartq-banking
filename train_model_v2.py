#!/usr/bin/env python3
import json
import os
from datetime import datetime

import joblib
import matplotlib.pyplot as plt
import numpy as np
import pandas as pd
from scipy import stats
from sklearn.base import clone
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
from sklearn.model_selection import KFold, train_test_split
from sklearn.tree import DecisionTreeRegressor
from sklearn.ensemble import RandomForestRegressor


RANDOM_SEED = 42


def extract_hour(arrival_time_str):
    try:
        time_part = str(arrival_time_str).split(" ")[1]
        hour_float = float(time_part)
        return int(hour_float)
    except Exception:
        return 0


def main():
    # Ensure ml_output directory exists
    os.makedirs("ml_output", exist_ok=True)

    # Load data with BOM and only first 5 columns
    df_raw = pd.read_csv("queue_data.csv", encoding="utf-8-sig", usecols=[0, 1, 2, 3, 4])
    rows_loaded = len(df_raw)

    # Remove rows where wait_time < 0
    mask_valid = df_raw["wait_time"] >= 0
    rows_removed_neg = int((~mask_valid).sum())
    df = df_raw[mask_valid].copy()
    final_rows = len(df)

    # Feature engineering
    df["arrival_hour"] = df["arrival_time"].apply(extract_hour)
    df["peak_hour"] = df["arrival_hour"].apply(lambda x: 1 if (9 <= x <= 11) or (14 <= x <= 16) else 0)

    # Features and target
    feature_names = ["queue_length", "arrival_hour", "peak_hour"]
    X = df[feature_names].copy()
    y = df["wait_time"].copy()

    # Train/test split
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=RANDOM_SEED
    )

    # Baseline
    baseline_pred_train = np.full(shape=len(y_train), fill_value=y_train.mean())
    baseline_model_train_mean = float(y_train.mean())

    # Models
    models = {
        "Baseline": None,  # handled separately
        "Linear Regression": LinearRegression(),
        "Decision Tree": DecisionTreeRegressor(max_depth=8, random_state=RANDOM_SEED),
        "Random Forest": RandomForestRegressor(n_estimators=100, random_state=RANDOM_SEED),
    }

    results = {}

    # Train and evaluate
    for name, model in models.items():
        if name == "Baseline":
            y_pred_train = baseline_pred_train
            y_pred_test = np.full(shape=len(y_test), fill_value=baseline_model_train_mean)
            trained_model = None
        else:
            m = clone(model)
            m.fit(X_train, y_train)
            trained_model = m
            y_pred_train = m.predict(X_train)
            y_pred_test = m.predict(X_test)

        train_mae = float(mean_absolute_error(y_train, y_pred_train))
        train_rmse = float(np.sqrt(mean_squared_error(y_train, y_pred_train)))
        train_r2 = float(r2_score(y_train, y_pred_train))

        test_mae = float(mean_absolute_error(y_test, y_pred_test))
        test_rmse = float(np.sqrt(mean_squared_error(y_test, y_pred_test)))
        test_r2 = float(r2_score(y_test, y_pred_test))

        results[name] = {
            "train": {"MAE": train_mae, "RMSE": train_rmse, "R2": train_r2},
            "test": {"MAE": test_mae, "RMSE": test_rmse, "R2": test_r2},
            "model": trained_model,
            "y_pred_test": y_pred_test,
        }

    # Cross-validation on full cleaned dataset
    kf = KFold(n_splits=5, shuffle=True, random_state=RANDOM_SEED)
    cv_results = {}
    X_full = X
    y_full = y

    for name in ["Baseline", "Linear Regression", "Decision Tree", "Random Forest"]:
        cv_mae_list = []
        cv_rmse_list = []
        cv_r2_list = []
        for train_idx, val_idx in kf.split(X_full):
            X_tr = X_full.iloc[train_idx]
            y_tr = y_full.iloc[train_idx]
            X_val = X_full.iloc[val_idx]
            y_val = y_full.iloc[val_idx]
            if name == "Baseline":
                y_pred_val = np.full(shape=len(y_val), fill_value=y_tr.mean())
            elif name == "Linear Regression":
                m = LinearRegression()
                m.fit(X_tr, y_tr)
                y_pred_val = m.predict(X_val)
            elif name == "Decision Tree":
                m = DecisionTreeRegressor(max_depth=8, random_state=RANDOM_SEED)
                m.fit(X_tr, y_tr)
                y_pred_val = m.predict(X_val)
            elif name == "Random Forest":
                m = RandomForestRegressor(n_estimators=100, random_state=RANDOM_SEED)
                m.fit(X_tr, y_tr)
                y_pred_val = m.predict(X_val)
            else:
                y_pred_val = np.full(shape=len(y_val), fill_value=y_tr.mean())
            cv_mae_list.append(mean_absolute_error(y_val, y_pred_val))
            cv_rmse_list.append(np.sqrt(mean_squared_error(y_val, y_pred_val)))
            cv_r2_list.append(r2_score(y_val, y_pred_val))
        cv_results[name] = {
            "MAE_mean": float(np.mean(cv_mae_list)),
            "MAE_std": float(np.std(cv_mae_list)),
            "RMSE_mean": float(np.mean(cv_rmse_list)),
            "RMSE_std": float(np.std(cv_rmse_list)),
            "R2_mean": float(np.mean(cv_r2_list)),
            "R2_std": float(np.std(cv_r2_list)),
        }

    # Model selection: lowest mean CV MAE; if baseline is lowest, still save best real model (b,c,d)
    cv_mae_by_name = {k: v["MAE_mean"] for k, v in cv_results.items()}
    best_cv_name = min(cv_mae_by_name, key=cv_mae_by_name.get)
    baseline_was_best = (best_cv_name == "Baseline")

    real_models = ["Linear Regression", "Decision Tree", "Random Forest"]
    best_real_by_cv_mae = min(real_models, key=lambda n: cv_results[n]["MAE_mean"])
    selected_model_name = best_real_by_cv_mae  # save best real model as requested

    # Re-train selected model on training split only and save
    if selected_model_name == "Linear Regression":
        selected_model = LinearRegression()
    elif selected_model_name == "Decision Tree":
        selected_model = DecisionTreeRegressor(max_depth=8, random_state=RANDOM_SEED)
    elif selected_model_name == "Random Forest":
        selected_model = RandomForestRegressor(n_estimators=100, random_state=RANDOM_SEED)
    else:
        selected_model = LinearRegression()

    selected_model.fit(X_train, y_train)
    joblib.dump(selected_model, os.path.join("ml_output", "model_v2.pkl"))

    # Coefficients if linear
    if isinstance(selected_model, LinearRegression):
        coeff_path = os.path.join("ml_output", "model_coefficients.json")
        coeff_data = {
            "feature_names": feature_names,
            "intercept": float(selected_model.intercept_),
            "coefficients": [float(c) for c in selected_model.coef_],
            "trained_on_rows": int(len(X_train)),
            "random_seed": RANDOM_SEED,
        }
        with open(coeff_path, "w", encoding="utf-8") as f:
            json.dump(coeff_data, f, indent=2)
        coeff_written = True
    else:
        coeff_written = False

    # Predictions for selected model on test set (from the trained model)
    y_pred_selected_test = selected_model.predict(X_test)

    # Margin check
    margin = float(np.sqrt(mean_squared_error(y_test, y_pred_selected_test)))
    within_margin = np.abs(y_test.values - y_pred_selected_test) <= margin
    margin_pct = float(within_margin.mean() * 100.0)

    # Data checks
    wait_series = df["wait_time"]
    mean_wait = float(wait_series.mean())
    std_wait = float(wait_series.std(ddof=1)) if len(wait_series) > 1 else float(wait_series.std())
    corr_pearson = float(wait_series.corr(df["queue_length"], method="pearson"))
    corr_spearman = float(wait_series.corr(df["queue_length"], method="spearman"))

    # ANOVA by arrival_hour
    # group by arrival_hour
    groups = []
    for h, g in df.groupby("arrival_hour")["wait_time"]:
        groups.append(g.values)
    if len(groups) >= 2:
        f_stat, p_val = stats.f_oneway(*groups)
        f_stat_out = float(f_stat)
        p_val_out = float(p_val)
    else:
        f_stat_out = float("nan")
        p_val_out = float("nan")

    data_checks_lines = []
    data_checks_lines.append(f"rows_loaded: {rows_loaded}")
    data_checks_lines.append(f"rows_removed_negative_wait_time: {rows_removed_neg}")
    data_checks_lines.append(f"final_rows: {final_rows}")
    data_checks_lines.append(f"wait_time_mean: {mean_wait}")
    data_checks_lines.append(f"wait_time_std: {std_wait}")
    data_checks_lines.append(f"pearson_correlation_queue_length_wait_time: {corr_pearson}")
    data_checks_lines.append(f"spearman_correlation_queue_length_wait_time: {corr_spearman}")
    data_checks_lines.append(f"anova_wait_time_by_arrival_hour_F: {f_stat_out}")
    data_checks_lines.append(f"anova_wait_time_by_arrival_hour_p: {p_val_out}")
    with open(os.path.join("ml_output", "data_checks.txt"), "w", encoding="utf-8") as f:
        f.write("\n".join(data_checks_lines) + "\n")

    # Figures
    plt.figure(figsize=(6, 6))
    plt.scatter(y_test, y_pred_selected_test, alpha=0.7)
    min_val = min(y_test.min(), y_pred_selected_test.min())
    max_val = max(y_test.max(), y_pred_selected_test.max())
    plt.plot([min_val, max_val], [min_val, max_val], "r--", label="y=x")
    plt.xlabel("Actual wait time (minutes)")
    plt.ylabel("Predicted wait time (minutes)")
    plt.title(f"Predicted vs Actual - {selected_model_name}")
    plt.legend()
    plt.tight_layout()
    plt.savefig(os.path.join("ml_output", "fig_predicted_vs_actual.png"), dpi=150)
    plt.close()

    plt.figure(figsize=(6, 4))
    errors = y_test.values - y_pred_selected_test
    plt.hist(errors, bins=20, alpha=0.7)
    plt.xlabel("Error (actual - predicted) (minutes)")
    plt.ylabel("Count")
    plt.title(f"Error Histogram - {selected_model_name}")
    plt.tight_layout()
    plt.savefig(os.path.join("ml_output", "fig_error_histogram.png"), dpi=150)
    plt.close()

    # results.json
    results_json = {
        "random_seed": RANDOM_SEED,
        "data": {
            "rows_loaded": rows_loaded,
            "rows_removed_negative_wait_time": rows_removed_neg,
            "final_rows": final_rows,
            "usecols": [0, 1, 2, 3, 4],
            "encoding": "utf-8-sig",
            "features": feature_names,
            "target": "wait_time",
        },
        "split": {"test_size": 0.2, "random_state": RANDOM_SEED},
        "library_versions": {
            "pandas": pd.__version__,
            "numpy": np.__version__,
            "scikit-learn": __import__("sklearn").__version__,
            "joblib": joblib.__version__,
            "matplotlib": plt.matplotlib.__version__,
            "scipy": __import__("scipy").__version__,
        },
        "models": {},
        "cv": cv_results,
        "model_selection": {
            "best_cv_mae_name": best_cv_name,
            "baseline_was_best_by_cv_mae": baseline_was_best,
            "selected_model_name": selected_model_name,
            "reason": "Selected model with lowest mean CV MAE among real models (Linear Regression, Decision Tree, Random Forest). Baseline was evaluated but not saved as selected model per instructions.",
        },
        "margin_check": {
            "margin": margin,
            "percentage_within_margin": margin_pct,
            "description": "Percentage of test predictions where |actual - predicted| <= selected model test RMSE",
        },
        "coefficients_written": coeff_written,
    }

    for name in ["Baseline", "Linear Regression", "Decision Tree", "Random Forest"]:
        results_json["models"][name] = {
            "train": results[name]["train"],
            "test": results[name]["test"],
        }

    with open(os.path.join("ml_output", "results.json"), "w", encoding="utf-8") as f:
        json.dump(results_json, f, indent=2)

    # results_table.md
    table_lines = []
    table_lines.append("# Results Table")
    table_lines.append("")
    table_lines.append("## Test Set")
    table_lines.append("")
    table_lines.append("| Model | Test MAE | Test RMSE | Test R2 | CV MAE (mean +/- std) | CV RMSE (mean) | CV R2 (mean) |")
    table_lines.append("|---|---|---|---|---|---|---|")
    for name in ["Baseline", "Linear Regression", "Decision Tree", "Random Forest"]:
        t = results[name]["test"]
        c = cv_results[name]
        table_lines.append(
            f"| {name} | {t['MAE']:.4f} | {t['RMSE']:.4f} | {t['R2']:.4f} | {c['MAE_mean']:.4f} +/- {c['MAE_std']:.4f} | {c['RMSE_mean']:.4f} | {c['R2_mean']:.4f} |"
        )
    table_lines.append("")
    table_lines.append("## Training Set")
    table_lines.append("")
    table_lines.append("| Model | Train MAE | Train RMSE | Train R2 |")
    table_lines.append("|---|---|---|---|")
    for name in ["Baseline", "Linear Regression", "Decision Tree", "Random Forest"]:
        tr = results[name]["train"]
        table_lines.append(f"| {name} | {tr['MAE']:.4f} | {tr['RMSE']:.4f} | {tr['R2']:.4f} |")
    table_lines.append("")
    with open(os.path.join("ml_output", "results_table.md"), "w", encoding="utf-8") as f:
        f.write("\n".join(table_lines) + "\n")

    # Print summary
    print("=== RESULTS TABLE (Test) ===")
    print("| Model | Test MAE | Test RMSE | Test R2 | CV MAE (mean +/- std) |")
    print("|---|---|---|---|")
    for name in ["Baseline", "Linear Regression", "Decision Tree", "Random Forest"]:
        t = results[name]["test"]
        c = cv_results[name]
        print(f"| {name} | {t['MAE']:.4f} | {t['RMSE']:.4f} | {t['R2']:.4f} | {c['MAE_mean']:.4f} +/- {c['MAE_std']:.4f} |")
    print("")
    print(f"Selected model: {selected_model_name}")
    print(f"Baseline was best by CV MAE? {baseline_was_best}")
    print(f"Reason: Lowest mean CV MAE among real models (Linear Regression, Decision Tree, Random Forest). Baseline evaluated separately.")
    print(f"Margin check (|actual-predicted| <= test RMSE of selected model): {margin_pct:.2f}%")
    print("")
    print("Files created in ml_output/:")
    print("- model_v2.pkl")
    if coeff_written:
        print("- model_coefficients.json")
    print("- results.json")
    print("- results_table.md")
    print("- fig_predicted_vs_actual.png")
    print("- fig_error_histogram.png")
    print("- data_checks.txt")
    print("")
    print("No existing files modified.")


if __name__ == "__main__":
    main()
