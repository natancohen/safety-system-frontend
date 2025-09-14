import { UseFormSetValue } from 'react-hook-form';
import { FormData } from '../types/FormTypes';

export const handleCategoryChange = (setValue: UseFormSetValue<FormData>, category: string) => {
  setValue('category', category);
  setValue('categorySubOptions', '');
  setValue('subCategoryOptions', '');
  setValue('subSubCategoryOptions', '');
};

export const handleSubCategoryChange = (setValue: UseFormSetValue<FormData>, subCategory: string) => {
  setValue('categorySubOptions', subCategory);
  setValue('subCategoryOptions', '');
  setValue('subSubCategoryOptions', '');
};

export const handleSubCategoryOptionsChange = (setValue: UseFormSetValue<FormData>, option: string) => {
  setValue('subCategoryOptions', option);
  setValue('subSubCategoryOptions', '');
};

export const handleSubSubCategoryOptionsChange = (setValue: UseFormSetValue<FormData>, option: string) => {
  setValue('subSubCategoryOptions', option);
};