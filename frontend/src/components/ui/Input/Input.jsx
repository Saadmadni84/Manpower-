import React from 'react';
import styles from './Input.module.css';

const Input = ({ 
  type = 'text',
  placeholder = '',
  value = '',
  onChange,
  label = '',
  error = '',
  disabled = false,
  required = false,
  className = '',
  ...props 
}) => {
  const inputClasses = [
    styles.input,
    error ? styles.error : '',
    disabled ? styles.disabled : '',
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={styles.inputGroup}>
      {label && (
        <label className={styles.label}>
          {label}
          {required && <span className={styles.required}>*</span>}
        </label>
      )}
      <input
        type={type}
        className={inputClasses}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={disabled}
        required={required}
        {...props}
      />
      {error && <span className={styles.errorMessage}>{error}</span>}
    </div>
  );
};

export default Input;

