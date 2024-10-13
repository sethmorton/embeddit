import React from "react";

interface InputProps {
  type: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className: string;
}

export const Input: React.FC<InputProps> = ({
  type,
  placeholder,
  value,
  onChange,
  className,
}) => (
  <input
    type={type}
    placeholder={placeholder}
    value={value}
    onChange={onChange}
    className={`input input-bordered ${className}`}
  />
);
