import { UseFormRegister, FieldErrors, UseFormWatch, UseFormSetValue } from 'react-hook-form';
import type { FormData } from '../../utils/validationSchema';
import styles from '../../styles/FormBase.module.css';
import { handleCategoryChange, handleSubCategoryChange, handleSubCategoryOptionsChange, handleSubSubCategoryOptionsChange } from '../../utils/formHandlers';
import { categorySubOptions, subSubCategoryOptions } from '../../data/options';
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
  watch,
  setValue,
  errors,
  textLength,
  getCharCounterClass,
  unitOptions,
  unitActivityOptions,
  activityOptions,
  categoryOptions
}: RightColumnProps) {
  const timeInputRef = useRef<HTMLInputElement>(null);
  const selectedDate = watch('date');
  const selectedTime = watch('time');
  const selectedCategory = watch('category');
  const selectedSubCategory = watch('categorySubOptions');
  const selectedSubCategoryOptions = watch('subCategoryOptions');

  const getTodayDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const getCurrentTime = () => {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  const preventKeyboardInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    e.preventDefault();
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedDate = watch('date');
    const selectedTimeValue = e.target.value;
    
    if (selectedDate === getTodayDate()) {
      const currentTime = getCurrentTime();
      if (selectedTimeValue > currentTime) {
        alert('לא ניתן לבחור שעה עתידית');
        setValue('time', '');
        return;
      }
    }
    
    setValue('time', selectedTimeValue);
    
    if (timeInputRef.current) {
      timeInputRef.current.blur();
    }
  };

  const getSubCategories = () => {
    if (
      selectedCategory &&
      categorySubOptions[selectedCategory as keyof typeof categorySubOptions]
    ) {
      return categorySubOptions[
        selectedCategory as keyof typeof categorySubOptions
      ].subCategories;
    }
    return [];
  };

  const getSubCategoryOptions = () => {
    if (
      selectedCategory &&
      selectedSubCategory &&
      categorySubOptions[selectedCategory as keyof typeof categorySubOptions]
    ) {
      const categoryData =
        categorySubOptions[selectedCategory as keyof typeof categorySubOptions];
      return (
        categoryData.subCategoryOptions[
          selectedSubCategory as keyof typeof categoryData.subCategoryOptions
        ] || []
      );
    }
    return [];
  };

  const getSubSubCategoryOptions = () => {
    if (
      selectedCategory === 'אש' &&
      selectedSubCategory === 'מאפיין אש' &&
      ['חשמל', 'מע\' רכב'].includes(selectedSubCategoryOptions as string)
    ) {
      return (
        subSubCategoryOptions[
          selectedSubCategoryOptions as keyof typeof subSubCategoryOptions
        ] || []
      );
    }
    return [];
  };

  return (
    <aside className={`${styles.column} ${styles.rightColumn}`} data-label="פרטים אישיים">
      <div className={styles.fieldBox}>
        <label className={styles.label}>יחידת משנה: </label>
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
        <label className={styles.label}>תאריך: </label>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <input
            type="date"
            className={`${styles.input} ${styles.dateInput} ${!selectedDate ? styles.hidePlaceholder : ''}`}
            max={getTodayDate()}
            onKeyDown={preventKeyboardInput}
            {...register('date')}
            style={{
              cursor: 'pointer',
              flex: 1
            }}
          />
          <input
            type="time"
            className={`${styles.input} ${styles.dateInput} ${!selectedTime ? styles.hidePlaceholder : ''}`}
            ref={timeInputRef}
            onChange={handleTimeChange}
            value={selectedTime ?? ''}
            style={{
              cursor: 'pointer',
              flex: 1
            }}
          />
        </div>
        {errors.date && <span className={styles.error}>{errors.date.message}</span>}
        {errors.time && <span className={styles.error}>{errors.time.message}</span>}
      </div>

      <div className={styles.fieldBox} 
      style={{ minHeight: '110px' }}
      >
        <label className={styles.label}>תיאור האירוע: </label>
        <textarea
          className={styles.textarea}
          style={{ minHeight: '90px', maxHeight: '110px' }}
          placeholder="תיאור מפורט של האירוע..."
          maxLength={800}
          {...register('text')}
        />
        <div className={`${styles.charCounter} ${styles[getCharCounterClass(textLength)]}`}>
          {textLength}/{MAX_TEXT_LENGTH}
        </div>
        {errors.text && <span className={styles.error}>{errors.text.message}</span>}
      </div>

      <div className={styles.fieldBox}>
        <label className={styles.label}>מאפיין פעילות היחידה: </label>
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
        <label className={styles.label}>מאפיין פעילות הפרט: </label>
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
        <label className={styles.label}>מאפיין תחומי: </label>
        <select 
          className={styles.select}
          {...register('category')}
          onChange={(e) => handleCategoryChange(setValue, e.target.value)}
        >
          <option value="">בחר מאפיין תחומי</option>
          {categoryOptions.map(option => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
        {errors.category && <span className={styles.error}>{errors.category.message}</span>}
      </div>

      <div className={styles.fieldBox}>
        <label className={styles.label}>קטגוריית תחומי: </label>
        <select
          className={styles.select}
          {...register('categorySubOptions')}
          onChange={(e) => handleSubCategoryChange(setValue, e.target.value)}
          disabled={!selectedCategory}
        >
          <option value="">בחר קטגוריית תחומי</option>
          {getSubCategories().map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        {errors.categorySubOptions && <span className={styles.error}>{errors.categorySubOptions.message}</span>}
      </div>

      <div className={styles.fieldBox}>
        <label className={styles.label}>תת קטגוריית תחומי: </label>
        <select
          className={styles.select}
          {...register('subCategoryOptions')}
          onChange={(e) => handleSubCategoryOptionsChange(setValue, e.target.value)}
          disabled={!selectedSubCategory}
        >
          <option value="">בחר תת קטגוריית תחומי</option>
          {getSubCategoryOptions().map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        {errors.subCategoryOptions && <span className={styles.error}>{errors.subCategoryOptions.message}</span>}
      </div>

      <div className={styles.fieldBox}>
        <label className={styles.label}>תת קטגוריה משנית: </label>
        <select
          className={styles.select}
          {...register('subSubCategoryOptions')}
          onChange={(e) => handleSubSubCategoryOptionsChange(setValue, e.target.value)}
          disabled={!selectedSubCategoryOptions || getSubSubCategoryOptions().length === 0}
        >
          <option value="">בחר תת קטגורייה משנית</option>
          {getSubSubCategoryOptions().map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        {errors.subSubCategoryOptions && <span className={styles.error}>{errors.subSubCategoryOptions.message}</span>}
      </div>
    </aside>
  );
}