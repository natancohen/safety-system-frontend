import { UseFormRegister, FieldErrors, UseFormWatch, UseFormSetValue } from 'react-hook-form';
import type { FormData } from '../utils/validation_schema';
import styles from '../styles/form_base.module.css';
import { handleCategoryChange, handleSubCategoryChange, handleSubCategoryOptionsChange,
   handleSubSubCategoryOptionsChange } from '../utils/form_handlers';
import { categorySubOptions, subSubCategoryOptions } from '../data/options';
import { useRef } from 'react';
import { MAX_TEXT_LENGTH } from '../utils/validation_messages';
import CompactSelect from '../components/compact_select'; 

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
  categorySubOptions?: string[];
  subSubCategoryOptions?: string[];
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
  const selectedCategory = watch('categoryOptions');
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
      ['חשמל', "מע' רכב"].includes(selectedSubCategoryOptions as string)
    ) {
      return (
        subSubCategoryOptions[
          selectedSubCategoryOptions as keyof typeof subSubCategoryOptions
        ] || []
      );
    }
    if (
      selectedCategory === "ירי דו''צ" &&
      selectedSubCategory === "מקרים חריגים" &&
      ["ירי דו''צ"].includes(selectedSubCategoryOptions as string)
    ) {
      return (
        subSubCategoryOptions[
          selectedSubCategoryOptions as keyof typeof subSubCategoryOptions
        ] || []
      );
    }
    return [];
  };

  const subCategories = getSubCategories();
  const subCategoryOptionsList = getSubCategoryOptions();
  const subSubCategoryOptionsList = getSubSubCategoryOptions();

  const showCategorySub = Boolean(selectedCategory) && subCategories.length > 0;
  const showSubCategoryOptions = Boolean(selectedSubCategory) && subCategoryOptionsList.length > 0;
  const showSubSubCategoryOptions = Boolean(selectedSubCategoryOptions) && subSubCategoryOptionsList.length > 0;

  return (
    <aside className={`${styles.column} ${styles.rightColumn}`} data-label="פרטים אישיים">
      <div className={styles.fieldBox}>
        <label className={styles.label}>יחידת משנה: </label>
        <CompactSelect
          value={watch('unitName')}
          onChange={(v) => setValue('unitName', v)}
          options={unitOptions}
          placeholder="בחר יחידת משנה"
        />
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
        <CompactSelect
          value={watch('unitActivityOptions')}
          onChange={(v) => setValue('unitActivityOptions', v)}
          options={unitActivityOptions}
          placeholder="בחר מאפיין פעילות יחידה"
        />
        {errors.unitActivityOptions && <span className={styles.error}>{errors.unitActivityOptions.message}</span>}
      </div>

      <div className={styles.fieldBox}>
        <label className={styles.label}>מאפיין פעילות הפרט: </label>
        <CompactSelect
          value={watch('activityOptions')}
          onChange={(v) => setValue('activityOptions', v)}
          options={activityOptions}
          placeholder="בחר מאפיין פעילות פרט"
        />
        {errors.activityOptions && <span className={styles.error}>{errors.activityOptions.message}</span>}
      </div>

      <div className={styles.fieldBox}>
        <label className={styles.label}>מאפיין תחומי: </label>
        <CompactSelect
          value={watch('categoryOptions')}
          onChange={(v) => { setValue('categoryOptions', v); handleCategoryChange(setValue, v); }}
          options={categoryOptions}
          placeholder="בחר מאפיין תחומי"
        />
        {errors.categoryOptions && <span className={styles.error}>{errors.categoryOptions.message}</span>}
      </div>

      {showCategorySub && (
        <div className={styles.fieldBox}>
          <label className={styles.label}>קטגוריית תחומי: </label>
          <CompactSelect
            value={watch('categorySubOptions')}
            onChange={(v) => { setValue('categorySubOptions', v); handleSubCategoryChange(setValue, v); }}
            options={subCategories}
            placeholder="בחר קטגוריית תחומי"
          />
          {errors.categorySubOptions && <span className={styles.error}>{errors.categorySubOptions.message}</span>}
        </div>
      )}

      {showSubCategoryOptions && (
        <div className={styles.fieldBox}>
          <label className={styles.label}>תת קטגוריית תחומי: </label>
          <CompactSelect
            value={watch('subCategoryOptions')}
            onChange={(v) => { setValue('subCategoryOptions', v); handleSubCategoryOptionsChange(setValue, v); }}
            options={subCategoryOptionsList}
            placeholder="בחר תת קטגוריית תחומי"
          />
          {errors.subCategoryOptions && <span className={styles.error}>{errors.subCategoryOptions.message}</span>}
        </div>
      )}

      {showSubSubCategoryOptions && (
        <div className={styles.fieldBox}>
          <label className={styles.label}>תת קטגוריה משנית: </label>
          <CompactSelect
            value={watch('subSubCategoryOptions')}
            onChange={(v) => { setValue('subSubCategoryOptions', v); handleSubSubCategoryOptionsChange(setValue, v); }}
            options={subSubCategoryOptionsList}
            placeholder="בחר תת קטגורייה משנית"
          />
          {errors.subSubCategoryOptions && <span className={styles.error}>{errors.subSubCategoryOptions.message}</span>}
        </div>
      )}
    </aside>
  );
}
