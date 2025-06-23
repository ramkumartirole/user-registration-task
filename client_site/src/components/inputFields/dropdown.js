import React, { useState } from 'react';

export default function Dropdown({
  label = "Select an option",
  options = [],
  selectedValue = "",
  onChange ,

}) {


  return (
    <div className={`mb-4 `}>
      {label && <label className="block mb-2">{label}</label>}

      <select
        value={selectedValue}
        onChange={onChange}
        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value=""> {selectedValue ? selectedValue : "-- Select --"}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}