import React from 'react';

export default function Dropdown({
  label = "Select an option",
  options = [],
  selectedValue = "",
  onChange,
}) {
  return (
    <div className="mb-4">
      {label && <label className="block text-sm text-left text-gray-700 mb-2">{label}</label>}

      <select
        value={selectedValue}
        onChange={onChange}
        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 transition"
      >
        <option value="">{selectedValue ? selectedValue : "-- Select --"}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}