import React from 'react';
import styles from './Select.module.css';

const Select = ({ 
  options = [],
  value = '',
  onChange,
  label = '',
  error = '',
  disabled = false,
  required = false,
  placeholder = 'Select an option',
  className = '',
  ...props 
}) => {
  const selectClasses = [
    styles.select,
    error ? styles.error : '',
    disabled ? styles.disabled : '',
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={styles.selectGroup}>
      {label && (
        <label className={styles.label}>
          {label}
          {required && <span className={styles.required}>*</span>}
        </label>
      )}
      <select
        className={selectClasses}
        value={value}
        onChange={onChange}
        disabled={disabled}
        required={required}
        {...props}
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <span className={styles.errorMessage}>{error}</span>}
    </div>
  );
};

export default Select;

