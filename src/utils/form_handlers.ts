import { UseFormSetValue } from 'react-hook-form';
import type { FormData } from './validation_schema';

export const handleCategoryChange = (
  setValue: UseFormSetValue<FormData>,
  value: string
) => {
  setValue('categoryOptions', value);
  setValue('categorySubOptions', ''); 
  setValue('subCategoryOptions', ''); 
  setValue('eventFactorsOptions', ''); 
  setValue('eventOutcomeByCategory', ''); 
};

export const handleSubCategoryChange = (
  setValue: UseFormSetValue<FormData>,
  value: string
) => {
  setValue('categorySubOptions', value);
  setValue('subCategoryOptions', '');
  setValue('subSubCategoryOptions', '');
  setValue('eventFactorsOptions', ''); 
};

export const handleSubCategoryOptionsChange = (
  setValue: UseFormSetValue<FormData>,
  value: string
) => {
  setValue('subCategoryOptions', value);
  setValue('subSubCategoryOptions', '');
  setValue('eventFactorsOptions', ''); 
};

export const handleSubSubCategoryOptionsChange = (
  setValue: UseFormSetValue<FormData>,
  value: string
) => {
  setValue('subSubCategoryOptions', value);
};