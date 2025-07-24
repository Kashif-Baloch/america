import React, { useRef, useState, useEffect } from "react";

// Define the option type
type Option = {
  value: string;
  label: string;
};

// Define the props type
interface CustomDropdownProps {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function CustomDropdown({
  options,
  value,
  onChange,
  placeholder,
}: CustomDropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={ref} className="relative font-sf tracking-wide">
      <button
        type="button"
        className="border cursor-pointer text-lg rounded px-4 py-3 w-full text-left"
        onClick={() => setOpen((o) => !o)}
      >
        {options.find((opt) => opt.value === value)?.label || placeholder}
      </button>
      {open && (
        <ul className="absolute z-10 bg-white border mt-1 w-full rounded shadow">
          {options.map((opt) => (
            <li
              key={opt.value}
              className="px-4 py-2 text-lg hover:bg-gray-100 cursor-pointer"
              onClick={() => {
                onChange(opt.value);
                setOpen(false);
              }}
            >
              {opt.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
