import React, { useState } from "react";

interface SelectProps {
  name: string; // Definindo o tipo para a propriedade 'name'
  options?: { id: string; value: string; label: string }[];
  label?: string;
  onChange?: (value: string) => void;
}

function Select({ name, options = [], label, onChange, ...rest }: SelectProps) {
  const [selectedValue, setSelectedValue] = useState("");

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    setSelectedValue(value);
    if (onChange) {
      onChange(value);
    }
  };

  return (
    <div>
       {label && <label htmlFor={name} style={{ fontSize: "16px", marginBottom: "8px", display: "block", color: "#fff" }}>{label}</label>}
      <select name={name} id={name} onChange={handleChange} value={selectedValue} {...rest} style={{
          fontSize: "20px",
          border: "none",
          padding: "10px",
          borderRadius: "5px",
          width: "100%",
          appearance: "none",
          backgroundColor: "#171923",
        }}>
        <option value="">Select...</option>
        {options.map((option) => (
          <option key={option.id} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}

export default Select;
