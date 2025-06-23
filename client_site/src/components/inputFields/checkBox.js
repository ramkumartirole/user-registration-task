import React from 'react';

export default function CheckboxField({
  fieldName,  // The name in your formData (e.g., "activity")
  label = "",
  options = [],
  selectedValues = [],
  onChange = () => {}
}) {
  const handleCheckboxChange = (value) => {
    const newSelectedValues = selectedValues.includes(value)
      ? selectedValues.filter(item => item !== value)
      : [...selectedValues, value];
    onChange(fieldName, newSelectedValues);
  };

  return (
    <div >
      {label && <div className="block mb-2 font-medium">{label}</div>}

      <div>
        {options.map((option) => (
          <label key={option.value} className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={selectedValues.includes(option.value)}
              onChange={() => handleCheckboxChange(option.value)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <span>{option.label}</span>
          </label>
        ))}
      </div>
    </div>
  );
}