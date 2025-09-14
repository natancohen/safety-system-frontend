export const VALIDATION_MESSAGES = {
  REQUIRED: 'שדה חובה',
  MAX_LENGTH: (max: number) => `מקסימום ${max} תווים`,
  MIN_LENGTH: (min: number) => `מינימום ${min} תווים`,
  DATE_FUTURE: 'לא ניתן לבחור תאריך עתידי',
  COST_AMOUNT_INVALID: 'הזן סכום תקין (מספר חיובי עם עד 2 ספרות אחרי הנקודה)',
  DAMAGE_MISMATCH: 'חייב לבחור "אין נזק" אם אין נזק באירוע',
  LATITUDE_INVALID: 'קו רוחב לא תקין (טווח: -90 עד 90)',
  LONGITUDE_INVALID: 'קו אורך לא תקין (טווח: -180 עד 180)',
} as const;

export const MAX_TEXT_LENGTH = 800;
export const MIN_TEXT_LENGTH = 10;
export const MAX_CASUALTIES_COUNT = 100;