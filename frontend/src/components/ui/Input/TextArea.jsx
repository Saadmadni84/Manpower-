import React from 'react';
import styles from './Input.module.css';

const TextArea = ({ 
  placeholder = '',
  value = '',
  onChange,
  label = '',
  error = '',
  disabled = false,
  required = false,
  rows = 4,
  className = '',
  ...props 
}) => {
  const textareaClasses = [
    styles.textarea,
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
      <textarea
        className={textareaClasses}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={disabled}
        required={required}
        rows={rows}
        {...props}
      />
      {error && <span className={styles.errorMessage}>{error}</span>}
    </div>
  );
};

export default TextArea;

