import { formatApiError } from './apiHelpers';

export const handleError = (error, context = '') => {
  const formattedError = formatApiError(error);
  
  console.error(`${context ? `${context}: ` : ''}`, formattedError);
  
  // You can add additional error handling logic here
  // such as sending to error reporting service, showing notifications, etc.
  
  return formattedError;
};

export const isNetworkError = (error) => {
  return !error.response && error.request;
};

export const isAuthError = (error) => {
  return error.response?.status === 401 || error.response?.status === 403;
};

export const isServerError = (error) => {
  return error.response?.status >= 500;
};

export const isValidationError = (error) => {
  return error.response?.status === 422;
};

export const getErrorMessage = (error) => {
  if (isNetworkError(error)) {
    return 'Network error. Please check your connection and try again.';
  }
  
  if (isAuthError(error)) {
    return 'Authentication required. Please log in again.';
  }
  
  if (isServerError(error)) {
    return 'Server error. Please try again later.';
  }
  
  if (isValidationError(error)) {
    return error.response?.data?.message || 'Validation error. Please check your input.';
  }
  
  return error.message || 'An unexpected error occurred.';
};

