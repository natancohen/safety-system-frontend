import { UseFormRegister, FieldErrors, UseFormWatch, UseFormSetValue } from 'react-hook-form';
import type { FormData } from '../../utils/validationSchema';
import styles from '../../styles/FormBase.module.css';
import { eventFactorsOptions } from '../../data/options2';
import { eventOutcomeOptions } from '../../data/options';

interface MiddleColumnProps {
  register: UseFormRegister<FormData>;
  watch: UseFormWatch<FormData>;
  setValue: UseFormSetValue<FormData>;
  errors: FieldErrors<FormData>;
  eventSeverityOptions: string[];
  damageSeverityOptions: string[];
  setShowCasualtiesModal: (show: boolean) => void;
  fieldsLength: number;
  getCharCounterClass: (length: number) => string;
}

export default function MiddleColumn({
  register,
  watch,
  errors,
  eventSeverityOptions,
  damageSeverityOptions,
  setShowCasualtiesModal,
  fieldsLength,
}: MiddleColumnProps) {
  const selectedCategory = watch('category'); 
  const selectedSubCategory = watch('categorySubOptions');
  const selectedSubCategoryOptions = watch('subCategoryOptions');
  const eventOutcome = watch('eventOutcome');

  const getFactorsForCategory = () => {
    try {
      if (!selectedCategory) return [];

      if (selectedCategory === 'ירי דו\'\'צ') {
        if (
          selectedSubCategory === 'מקרים חריגים' &&
          (
            selectedSubCategoryOptions === 'ירי דו\'\'צ -ירי כוחותינו לעבר אזרחים' ||
            selectedSubCategoryOptions === 'ירי דו\'\'צ -ירי כוחותינו לעבר כוחותינו'
          )
        ) {
          return eventFactorsOptions[selectedSubCategoryOptions as keyof typeof eventFactorsOptions]?.factors || [];
        }
        return [];
      }

      if (selectedCategory === 'רק\'\'מ וצמ\'\'ה קרביים') {
        if (
          selectedSubCategory === 'רק\'\'מ וצמ\'\'ה קרביים - רק\'\'מ' ||
          selectedSubCategory === 'רק\'\'מ וצמ\'\'ה קרביים - צמ\'\'ה'
        ) {
          return eventFactorsOptions[selectedSubCategory as keyof typeof eventFactorsOptions]?.factors || [];
        }
        return [];
      }

      if (selectedCategory === 'עבודה' && selectedSubCategory === 'סוג עבודה') {
        return eventFactorsOptions[selectedSubCategoryOptions as keyof typeof eventFactorsOptions]?.factors || [];
      }

      const categoryData = eventFactorsOptions[selectedCategory as keyof typeof eventFactorsOptions];
      if (!categoryData || !categoryData.factors) return [];

      return categoryData.factors;
    } catch (error) {
      console.error('Error in getFactorsForCategory:', error);
      return [];
    }
  };

  const filteredDamageSeverityOptions = eventOutcome?.includes('רכוש')
    ? damageSeverityOptions
    : ['אין נזק'];

  const factors = getFactorsForCategory();
  const isEventFactorEnabled = factors.length > 0;
  const geteventoption = (): string[] => eventOutcomeOptions;
  const hasCasualties = eventOutcome?.includes('יש נפגעים');

  return (
    <aside className={`${styles.column} ${styles.middleColumn}`} data-label="פרטי האירוע">
      <div className={styles.fieldBox}>
        <label className={styles.label}>גורמים לאירוע: </label>
        <select
          className={styles.select}
          {...register('eventFactor')}
          disabled={!isEventFactorEnabled}
        >
          <option value="">בחר גורמים לאירוע</option>
          {factors.map((option, index) => (
            <option key={`${option}-${index}`} value={option}>
              {option}
            </option>
          ))}
        </select>
        {errors.eventFactor && (
          <span className={styles.error}>{errors.eventFactor.message}</span>
        )}
      </div>

      <div className={styles.fieldBox}>
        <label className={styles.label}>תוצאות האירוע: </label>
        <select className={styles.select} {...register('eventSeverity')}>
          <option value="">בחר/י</option>
          {eventSeverityOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        {errors.eventSeverity && (
          <span className={styles.error}>{errors.eventSeverity.message}</span>
        )}
      </div>

      <div className={styles.fieldBox}>
        <label className={styles.label}>חומרת האירוע: </label>
        <select className={styles.select} {...register('eventSeverity')}>
          <option value="">בחר/י</option>
          {eventSeverityOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        {errors.eventSeverity && (
          <span className={styles.error}>{errors.eventSeverity.message}</span>
        )}
      </div>

      <div className={styles.fieldBox}>
        <label className={styles.label}>נפגעים/נזק: </label>
        <select className={styles.select} {...register('eventOutcome')}>
          <option value="">בחר נפגעים/נזק</option>
          {geteventoption().map((option, index) => (
            <option key={`${option}-${index}`} value={option}>
              {option}
            </option>
          ))}
        </select>
        {errors.eventOutcome && (
          <span className={styles.error}>{errors.eventOutcome.message}</span>
        )}
      </div>

      <div className={styles.fieldBox}>
        <label className={styles.label}>חומרת נזק לרכוש: </label>
        <select className={styles.select} {...register('damageType')}>
          <option value="">בחר חומרת נזק</option>
          {filteredDamageSeverityOptions.map(option => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
        {errors.damageType && (
          <span className={styles.error}>{errors.damageType.message}</span>
        )}
      </div>

      <div className={styles.fieldBox}>
        <label className={styles.label}>נפגעים ({fieldsLength})</label>
        <button
          type="button"
          className={styles.input}
          style={{ 
            backgroundColor: hasCasualties ? '#28a745' : '#ccc',
            color: 'white',
            cursor: hasCasualties ? 'pointer' : 'not-allowed',
            textAlign: 'center',
            border: 'none',
            padding: '0.5rem'
          }}
          onClick={() => setShowCasualtiesModal(true)}
          disabled={!hasCasualties}
        >
          ➕ נהל נפגעים
        </button>
        <p style={{ fontSize: '0.7rem', color: '#666', margin: '0.3rem 0 0 0' }}>
          זמין רק כאשר תוצאת האירוע כוללת נפגעים
        </p>
      </div>
    </aside>
  );
}