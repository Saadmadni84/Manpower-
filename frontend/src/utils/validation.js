export const validationRules = {
  required: (value) => {
    if (!value || (typeof value === 'string' && value.trim() === '')) {
      return 'This field is required';
    }
    return null;
  },

  email: (value) => {
    if (!value) return null;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      return 'Please enter a valid email address';
    }
    return null;
  },

  phone: (value) => {
    if (!value) return null;
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    const cleanPhone = value.replace(/[\s\-\(\)]/g, '');
    if (!phoneRegex.test(cleanPhone)) {
      return 'Please enter a valid phone number';
    }
    return null;
  },

  minLength: (min) => (value) => {
    if (!value) return null;
    if (value.length < min) {
      return `Must be at least ${min} characters long`;
    }
    return null;
  },

  maxLength: (max) => (value) => {
    if (!value) return null;
    if (value.length > max) {
      return `Must be no more than ${max} characters long`;
    }
    return null;
  },

  min: (min) => (value) => {
    if (!value) return null;
    const num = Number(value);
    if (isNaN(num) || num < min) {
      return `Must be at least ${min}`;
    }
    return null;
  },

  max: (max) => (value) => {
    if (!value) return null;
    const num = Number(value);
    if (isNaN(num) || num > max) {
      return `Must be no more than ${max}`;
    }
    return null;
  },

  pattern: (pattern, message) => (value) => {
    if (!value) return null;
    if (!pattern.test(value)) {
      return message || 'Invalid format';
    }
    return null;
  },

  url: (value) => {
    if (!value) return null;
    try {
      new URL(value);
      return null;
    } catch {
      return 'Please enter a valid URL';
    }
  },

  fileSize: (maxSize) => (file) => {
    if (!file) return null;
    if (file.size > maxSize) {
      return `File size must be less than ${Math.round(maxSize / 1024 / 1024)}MB`;
    }
    return null;
  },

  fileType: (allowedTypes) => (file) => {
    if (!file) return null;
    if (!allowedTypes.includes(file.type)) {
      return `File type must be one of: ${allowedTypes.join(', ')}`;
    }
    return null;
  },

  confirmPassword: (password) => (confirmPassword) => {
    if (confirmPassword !== password) {
      return 'Passwords do not match';
    }
    return null;
  }
};

export const validateField = (value, rules) => {
  for (const rule of rules) {
    const error = rule(value);
    if (error) return error;
  }
  return null;
};

export const validateForm = (formData, validationSchema) => {
  const errors = {};
  
  Object.keys(validationSchema).forEach(field => {
    const value = formData[field];
    const rules = validationSchema[field];
    const error = validateField(value, rules);
    if (error) {
      errors[field] = error;
    }
  });
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

export const createFormSchema = (fields) => {
  const schema = {};
  
  fields.forEach(field => {
    const rules = [];
    
    if (field.required) {
      rules.push(validationRules.required);
    }
    
    if (field.type === 'email') {
      rules.push(validationRules.email);
    }
    
    if (field.type === 'phone') {
      rules.push(validationRules.phone);
    }
    
    if (field.type === 'url') {
      rules.push(validationRules.url);
    }
    
    if (field.minLength) {
      rules.push(validationRules.minLength(field.minLength));
    }
    
    if (field.maxLength) {
      rules.push(validationRules.maxLength(field.maxLength));
    }
    
    if (field.min !== undefined) {
      rules.push(validationRules.min(field.min));
    }
    
    if (field.max !== undefined) {
      rules.push(validationRules.max(field.max));
    }
    
    if (field.pattern) {
      rules.push(validationRules.pattern(field.pattern, field.patternMessage));
    }
    
    schema[field.name] = rules;
  });
  
  return schema;
};

