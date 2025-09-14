import { UseFormRegister, FieldErrors, FieldArrayWithId } from 'react-hook-form';
import type { FormData } from '../../types/FormTypes';
import styles from '../../styles/Modal.module.css';

interface CasualtiesModalProps {
  fields: FieldArrayWithId<FormData, "casualties", "id">[];
  register: UseFormRegister<FormData>;
  errors: FieldErrors<FormData>;
  remove: (index: number) => void;
  addCasualty: () => void;
  setShowCasualtiesModal: (value: boolean) => void;
  injurySeverityOptions: string[];
}

export default function CasualtiesModal({
  fields,
  register,
  errors,
  remove,
  addCasualty,
  setShowCasualtiesModal,
  injurySeverityOptions,
}: CasualtiesModalProps) {
  return (
    <div className={styles.modal}>
      <div className={styles.modalContent}>
        <h3 className={styles.modalHeader}>פרטי נפגעים</h3>
        
        {fields.length === 0 && (
          <div className={styles.emptyState}>
            לא הוגדרו נפגעים עדיין
            <br />
            <small>לחץ על "הוסף נפגע חדש" כדי להתחיל</small>
          </div>
        )}
        
        {fields.map((field, index) => (
          <div key={field.id} className={styles.casualtyItem}>
            <div className={styles.casualtyGrid}>
              <div className={styles.casualtyField}>
                <label className={styles.casualtyLabel}>
                  חומרת פציעה:
                </label>
                <select 
                  className={styles.select}
                  {...register(`casualties.${index}.severity` as const)}
                >
                  <option value="">בחר/י</option>
                  {injurySeverityOptions.map(option => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
                {errors.casualties?.[index]?.severity && (
                  <span className={styles.error}>
                    {errors.casualties[index]?.severity?.message}
                  </span>
                )}
              </div>
              
              <div className={styles.casualtyField}>
                <label className={styles.casualtyLabel}>
                  מספר נפגעים:
                </label>
                <input
                  type="number"
                  min="1"
                  max="100"
                  className={styles.input}
                  {...register(`casualties.${index}.count` as const, { valueAsNumber: true })}
                />
                {errors.casualties?.[index]?.count && (
                  <span className={styles.error}>
                    {errors.casualties[index]?.count?.message}
                  </span>
                )}
              </div>
              
              <button
                type="button"
                onClick={() => remove(index)}
                className={styles.removeButton}
                title="הסר נפגע זה"
              >
                הסר
              </button>
            </div>
          </div>
        ))}
        
        <div className={styles.modalButtons}>
          <button
            type="button"
            onClick={addCasualty}
            className={styles.addButton}
          >
            הוסף נפגע חדש
          </button>
          
          <button
            type="button"
            onClick={() => setShowCasualtiesModal(false)}
            className={styles.closeButton}
          >
            סגור וחזור
          </button>
        </div>
      </div>
    </div>
  );
}