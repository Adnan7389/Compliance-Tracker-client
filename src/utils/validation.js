
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

export const validateTask = (task) => {
  const errors = {};

  if (!task.title.trim()) {
    errors.title = 'Title is required';
  }

  if (!task.category) {
    errors.category = 'Category is required';
  }

  if (!task.due_date) {
    errors.due_date = 'Due date is required';
  } else {
    const today = new Date();
    const dueDate = new Date(task.due_date);
    today.setHours(0, 0, 0, 0);
    dueDate.setHours(0, 0, 0, 0);
    if (dueDate < today) {
      errors.due_date = 'Due date cannot be in the past';
    }
  }

  if (!task.assigned_to) {
    errors.assigned_to = 'Please assign the task to a staff member';
  }

  return errors;
};
