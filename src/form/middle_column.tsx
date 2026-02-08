import { UseFormRegister, FieldErrors, UseFormWatch, UseFormSetValue } from 'react-hook-form';
import { useEffect } from 'react';
import type { FormData } from '../utils/validation_schema';
import styles from '../styles/form_base.module.css';
import CompactSelect from '../components/compact_select';

interface MiddleColumnProps {
  register: UseFormRegister<FormData>;
  watch: UseFormWatch<FormData>;
  setValue: UseFormSetValue<FormData>;
  errors: FieldErrors<FormData>;
  eventSeverityOptions: string[];
  damageSeverityOptions: string[];
  eventOutcomeOptions: string[];
  eventResultOptionsData: any;
  eventFactorsOptions: Record<string, { factors: string[] }>;
  setShowCasualtiesModal: (show: boolean) => void;
  fieldsLength: number;
  getCharCounterClass: (length: number) => string;
}

export default function MiddleColumn({
  watch,
  setValue,
  errors,
  eventSeverityOptions,
  eventResultOptionsData,
  eventFactorsOptions,
  damageSeverityOptions,
  eventOutcomeOptions,
  setShowCasualtiesModal,
  fieldsLength,
}: MiddleColumnProps) {
  const selectedCategoryOptions = watch('categoryOptions');
  const selectedCategorySubOptions = watch('categorySubOptions');
  const selectedSubCategoryOptions = watch('subCategoryOptions');
  const selectedSubSubCategoryOptions = watch('subSubCategoryOptions');
  const selectedOutcome = watch('eventOutcomeByCategory');

  // Keep damageType consistent with selectedOutcome
  useEffect(() => {
    const hasDamage = (selectedOutcome ?? '').replace(/\\s+/g, ' ').trim().endsWith('יש נזק');
    const hasCasualties = (selectedOutcome ?? '').replace(/\\s+/g, ' ').trim().startsWith('יש נפגעים');
    if (hasDamage) {
      const current = watch('damageType');
      if (current && !damageSeverityOptions.includes(current)) {
        setValue('damageType', '');
      }
    } else {
      setValue('damageType', '');
    }
    if (!hasCasualties) {
      // Clear casualties list if outcome indicates no casualties
      setValue('casualties' as any, [] as any);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedOutcome]);

  const getFactorsForCategory = (): string[] => {
    try {
      const keys = [selectedSubCategoryOptions, selectedCategorySubOptions, selectedCategoryOptions].filter(Boolean) as string[];
      for (const k of keys) {
        const entry = eventFactorsOptions[k];
        if (entry?.factors?.length) return entry.factors;
      }
      return [];
    } catch (error) {
      console.error('Error in getFactorsForCategory:', error);
      return [];
    }
  };

  const factors = getFactorsForCategory();
  const isEventFactorEnabled = factors.length > 0;

  // Outcome exact matching
  const outcome = (selectedOutcome ?? '').replace(/\s+/g, ' ').trim();
  const hasDamageExact = outcome.endsWith('יש נזק');
  const hasCasualtiesExact = outcome.startsWith('יש נפגעים');
  const filteredDamageSeverityOptionsExact = hasDamageExact ? damageSeverityOptions : ['ללא נזק'];

  const getEventResultOptionsList = (): string[] => {
    const data: any = eventResultOptionsData as any;
    if (!data) return [];
    const c1 = selectedCategoryOptions;
    const c2 = selectedCategorySubOptions;
    const c3 = selectedSubCategoryOptions;
    const c4 = selectedSubSubCategoryOptions;

    const flattenObjectArrays = (obj: any): string[] =>
      Object.values(obj ?? {})
        .flatMap((v: any) => Array.isArray(v) ? v : (typeof v === 'object' ? Object.values(v).flatMap((x: any) => Array.isArray(x) ? x : []) : []));

    const node = (data as any)[c1 as any];
    if (!c1 || !node) return [];
    if (Array.isArray(node)) return node as string[];
    if (typeof node === 'object') {
      if (c2 && (node as any)[c2 as any]) {
        const n2 = (node as any)[c2 as any];
        if (Array.isArray(n2)) return n2 as string[];
        if (typeof n2 === 'object') {
          if (c3 && (n2 as any)[c3 as any]) {
            const n3 = (n2 as any)[c3 as any];
            if (Array.isArray(n3)) return n3 as string[];
            if (typeof n3 === 'object' && c4 && (n3 as any)[c4 as any]) {
              return Array.isArray((n3 as any)[c4 as any]) ? (n3 as any)[c4 as any] as string[] : [];
            }
          }
          return flattenObjectArrays(n2);
        }
      }
      return flattenObjectArrays(node);
    }
    return [];
  };

  const eventResultOptions = getEventResultOptionsList();
    const hasCasualties = hasCasualtiesExact;

  return (
    <aside className={`${styles.column} ${styles.middleColumn}`} data-label="עמודת אמצע">
      <div className={styles.fieldBox}>
        <label className={styles.label}>גורמי האירוע:</label>
        <CompactSelect
          value={watch('eventFactorsOptions')}
          onChange={(v) => setValue('eventFactorsOptions', v)}
          options={factors}
          placeholder="בחר גורמי אירוע"
          disabled={!isEventFactorEnabled}
        />
        {errors.eventFactorsOptions && (
          <span className={styles.error}>{errors.eventFactorsOptions.message}</span>
        )}
      </div>

      <div className={styles.fieldBox}>
        <label className={styles.label}>תוצאה לפי קטגוריה :</label>
        <CompactSelect
          value={watch('eventResultOptions')}
          onChange={(v) => setValue('eventResultOptions', v)}
          options={eventResultOptions}
          placeholder="בחר תוצאה לפי קטגוריה"
        />
        {errors.eventResultOptions && (
          <span className={styles.error}>{errors.eventResultOptions.message}</span>
        )}
      </div>

      <div className={styles.fieldBox}>
        <label className={styles.label}>חומרת האירוע:</label>
        <CompactSelect
          value={watch('eventSeverity')}
          onChange={(v) => setValue('eventSeverity', v)}
          options={eventSeverityOptions}
          placeholder="בחר חומרה"
        />
        {errors.eventSeverity && (
          <span className={styles.error}>{errors.eventSeverity.message}</span>
        )}
      </div>

      <div className={styles.fieldBox}>
        <label className={styles.label}>תוצאות האירוע  :</label>
        <CompactSelect
          value={watch('eventOutcomeByCategory')}
          onChange={(v) => setValue('eventOutcomeByCategory', v)}
          options={eventOutcomeOptions}
          placeholder="בחר תוצאה "
        />
        {errors.eventOutcomeByCategory && (
          <span className={styles.error}>{errors.eventOutcomeByCategory.message}</span>
        )}
      </div>

      <div className={styles.fieldBox}>
        <label className={styles.label}>סוג הנזק:</label>
        <CompactSelect
          value={watch('damageType')}
          onChange={(v) => setValue('damageType', v)}
          options={filteredDamageSeverityOptionsExact}
          placeholder="בחר סוג נזק"
          disabled={!hasDamageExact}
        />
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
            padding: '0.5rem',
          }}
          onClick={() => setShowCasualtiesModal(true)}
          disabled={!hasCasualties}
        >
          ניהול נפגעים
        </button>
        <p style={{ fontSize: '0.7rem', color: '#666', margin: '0.3rem 0 0 0' }}>
          זמין רק כשנבחרה תוצאה עם נפגעים
        </p>
      </div>
    </aside>
  );
}








