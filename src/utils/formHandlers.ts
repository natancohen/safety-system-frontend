import { UseFormSetValue } from 'react-hook-form';
import type { FormData } from './validationSchema';

export const handleCategoryChange = (
  setValue: UseFormSetValue<FormData>,
  value: string
) => {
  setValue('category', value);
  setValue('categorySubOptions', ''); 
  setValue('subCategoryOptions', ''); 
  setValue('eventFactor', ''); 
  setValue('eventOutcome', ''); 
};

export const handleSubCategoryChange = (
  setValue: UseFormSetValue<FormData>,
  value: string
) => {
  setValue('categorySubOptions', value);
  setValue('subCategoryOptions', '');
  setValue('subSubCategoryOptions', '');
  setValue('eventFactor', ''); 
};

export const handleSubCategoryOptionsChange = (
  setValue: UseFormSetValue<FormData>,
  value: string
) => {
  setValue('subCategoryOptions', value);
  setValue('subSubCategoryOptions', '');
  setValue('eventFactor', ''); 
};

export const handleSubSubCategoryOptionsChange = (
  setValue: UseFormSetValue<FormData>,
  value: string
) => {
  setValue('subSubCategoryOptions', value);
};