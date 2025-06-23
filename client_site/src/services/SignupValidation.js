export const ValidateForm = (formData) => {
  const errors = {};

  // First Name validation
  if (!formData.firstName.trim()) {
    errors.firstName = 'First name is required';
  } else if (formData.firstName.length < 2) {
    errors.firstName = 'First name must be at least 2 characters';
  }

  // Last Name validation
  if (!formData.lastName.trim()) {
    errors.lastName = 'Last name is required';
  } else if (formData.lastName.length < 2) {
    errors.lastName = 'Last name must be at least 2 characters';
  }

  // Gender validation
  if (!formData.gender) {
    errors.gender = 'Please select a gender';
  }

  // Email validation
  if (!formData.email) {
    errors.email = 'Email is required';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
    errors.email = 'Please enter a valid email address';
  }

  // Password validation
  if (!formData.password) {
    errors.password = 'Password is required';
  } else if (formData.password.length < 6) {
    errors.password = 'Password must be at least 6 characters';
  }

  // Confirm Password validation
  if (formData.password !== formData.confirmPassword) {
    errors.confirmPassword = 'Passwords do not match';
  }

  // City validation
  if (!formData.city.trim()) {
    errors.city = 'City is required';
  }

  // State validation
  if (!formData.state) {
    errors.state = 'Please select a state';
  }

  // Zip validation
  if (!formData.zip) {
    errors.zip = 'Zip code is required';
  } else if (!/^\d{5}(-\d{4})?$/.test(formData.zip)) {
    errors.zip = 'Please enter a valid zip code';
  }

  // Country validation
  if (!formData.country) {
    errors.country = 'Please select a country';
  }

  // Activities validation
  if (formData.activity.length === 0) {
    errors.activity = 'Please select at least one activity';
  }

  // Profile Image validation
  if (!formData.profileImage) {
    errors.profileImage = 'Please upload a profile image';
  }

  return errors;
};