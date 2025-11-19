import { UseFormRegister, FieldErrors, UseFormWatch } from 'react-hook-form';
import type { FormData } from '../utils/validation_schema';
import styles from '../styles/form_base.module.css';
import { MAX_TEXT_LENGTH } from '../utils/validation_messages';

interface FourthColumnProps {
  register: UseFormRegister<FormData>;
  watch: UseFormWatch<FormData>;
  errors: FieldErrors<FormData>;
  getCharCounterClass: (length: number) => string;
}

export default function FourthColumn({
  register,
  watch,
  errors,
  getCharCounterClass
}: FourthColumnProps) {
  const recommendationsValue = watch('recommendations') || '';
  const recommendationsLength = recommendationsValue.length;

  return (
    <aside className={`${styles.column} ${styles.fourthColumn}`} data-label="המלצות ראשוניות">
      <div className={styles.fieldBox}>
        <label className={styles.label}>המלצות ראשוניות:</label>
        <textarea
          className={styles.textarea}
          style={{ minHeight: '80px', maxHeight: '120px' }}
          placeholder="המלצות ראשוניות לטיפול באירוע."
          maxLength={800}
          {...register('recommendations')}
        />
        <div className={`${styles.charCounter} ${styles[getCharCounterClass(recommendationsLength)]}`}>
          {recommendationsLength}/{MAX_TEXT_LENGTH}
        </div>
        {errors.recommendations && <span className={styles.error}>{errors.recommendations.message}</span>}
      </div>
    </aside>
  );
}
