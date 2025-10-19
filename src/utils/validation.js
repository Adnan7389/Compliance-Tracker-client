
export const validateEmail = (email) => {
  if (!email) {
    return 'Email is required';
  }
  if (!/\S+@\S+\.\S+/.test(email)) {
    return 'Email is invalid';
  }
  return null;
};

export const validatePassword = (password) => {
  if (!password) {
    return 'Password is required';
  }
  const errors = [];
  if (password.length < 6) {
    errors.push("be at least 6 characters long");
  }
  if (!/[a-z]/.test(password)) {
    errors.push("contain at least one lowercase letter");
  }
  if (!/[A-Z]/.test(password)) {
    errors.push("contain at least one uppercase letter");
  }
  if (!/[0-9]/.test(password)) {
    errors.push("contain at least one number");
  }
  if (errors.length > 0) {
    return `Password must ${errors.join(', ')}`;
  }
  return null;
};

export const validateRequired = (value, fieldName) => {
  if (!value) {
    return `${fieldName} is required`;
  }
  return null;
};
