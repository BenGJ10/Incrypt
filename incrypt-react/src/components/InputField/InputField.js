const InputField = ({
  label,
  id,
  type,
  errors,
  register,
  required,
  message,
  className,
  min,
  value,
  autoFocus,
  placeholder,
  readOnly,
}) => {
  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      <label
        htmlFor={id}
        className="text-body font-medium text-text-main"
      >
        {label}
      </label>

      <input
        type={type}
        id={id}
        placeholder={placeholder}
        className={`mt-1 w-full rounded-md border px-3 py-2 text-body text-text-main outline-none transition-colors ${
          errors[id]?.message
            ? "border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500"
            : "border-border-subtle bg-bg-surface focus:border-primary focus:ring-1 focus:ring-primary"
        }`}
        {...register(id, {
          required: { value: required, message },
          minLength: min
            ? { value: min, message: "Minimum 6 character is required" }
            : null,
        })}
        readOnly={readOnly}
      />

      {errors[id]?.message && (
        <p className="mt-1 text-[11px] font-medium text-red-500">
          {errors[id]?.message}*
        </p>
      )}
    </div>
  );
};

export default InputField;
