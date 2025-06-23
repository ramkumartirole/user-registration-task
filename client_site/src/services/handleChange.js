export const handleChange = (fieldName, value, setFormData) => {
        setFormData(prev => ({
            ...prev,
            [fieldName]: value
        }));
    };