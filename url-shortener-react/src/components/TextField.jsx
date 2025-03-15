const TextField = ({
    label,
    id,
    name,
    type,
    errors,
    register,
    required,
    message,
    className,
    min,
    value,
    placeholder,
    isDarkMode,
  }) => {
    // Use name if provided, otherwise fall back to id
    const fieldName = name || id;
    
    return (
      <div className="flex flex-col gap-1">
        <label
          htmlFor={fieldName}
          className={`${className ? className : ""} font-semibold text-md ${isDarkMode ? 'text-darkText' : ''}`}
        >
          {label}
        </label>
  
        <input
          type={type || "text"}
          id={fieldName}
          placeholder={placeholder}
          className={`${
            className ? className : ""
          } px-2 py-2 border outline-none rounded-md ${
            isDarkMode 
              ? `bg-gray-850 text-darkText ${errors[fieldName]?.message ? "border-red-500" : "border-darkBorder"}`
              : `bg-transparent text-slate-700 ${errors[fieldName]?.message ? "border-red-500" : "border-slate-600"}`
          }`}
          {...register(fieldName, {
            required: required ? { value: true, message: message || `${label} is required` } : false,
            minLength: min
              ? { value: min, message: "Minimum 6 character is required" }
              : undefined,
  
            pattern:
              type === "email"
                ? {
                    value: /^[a-zA-Z0-9]+@(?:[a-zA-Z0-9]+\.)+com+$/,
                    message: "Invalid email",
                  }
                : type === "url"
                ? {
                    value:
                      /^(https?:\/\/)?(([a-zA-Z0-9\u00a1-\uffff-]+\.)+[a-zA-Z\u00a1-\uffff]{2,})(:\d{2,5})?(\/[^\s]*)?$/,
                    message: "Please enter a valid url",
                  }
                : undefined,
          })}
        />
  
        {errors[fieldName]?.message && (
          <p className="text-sm font-semibold text-red-600 mt-0">
            {errors[fieldName]?.message}*
          </p>
        )}
      </div>
    );
  };
  
  export default TextField;