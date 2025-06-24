export const ValidateForm = (formData) => {
  const errors = {};


  if (!formData.firstName.trim()) {
    errors.firstName = 'First name is required';
  } else if (formData.firstName.length < 2) {
    errors.firstName = 'First name must be at least 2 characters';
  }


  if (!formData.lastName.trim()) {
    errors.lastName = 'Last name is required';
  } else if (formData.lastName.length < 2) {
    errors.lastName = 'Last name must be at least 2 characters';
  }


  if (!formData.gender) {
    errors.gender = 'Please select a gender';
  }


  if (!formData.email) {
    errors.email = 'Email is required';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
    errors.email = 'Please enter a valid email address';
  }


  if (!formData.password) {
    errors.password = 'Password is required';
  } else if (formData.password.length < 6) {
    errors.password = 'Password must be at least 6 characters';
  }


  if (formData.password !== formData.confirmPassword) {
    errors.confirmPassword = 'Passwords do not match';
  }


  if (!formData.city.trim()) {
    errors.city = 'City is required';
  }


  if (!formData.state) {
    errors.state = 'Please select a state';
  }


  if (!formData.zip) {
    errors.zip = 'Zip code is required';
  } else if (!/^\d{5}(-\d{4})?$/.test(formData.zip)) {
    errors.zip = 'Please enter a valid zip code';
  }


  if (!formData.country) {
    errors.country = 'Please select a country';
  }


  if (formData.activity.length === 0) {
    errors.activity = 'Please select at least one activity';
  }

 
  if (!formData.profileImage) {
    errors.profileImage = 'Please upload a profile image';
  }

  return errors;
};