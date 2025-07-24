import React, { ChangeEvent, InputHTMLAttributes } from "react";

interface CustomInputProps extends InputHTMLAttributes<HTMLInputElement> {
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

export default function CustomInput({
  value,
  onChange,
  ...props
}: CustomInputProps) {
  return (
    <input
      className="border rounded px-4 py-2 w-full focus:outline-none focus:ring"
      value={value}
      onChange={onChange}
      {...props}
    />
  );
}
