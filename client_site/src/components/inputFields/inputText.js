// InputField.js
const InputText = ({ type, placeholder, onChange, value, name, checked, id }) => {
  return (
    <div>
{placeholder && <label htmlFor={id}>{placeholder}</label>}
      <input
        type={type}
        placeholder={placeholder}
        onChange={onChange}
        value={value}
        name={name}
        checked={checked}
        id={id}
        // className="h-4 w-4 text-blue-600 focus:ring-blue-500"
      />

    </div>
  );
};
export default InputText;