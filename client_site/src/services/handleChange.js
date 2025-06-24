export const handleChange = (fieldName, value, setFormData, inputType = 'text') => {
  setFormData(prev => {

    if (fieldName === 'activity' && inputType === 'checkbox') {
      const currentActivities = prev.activity || [];
      return {
        ...prev,
        activity: currentActivities.includes(value)
          ? currentActivities.filter(item => item !== value)
          : [...currentActivities, value]
      };
    }


    return {
      ...prev,
      [fieldName]: value
    };
  });
};