import type { FormData } from '@/shared/types';

export const useFormValidation = () => {
  const validateForm = (formData: FormData): boolean => {
    const requiredFields = [
      'amount',
      'source',
      'selectedDate',
    ];

    const basicValidation = requiredFields.every(field => {
      const value = formData[field as keyof FormData];
      return value !== null && value !== undefined && value !== '';
    });

    if (!basicValidation) {
      return false; 
    }

    // Purpose is required only for 'məxaric'
    if (formData.transactionType === 'məxaric') {
      if (!formData.purpose) return false;
    }

    // Köçürmə üçün həm mənbə həm mənbəyə tələb olunur
    if (formData.transactionType === 'kocurme') {
      if (!formData.destination) return false;
    }

    if (formData.currency && formData.currency.fullName !== "AZN") {
      if (!formData.rate) {
        return false; 
      }
    }

    return true;
  };

  const getValidationErrors = (formData: FormData): string[] => {
    const errors: string[] = [];
    
    if (!formData.selectedDate) errors.push('Tarix seçilməlidir');
    if (!formData.amount) errors.push('Məbləğ doldurulmalıdır');
    if (formData.transactionType === 'məxaric' && !formData.purpose) errors.push('Təyinat doldurulmalıdır');
    if (!formData.source) errors.push('Mənbə seçilməlidir');
    if (formData.transactionType === 'kocurme' && !formData.destination) errors.push('Mənbəyə seçilməlidir');
    if (formData.currency && formData.currency.fullName !== "AZN") {
      if (!formData.rate) {
        errors.push('Məzənnə doldurulmalıdır (valyuta AZN olmadıqda)');
      }
    }
    return errors;
  };

  return {
    validateForm,
    getValidationErrors,
  };
};