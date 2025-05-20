// components/inputs/RangeInput.js
import { useState } from "react";

const RangeInput = ({ label, name, value, onChange, min, max }) => {
  const [displayValue, setDisplayValue] = useState(value || min);

  const handleChange = (e) => {
    const newValue = e.target.value;
    setDisplayValue(newValue);
    onChange(newValue);
  };

  return (
    <div>
      <div className="flex justify-between mb-1">
        <label
          htmlFor={name}
          className="block text-sm font-medium text-gray-700"
        >
          {label}
        </label>
        <span className="text-sm text-gray-500">
          {displayValue} {displayValue === 1 ? "year" : "years"}
        </span>
      </div>
      <input
        type="range"
        id={name}
        name={name}
        min={min}
        max={max}
        value={value || min}
        onChange={handleChange}
        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
      />
      <div className="flex justify-between text-xs text-gray-500 mt-1">
        <span>{min} years</span>
        <span>{max} years</span>
      </div>
    </div>
  );
};

export default RangeInput;
