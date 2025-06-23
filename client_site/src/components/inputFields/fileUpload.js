import React, { useState } from 'react';

export default function FileUpload({
  label = "Upload Image",
  name,
  onChange,
  className = "",
  preview = true
}) {
  const [previewUrl, setPreviewUrl] = useState("");

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result);
    };
    reader.readAsDataURL(file);

    // Call parent onChange
    onChange(name, file);
  };

  return (
    <div className={`mb-4 ${className}`}>
      {label && <label className="block mb-2 font-medium">{label}</label>}

      <div className="flex items-center space-x-4">
        <label className="cursor-pointer">
          <div className="px-4 py-2 border border-gray-300 rounded-md bg-white hover:bg-gray-50">
            Choose File
          </div>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
          />
        </label>

        {preview && previewUrl && (
          <div className="w-16 h-16 border rounded-md overflow-hidden">
            <img
              src={previewUrl}
              alt="Preview"
              className="w-full h-full object-cover"
            />
          </div>
        )}
      </div>
    </div>
  );
}