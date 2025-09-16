import { useForm, useFieldArray } from 'react-hook-form';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
      
      // Create event object with required fields for EventsPage
      const eventData = {
        id: Date.now().toString(), // Simple ID generation
        unitName: data.unitName,
        date: data.date,
        category: data.category,
        eventSeverity: data.eventSeverity,
        eventOutcome: data.eventOutcome,
        location: data.location,
        text: data.text,
        coordinates: data.coordinates,
        casualties: data.casualties,
        createdAt: new Date().toISOString(),
        status: 'בטיפול' as const
      };

      // Get existing events from localStorage
      const existingEvents = localStorage.getItem('safetyEvents');
      const events = existingEvents ? JSON.parse(existingEvents) : [];
      
      // Add new event
      events.push(eventData);
      
      // Save back to localStorage
      localStorage.setItem('safetyEvents', JSON.stringify(events));
      
      alert(`שלחת את הנתונים בהצלחה! האירוע נשמר במערכת.`);
    } catch (error) {
      alert('אירעה שגיאה בשליחת הטופס');
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
            eventOutcomeOptions={eventOutcomeOptions}
            damageSeverityOptions={damageSeverityOptions}
            eventOutcome={eventOutcome}
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