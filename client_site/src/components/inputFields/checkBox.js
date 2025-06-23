import React from 'react';

export default function CheckboxField({
  fieldName,
  label = "",
  options = [],
  selectedValues = [],
  onChange = () => {},
  setFormData
}) {
  const handleCheckboxChange = (value) => {
    const newSelectedValues = selectedValues.includes(value)
      ? selectedValues.filter(item => item !== value)
      : [...selectedValues, value];
    onChange(fieldName, newSelectedValues, setFormData);
  };

  return (
    <div className="mb-4">
      {label && <label className="block text-sm text-left text-gray-700 mb-2">{label}</label>}

      <div className="space-y-2">
        {options.map((option) => (
          <label key={option.value} className="flex items-center space-x-3 cursor-pointer group">
            <div className="flex items-center h-5">
              <input
                type="checkbox"
                checked={selectedValues.includes(option.value)}
                onChange={() => handleCheckboxChange(option.value)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded transition"
              />
            </div>
            <span className="text-gray-700 group-hover:text-blue-600 transition">{option.label}</span>
          </label>
        ))}
      </div>
    </div>
  );
}