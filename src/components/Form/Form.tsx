import { useForm, useFieldArray } from 'react-hook-form';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import type { FormData } from '../../utils/validationSchema';
import { formSchema } from '../../utils/validationSchema';
import { createEvent, CreateEventDto } from '../../utils/api'; 
import {
  unitOptions,
  unitActivityOptions,
  activityOptions,
  categoryOptions,
  eventSeverityOptions,
  damageSeverityOptions,
  injurySeverityOptions,
} from '../../data/options';
import RightColumn from './RightColumn';
import MiddleColumn from './MiddleColumn';
import LeftColumn from './LeftColumn';
import FourthColumn from './FourthColumn';
import CasualtiesModal from './CasualtiesModal';
import styles from '../../styles/FormBase.module.css';
import responsiveStyles from '../../styles/Responsive.module.css';

export default function Form() {
  const navigate = useNavigate();
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
      time: '',
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
      subCategoryOptions: '',
      eventFactor: ''
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "casualties"
  });

  const [showCasualtiesModal, setShowCasualtiesModal] = useState(false);

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
      const eventData = {
        unitName: data.unitName,
        date: data.date,
        time: data.time,
        category: data.category,
        eventSeverity: data.eventSeverity,
        eventOutcome: data.eventOutcome,
        damageType: data.damageType,
        location: data.location,
        locationDescription: data.locationDescription,
        weather: data.weather,
        text: data.text,
        unitActivityType: data.unitActivityType,
        activityType: data.activityType,
        coordinates: data.coordinates,
        casualties: data.casualties,
        subSubCategoryOptions: data.subSubCategoryOptions,
        recommendations: data.recommendations,
        costAmount: data.costAmount,
        categorySubOptions: data.categorySubOptions,
        subCategoryOptions: data.subCategoryOptions,
        eventFactor: data.eventFactor,
      };

      const savedEvent = await createEvent(eventData as CreateEventDto);
      
      console.log('Event saved successfully:', savedEvent);
      alert(`האירוע נשמר בהצלחה במסד הנתונים! מספר אירוע: ${savedEvent.id}`);
      navigate('/events');
    } catch (error: any) {
      console.error('שגיאה בשליחת הטופס:', error);
      const errorMessage = error.response?.data?.message || error.message || 'אירעה שגיאה לא ידועה';
      alert(`אירעה שגיאה בשליחת הטופס: ${errorMessage}`);
    }
  };

  return (
    <div className={styles.formWrapper}>
      <div className={styles.header}>
        <h1 className={styles.title}>דיווח בטיחות</h1>
        <button
          type="button"
          onClick={() => navigate('/')}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: 'var(--primary-color)',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '0.9rem',
            fontWeight: '500',
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--primary-hover)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--primary-color)';
          }}
        >
          ← חזור לדף הבית
        </button>
      </div>
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
            damageSeverityOptions={damageSeverityOptions}
            setShowCasualtiesModal={setShowCasualtiesModal}
            fieldsLength={fields.length}
            getCharCounterClass={getCharCounterClass}
          />
          <FourthColumn
            register={register}
            watch={watch}
            errors={errors}
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
    </div>
  );
}