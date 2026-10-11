/** A planning model, not a forecast: incremental completed work × contribution margin. */
export type VoiceRoiInputs = {
  calls: number; minutes: number; minuteRate: number; setup: number; support: number;
  bookingValue: number; margin: number; currentCompletion: number; targetCompletion: number;
  capacity: number; avoidedCash: number;
};
export function calculateVoiceRoi(input: VoiceRoiInputs) {
  const n = (value: number) => Number.isFinite(value) ? Math.max(0, value) : 0;
  const percent = (value: number) => Math.min(100, n(value)) / 100;
  const calls = n(input.calls);
  const usage = calls * n(input.minutes) * n(input.minuteRate);
  const monthlyCost = usage + n(input.support);
  // Rates include eligibility, booking and attendance, as a share of ALL calls.
  const additionalCompleted = Math.min(n(input.capacity), calls * Math.max(0, percent(input.targetCompletion) - percent(input.currentCompletion)));
  const contribution = additionalCompleted * n(input.bookingValue) * percent(input.margin);
  const monthlyNet = contribution + n(input.avoidedCash) - monthlyCost;
  return { usage, monthlyCost, additionalCompleted, contribution, monthlyNet,
    firstYearNet: monthlyNet * 12 - n(input.setup),
    paybackMonths: monthlyNet > 0 ? n(input.setup) / monthlyNet : null };
}
