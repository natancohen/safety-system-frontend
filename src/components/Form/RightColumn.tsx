import { UseFormRegister, FieldErrors, UseFormWatch, UseFormSetValue } from 'react-hook-form';
import type { FormData } from '../../types/FormTypes';
import styles from '../../styles/FormBase.module.css';
import { handleCategoryChange } from '../../utils/formHandlers';
import { useRef } from 'react';
import { MAX_TEXT_LENGTH } from '../../constants/validationMessages';

interface RightColumnProps {
  register: UseFormRegister<FormData>;
  watch: UseFormWatch<FormData>;
  setValue: UseFormSetValue<FormData>;
  errors: FieldErrors<FormData>;
  textLength: number;
  getCharCounterClass: (length: number) => string;
  unitOptions: string[];
  unitActivityOptions: string[];
  activityOptions: string[];
  categoryOptions: string[];
}

export default function RightColumn({
  register,
  setValue,
  errors,
  textLength,
  getCharCounterClass,
  unitOptions,
  unitActivityOptions,
  activityOptions,
  categoryOptions
}: RightColumnProps) {
  const dateInputRef = useRef<HTMLInputElement>(null);

  const preventKeyboardInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    e.preventDefault();
  };

  return (
    <aside className={`${styles.column} ${styles.rightColumn}`} data-label="פרטים אישיים">
      <div className={styles.fieldBox}>
        <label className={styles.label}>יחידת משנה *</label>
        <select 
          className={styles.select}
          {...register('unitName')}
        >
          <option value="">בחר יחידת משנה</option>
          {unitOptions.map(option => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
        {errors.unitName && <span className={styles.error}>{errors.unitName.message}</span>}
      </div>

      <div className={styles.fieldBox}>
        <label className={styles.label}>תאריך *</label>
        <input
          type="date"
          className={`${styles.input} ${styles.dateInput}`}
          ref={dateInputRef}
          onKeyDown={preventKeyboardInput}
          {...register('date')}
        />
        {errors.date && <span className={styles.error}>{errors.date.message}</span>}
      </div>

      <div className={styles.fieldBox}>
        <label className={styles.label}>מאפיין פעילות יחידה *</label>
        <select 
          className={styles.select}
          {...register('unitActivityType')}
        >
          <option value="">בחר מאפיין פעילות יחידה</option>
          {unitActivityOptions.map(option => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
        {errors.unitActivityType && <span className={styles.error}>{errors.unitActivityType.message}</span>}
      </div>

      <div className={styles.fieldBox}>
        <label className={styles.label}>מאפיין פעילות פרט *</label>
        <select 
          className={styles.select}
          {...register('activityType')}
        >
          <option value="">בחר מאפיין פעילות פרט</option>
          {activityOptions.map(option => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
        {errors.activityType && <span className={styles.error}>{errors.activityType.message}</span>}
      </div>

      <div className={styles.fieldBox}>
        <label className={styles.label}>מאפיין פעילות תחומי *</label>
        <select 
          className={styles.select}
          {...register('category')}
          onChange={(e) => handleCategoryChange(setValue, e.target.value)}
        >
          <option value="">בחר מאפיין פעילות תחומי</option>
          {categoryOptions.map(option => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
        {errors.category && <span className={styles.error}>{errors.category.message}</span>}
      </div>

      <div className={styles.fieldBox} style={{ minHeight: '120px' }}>
        <label className={styles.label}>תיאור מפורט *</label>
        <textarea
          className={styles.textarea}
          style={{ minHeight: '175px', maxHeight: '150px' }}
          placeholder="תיאור מפורט של האירוע..."
          {...register('text')}
        />
        <div className={`${styles.charCounter} ${styles[getCharCounterClass(textLength)]}`}>
          {textLength}/{MAX_TEXT_LENGTH}
        </div>
        {errors.text && <span className={styles.error}>{errors.text.message}</span>}
      </div>
    </aside>
  );
}