import { Field, ErrorMessage } from "formik";

const DynamicInputField = ({ field, values }) => {
  const {
    name,
    label,
    placeholder = "",
    type = "text",
    options = []
  } = field;

  const inputClasses =
    "border-[0.15vw] border-gray-200 focus:outline-none p-2 w-full rounded-lg";

  const sharedProps = {
    id: name,
    name,
    value: values[name],
    className: inputClasses,
  };


  let inputElement;

  switch (type) {

    case "select":
      inputElement = (
        <Field
          as="select"
          id={name}
          name={name}
          className={inputClasses}
        >
          <option value="">Select {label}</option>
          {options.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </Field>
      );
      break;

    case "radio":
      inputElement = (
        <div className="flex gap-4">
          {options.map((opt) => (
            <label key={opt} className="flex items-center gap-2">
              <Field
                type="radio"
                name={name}
                value={opt}
                className="form-radio text-blue-500"
              />
              {opt}
            </label>
          ))}
        </div>
      );
      break;

    case "checkbox":
      inputElement = (
        <label className="flex items-center gap-2 w-fit">
          <Field
            type="checkbox"
            name={name}
            checked={values[name]}
            className="form-checkbox text-blue-500"
          />
          {label}
        </label>
      );
      break;

    default:
      inputElement = (
        <Field
          {...sharedProps}
          type={type}
          placeholder={placeholder}
        />
      );
  }

  return (
    <div>
      {type !== "checkbox" && (
        <label
          htmlFor={name}
          className="block text-sm font-medium text-gray-700 mb-2 w-fit"
        >
          {label}
        </label>
      )}
      {inputElement}
      <ErrorMessage
        name={name}
        component="div"
        className="text-red-500 text-xs mt-1"
      />
    </div>
  );
};

export default DynamicInputField;
