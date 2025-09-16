import { UseFormRegister, FieldErrors, UseFormWatch, UseFormSetValue } from 'react-hook-form';
import type { FormData } from '../../types/FormTypes';
import { categorySubOptions, subSubCategoryOptions } from '../../data/options';
import styles from '../../styles/FormBase.module.css';
import { MAX_TEXT_LENGTH } from '../../constants/validationMessages';
import {
  handleSubCategoryChange,
  handleSubCategoryOptionsChange,
  handleSubSubCategoryOptionsChange
} from '../../utils/formHandlers';

interface MiddleColumnProps {
  register: UseFormRegister<FormData>;
  watch: UseFormWatch<FormData>;
  setValue: UseFormSetValue<FormData>;
  errors: FieldErrors<FormData>;
  eventSeverityOptions: string[];
  eventOutcomeOptions: string[];
  damageSeverityOptions: string[];
  eventOutcome: string;
  setShowCasualtiesModal: (show: boolean) => void;
  fieldsLength: number;
  getCharCounterClass: (length: number) => string;
}

export default function MiddleColumn({
  register,
  watch,
  setValue,
  errors,
  eventSeverityOptions,
  eventOutcomeOptions,
  damageSeverityOptions,
  eventOutcome,
  setShowCasualtiesModal,
  fieldsLength,
  getCharCounterClass
}: MiddleColumnProps) {
  const selectedCategory = watch('category');
  const selectedSubCategory = watch('categorySubOptions');
  const selectedSubCategoryOptions = watch('subCategoryOptions');
  const recommendationsValue = watch('recommendations') || '';
  const recommendationsLength = recommendationsValue.length;

  const getSubCategories = () => {
    if (selectedCategory && categorySubOptions[selectedCategory as keyof typeof categorySubOptions]) {
      return categorySubOptions[selectedCategory as keyof typeof categorySubOptions].subCategories;
    }
    return [];
  };

  const getSubCategoryOptions = () => {
    if (selectedCategory && selectedSubCategory && categorySubOptions[selectedCategory as keyof typeof categorySubOptions]) {
      const categoryData = categorySubOptions[selectedCategory as keyof typeof categorySubOptions];
      return categoryData.subCategoryOptions[selectedSubCategory as keyof typeof categoryData.subCategoryOptions] || [];
    }
    return [];
  };

  const getSubSubCategoryOptions = () => {
    if (selectedCategory === 'אש' && selectedSubCategory === 'מאפיין אש' && ['חשמל', 'מע\' רכב'].includes(selectedSubCategoryOptions as string)) {
      return subSubCategoryOptions[selectedSubCategoryOptions as keyof typeof subSubCategoryOptions] || [];
    }
    return [];
  };

  const filteredDamageSeverityOptions = eventOutcome.includes('אין נזק') 
    ? ['אין נזק']
    : damageSeverityOptions;

  return (
    <aside className={`${styles.column} ${styles.middleColumn}`} data-label="פרטי האירוע">
      <div className={styles.fieldBox}>
        <label className={styles.label}>גורמים לאירוע *</label>
        <select 
          className={styles.select}
          {...register('categorySubOptions')}
          onChange={(e) => handleSubCategoryChange(setValue, e.target.value)}
        >
          <option value="">בחר גורמים לאירוע</option>
          {getSubCategories().map(option => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
        {errors.categorySubOptions && <span className={styles.error}>{errors.categorySubOptions.message}</span>}
      </div>

      <div className={styles.fieldBox}>
        {selectedCategory === 'אש' && selectedSubCategory === 'עלויות' ? (
          <>
            <label className={styles.label}>הסכום (₪)</label>
            <input
              type="number"
              className={styles.input}
              placeholder="הזן סכום בשקלים"
              {...register('costAmount', { valueAsNumber: true })}
            />
            {errors.costAmount && <span className={styles.error}>{errors.costAmount.message}</span>}
          </>
        ) : selectedSubCategory === 'כמות דונם שרוף' ? (
          <>
            <label className={styles.label}>הכמות (דונם)</label>
            <input
              type="number"
              className={styles.input}
              placeholder="הזן כמות"
              {...register('costAmount', { valueAsNumber: true })}
            />
            {errors.costAmount && <span className={styles.error}>{errors.costAmount.message}</span>}
          </>
        ) : (
          <>
            <label className={styles.label}>תת-קטגוריה *</label>
            <select 
              className={styles.select}
              {...register('subCategoryOptions')}
              onChange={(e) => handleSubCategoryOptionsChange(setValue, e.target.value)}
            >
              <option value="">בחר תת-קטגוריה</option>
              {getSubCategoryOptions().map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
            {errors.subCategoryOptions && <span className={styles.error}>{errors.subCategoryOptions.message}</span>}
          </>
        )}
      </div>

      <div className={styles.fieldBox}>
        <label className={styles.label}>תת-קטגוריה משנית</label>
        <select 
          className={styles.select}
          {...register('subSubCategoryOptions')}
          onChange={(e) => handleSubSubCategoryOptionsChange(setValue, e.target.value)}
          disabled={!(selectedCategory === 'אש' && selectedSubCategory === 'מאפיין אש' && ['חשמל', 'מע\' רכב'].includes(selectedSubCategoryOptions as string))}
        >
          <option value="">בחר תת-קטגוריה משנית</option>
          {getSubSubCategoryOptions().map(option => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
        {errors.subSubCategoryOptions && <span className={styles.error}>{errors.subSubCategoryOptions.message}</span>}
        {!(selectedCategory === 'אש' && selectedSubCategory === 'מאפיין אש' && ['חשמל', 'מע\' רכב'].includes(selectedSubCategoryOptions as string)) && (
          <p style={{ fontSize: '0.7rem', color: '#666', margin: '0.3rem 0 0 0' }}>
            זמין רק עבור קטגוריית אש → מאפיין אש → חשמל/מע' רכב
          </p>
        )}
      </div>

      <div className={styles.fieldBox}>
        <label className={styles.label}>חומרת אירוע *</label>
        <select 
          className={styles.select}
          {...register('eventSeverity')}
        >
          <option value="">בחר/י</option>
          {eventSeverityOptions.map(option => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
        {errors.eventSeverity && <span className={styles.error}>{errors.eventSeverity.message}</span>}
      </div>

      <div className={styles.fieldBox}>
        <label className={styles.label}>תוצאת אירוע *</label>
        <select 
          className={styles.select}
          {...register('eventOutcome')}
        >
          <option value="">בחר תוצאת אירוע</option>
          {eventOutcomeOptions.map(option => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
        {errors.eventOutcome && <span className={styles.error}>{errors.eventOutcome.message}</span>}
      </div>

      <div className={styles.fieldBox}>
        <label className={styles.label}>חומרת נזק לרכוש *</label>
        <select 
          className={styles.select}
          {...register('damageType')}
        >
          <option value="">בחר חומרת נזק</option>
          {filteredDamageSeverityOptions.map(option => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
        {errors.damageType && <span className={styles.error}>{errors.damageType.message}</span>}
      </div>

      <div className={styles.fieldBox}>
        <label className={styles.label}>נפגעים ({fieldsLength})</label>
        <button
          type="button"
          className={styles.input}
          style={{ 
            backgroundColor: eventOutcome && eventOutcome.includes('יש נפגעים') ? '#28a745' : '#ccc',
            color: 'white',
            cursor: eventOutcome && eventOutcome.includes('יש נפגעים') ? 'pointer' : 'not-allowed',
            textAlign: 'center',
            border: 'none',
            padding: '0.5rem'
          }}
          onClick={() => setShowCasualtiesModal(true)}
          disabled={!eventOutcome || !eventOutcome.includes('יש נפגעים')}
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