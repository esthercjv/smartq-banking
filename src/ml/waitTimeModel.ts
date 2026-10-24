// Wait-time model used by the Wait Time Prediction screen.
// Trained offline in train_model_v2.py on queue_data.csv. It uses only
// queue_length, arrival_hour and peak_hour, and it did NOT outperform an
// average-wait baseline (test MAE 3.62 min vs 3.62 min for the baseline).
// Numbers are copied exactly from ml_output/model_coefficients.json and
// ml_output/results.json; nothing here retrains or fetches anything.
export const WAIT_MODEL = {
  name: 'Linear Regression',
  featureNames: ['queue_length', 'arrival_hour', 'peak_hour'],
  intercept: 11.012131466274488,
  coefficients: [
    -0.02477369464181842,
    0.028614208638117117,
    -0.3688070503803712,
  ],
  trainedOnRows: 437,
  totalValidRows: 547,
  seed: 42,
  metrics: {
    testMae: 3.623944298683046,
    testRmse: 4.366933373019702,
    testR2: -0.023489547901869523,
    baselineTestMae: 3.615785729144997,
    baselineTestRmse: 4.335560830878124,
    cvMaeMean: 3.866993169711658,
    cvMaeStd: 0.2397986478016873,
    precisionMarginMinutes: 4.366933373019702,
    marginCoveragePct: 65.45,
  },
} as const;

export function isPeakHour(hour: number): boolean {
  const h = Math.floor(hour);
  return (h >= 9 && h <= 11) || (h >= 14 && h <= 16);
}

// Returns the unrounded prediction in minutes.
export function predictWaitMinutes(queueLength: number, hour: number): number {
  const q = Math.max(0, queueLength);
  const h = Math.min(23, Math.max(0, Math.floor(hour)));
  const [cQueue, cHour, cPeak] = WAIT_MODEL.coefficients;
  return (
    WAIT_MODEL.intercept +
    cQueue * q +
    cHour * h +
    cPeak * (isPeakHour(h) ? 1 : 0)
  );
}
