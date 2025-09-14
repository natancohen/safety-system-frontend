import { useForm, useFieldArray } from 'react-hook-form';
import { useEffect, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { formSchema, FormData } from '../../utils/validationSchema';
import {
  unitOptions,
  unitActivityOptions,
  activityOptions,
  categoryOptions,
  eventSeverityOptions,
  eventOutcomeOptions,
  damageSeverityOptions,
  injurySeverityOptions,
} from '../../data/options';
import RightColumn from './RightColumn';
import MiddleColumn from './MiddleColumn';
import LeftColumn from './LeftColumn';
import CasualtiesModal from './CasualtiesModal';
import styles from '../../styles/FormBase.module.css';
import responsiveStyles from '../../styles/Responsive.module.css';

export default function Form() {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    control,
    formState: { errors, isSubmitting }
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      unitName: '',
      date: '',
      text: '',
      unitActivityType: '',
      activityType: '',
      category: '',
      eventSeverity: '',
      eventOutcome: '',
      damageType: '',
      location: '',
      locationDescription: '',
      weather: '',
      coordinates: {
        latitude: '',
        longitude: ''
      },
      casualties: [],
      subSubCategoryOptions: '',
      recommendations: '',
      costAmount: undefined,
      categorySubOptions: '',
      subCategoryOptions: ''
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "casualties"
  });

  const [showCasualtiesModal, setShowCasualtiesModal] = useState(false);
  const eventOutcome = watch('eventOutcome');

  const textValue = watch('text') || '';
  const textLength = textValue.length;
  const getCharCounterClass = (length: number) => {
    if (length > 750) return 'danger';
    if (length > 600) return 'warning';
    return 'normal';
  };

  const addCasualty = () => {
    append({ severity: '', count: 1 });
  };


  const onSubmit = async (data: FormData) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      alert(`שלחת את הנתונים בהצלחה:\n${JSON.stringify(data, null, 2)}`);
    } catch (error) {
      alert('אירעה שגיאה בשליחת הטופס');
    }
  };

  return (
    <main className={`${styles.formWrapper} ${responsiveStyles.formWrapper}`}>
      <header className={styles.header}>
        <h1 className={styles.title}>הוספת אירוע</h1>
      </header>
      <div className={styles.borderOfForm}>
        <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
          <section className={`${styles.formGrid} ${responsiveStyles.formGrid}`}>
            <RightColumn
              register={register}
              watch={watch}
              setValue={setValue}
              errors={errors}
              textLength={textLength}
              getCharCounterClass={getCharCounterClass}
              unitOptions={unitOptions}
              unitActivityOptions={unitActivityOptions}
              activityOptions={activityOptions}
              categoryOptions={categoryOptions}
            />
            <MiddleColumn
              register={register}
              watch={watch}
              setValue={setValue}
              errors={errors}
              eventSeverityOptions={eventSeverityOptions}
              eventOutcomeOptions={eventOutcomeOptions}
              damageSeverityOptions={damageSeverityOptions}
              eventOutcome={eventOutcome}
              setShowCasualtiesModal={setShowCasualtiesModal}
              fieldsLength={fields.length}
              getCharCounterClass={getCharCounterClass}
            />
            <LeftColumn
              register={register}
              watch={watch}
              setValue={setValue}
              errors={errors}
              getCharCounterClass={getCharCounterClass}
            />
            <button 
              type="submit" 
              className={styles.submitButton}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'שולח...' : 'שלח נתונים'}
            </button>
          </section>
        </form>  
      </div>
      {showCasualtiesModal && (
        <CasualtiesModal
          fields={fields}
          register={register}
          errors={errors}
          remove={remove}
          addCasualty={addCasualty}
          setShowCasualtiesModal={setShowCasualtiesModal}
          injurySeverityOptions={injurySeverityOptions}
        />
      )}
    </main>
  );
 }

 