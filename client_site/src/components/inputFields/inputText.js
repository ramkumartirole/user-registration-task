const InputText = ({
  type,
  placeholder,
  onChange,
  value,
  name,
  checked,
  id,
  className = ""
}) => {
  const baseStyles = "block w-full px-2 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 transition";
  const radioStyles = "h-3 w-3 mt-1 text-blue-600 focus:ring-blue-500 border-gray-300";

  return (
    <div className="mb-4">
      {placeholder && type !== 'radio' && (
        <label htmlFor={id} className="block text-sm text-left text-gray-700 mb-2">
          {placeholder}
        </label>
      )}

      {type === 'radio' ? (
        <div className="">
          <input
            type={type}
            onChange={onChange}
            value={value}
            name={name}
            checked={checked}
            id={id}
            className={radioStyles}
          />
          <label htmlFor={id} className="ml-2 block text-sm text-gray-700">
            {placeholder}
          </label>
        </div>
      ) : (
        <input
          type={type}
          placeholder={placeholder}
          onChange={onChange}
          value={value}
          name={name}
          id={id}
          className={`${baseStyles} ${className}`}
        />
      )}
    </div>
  );
};

export default InputText;