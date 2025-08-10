export const validateField = (value, validations) => {
  if (!validations || validations.length === 0) return null;
  
  for (const validation of validations) {
    switch (validation.type) {
      case 'required':
        if (value === null || value === undefined || value === '' || (Array.isArray(value) && value.length === 0)) {
          return validation.message || 'This field is required';
        }
        break;
        
      case 'minLength':
        if (value && value.length < validation.value) {
          return validation.message || `Minimum length is ${validation.value}`;
        }
        break;
        
      case 'maxLength':
        if (value && value.length > validation.value) {
          return validation.message || `Maximum length is ${validation.value}`;
        }
        break;
        
      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (value && !emailRegex.test(value)) {
          return validation.message || 'Invalid email format';
        }
        break;
        
      case 'password':
        const hasNumber = /\d/.test(value);
        const hasMinLength = value.length >= 8;
        if (value && (!hasNumber || !hasMinLength)) {
          return validation.message || 'Password must be at least 8 characters and contain a number';
        }
        break;
        
      default:
        break;
    }
  }
  
  return null;
};