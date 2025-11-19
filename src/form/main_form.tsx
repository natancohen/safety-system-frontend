import { useForm, useFieldArray } from 'react-hook-form';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import type { FormData } from '../utils/validation_schema';
import { formSchema } from '../utils/validation_schema';
import { createEvent } from '../utils/api';
import type { CreateEventDto } from '../utils/api';
import {
  unitOptions,
  unitActivityOptions,
  activityOptions,
  eventSeverityOptions,
  damageSeverityOptions,
  injurySeverityOptions,
  categoryOptions,
  categorySubOptions,
  subSubCategoryOptions,
  eventOutcomeOptions,
} from '../data/options';
import RightColumn from './right_column';
import MiddleColumn from './middle_column';
import LeftColumn from './left_column';
import FourthColumn from './fourth_column';
import CasualtiesModal from '../components/casualties_modal';
import  styles from '../styles/form_base.module.css';
import responsiveStyles from '../styles/responsive.module.css';
import { eventFactorsOptions } from '../data/options2';
import { eventResultOptions } from '../data/options3';
import HeaderNav from '@components/header_nav';

export default function Form() {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    control,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema) as any,
    defaultValues: {
      unitName: '',
      date: '',
      time: '',
      text: '',
      unitActivityOptions: '',
      activityOptions: '',
      categoryOptions: '',
      categorySubOptions: '',
      subCategoryOptions: '',
      subSubCategoryOptions: '',
      eventFactorsOptions: '',
      eventSeverity: '',
      eventResultOptions: '',
      eventOutcomeByCategory: '',
      damageType: '',
      location: '',
      locationDescription: '',
      weather: '',
      recommendations: '',
      costAmount: undefined,
      coordinates: { latitude: '', longitude: '' },
      casualties: [],
    },
  });

  const { fields, append, remove } = useFieldArray({ control, name: 'casualties' });
  const [showCasualtiesModal, setShowCasualtiesModal] = useState(false);

  const textValue = watch('text') || '';
  const textLength = textValue.length;
  const getCharCounterClass = (length: number) => {
    if (length > 750) return 'danger';
    if (length > 600) return 'warning';
    return 'normal';
  };

  const addCasualty = () => append({ severity: '', count: 1 });

  const onSubmit = async (data: FormData) => {
    try {
      const coords =
        data.coordinates?.latitude !== '' && data.coordinates?.longitude !== ''
          ? {
              latitude: Number(data.coordinates!.latitude),
              longitude: Number(data.coordinates!.longitude),
            }
          : undefined;

      const dto: CreateEventDto = {
        rightColumn: {
          unitName: data.unitName,
          date: data.date,
          time: data.time || undefined,
          text: data.text,
          unitActivityOptions: data.unitActivityOptions,
          activityOptions: data.activityOptions,
          categoryOptions: data.categoryOptions,
          categorySubOptions: data.categorySubOptions || undefined,
          subCategoryOptions: data.subCategoryOptions || undefined,
          subSubCategoryOptions: data.subSubCategoryOptions || undefined,
        },
        middleColumn: {
          eventFactorOptions: data.eventFactorsOptions || undefined,
          eventResultOptions: data.eventResultOptions,
          eventSeverity: data.eventSeverity,
          eventOutcomeByCategory: data.eventOutcomeByCategory,
          damageType: data.damageType || undefined,
        },
        fourthColumn: {
          recommendations: data.recommendations || undefined,
          costAmount: typeof data.costAmount === 'number' ? data.costAmount : undefined,
        },
        leftColumn: {
          location: data.location ?? '',
          locationDescription: data.locationDescription || undefined,
          weather: data.weather || undefined,
          coordinates: coords,
        },
      };

      const saved = await createEvent(dto);
      alert(`האירוע נשמר בהצלחה: ${saved.id}`);
      navigate('/events');
    } catch (error: any) {
      console.error('שגיאה בשליחת הטופס:', error);
      const msg = error?.response?.data?.message || error.message || 'אירעה שגיאה בלתי צפויה';
      alert(`אירעה שגיאה בשליחה: ${msg}`);
    }
  };

  return (
    <div className={styles.formWrapper}>
      <div className={styles.header}>
        <HeaderNav/>
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
            categorySubOptions={Object.keys(categorySubOptions)}
            subSubCategoryOptions={Object.keys(subSubCategoryOptions)}
          />

          <MiddleColumn
            register={register}
            watch={watch}
            setValue={setValue}
            errors={errors}
            eventSeverityOptions={eventSeverityOptions}
            eventResultOptionsData={eventResultOptions}
            damageSeverityOptions={damageSeverityOptions}
            eventOutcomeOptions={eventOutcomeOptions}
            eventFactorsOptions={eventFactorsOptions}
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

          <button type="submit" className={styles.submitButton} disabled={isSubmitting}>
            {isSubmitting ? 'שולח...' : 'שליחת נתונים'}
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

