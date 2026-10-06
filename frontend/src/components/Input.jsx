const Input = ({ type = "text", name, value, onChange, placeholder, required = false, className = ""}) => {
  return (
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      className={`w-full border rounded-md px-4 py-2 outline-none focus:border-blue-500 ${className}`}
    />
  );
};

export default Input;