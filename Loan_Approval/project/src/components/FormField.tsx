import React, { useState, useRef, useEffect } from 'react';
import { AlertCircle, Check, ChevronDown } from 'lucide-react';

interface FormFieldProps {
  label: string;
  name: string;
  type?: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  error?: string;
  placeholder?: string;
  required?: boolean;
  options?: { value: string; label: string }[];
  min?: number;
  max?: number;
  step?: number;
  icon?: React.ReactNode;
  description?: string;
}

export const FormField: React.FC<FormFieldProps> = ({
  label,
  name,
  type = 'text',
  value,
  onChange,
  error,
  placeholder,
  required = false,
  options,
  min,
  max,
  step,
  icon,
  description
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement | HTMLSelectElement>(null);

  const hasValue = value !== '' && value !== 0;
  const isValid = hasValue && !error;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (inputRef.current && !inputRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const baseInputClasses = `
    input-field transition-all duration-300 ease-in-out text-right
    ${error ? 'input-error' : ''}
    ${icon ? 'pl-12' : 'pl-6'}
    ${hasValue || isFocused ? 'pt-6 pb-4' : 'py-4'}
    ${isValid ? 'border-success-300 bg-success-50/30 focus:border-success-500 focus:ring-success-100' : ''}
  `;

  const labelClasses = `
    absolute text-neutral-500 pointer-events-none transition-all duration-300 ease-in-out
    ${hasValue || isFocused 
      ? 'top-2 text-xs font-medium' 
      : 'top-1/2 transform -translate-y-1/2 text-sm'
    }
    ${icon 
      ? (hasValue || isFocused ? 'left-6' : 'left-12') 
      : 'left-6'
    }
    ${error ? 'text-error-500' : ''}
    ${isFocused ? 'text-primary-600' : ''}
    ${isValid ? 'text-success-600' : ''}
  `;

  return (
    <div className="space-y-2 animate-slide-in">
      <div className="relative group">
        {/* Icon - Only show when not focused/filled to avoid label overlap */}
        {icon && !(hasValue || isFocused) && (
          <div className={`
            absolute left-5 top-1/2 transform -translate-y-1/2 transition-all duration-300 z-10
            ${error ? 'text-error-400' : 'text-neutral-400'}
          `}>
            {icon}
          </div>
        )}

        {/* Small Icon when focused/filled - positioned safely */}
        {icon && (hasValue || isFocused) && (
          <div className={`
            absolute left-5 bottom-2 transition-all duration-300 z-10 opacity-60
            ${error ? 'text-error-400' : isValid ? 'text-success-500' : isFocused ? 'text-primary-500' : 'text-neutral-400'}
          `}>
            <div className="scale-75">
              {icon}
            </div>
          </div>
        )}

        {/* Success Icon */}
        {isValid && !options && (
          <div className="absolute right-5 top-1/2 transform -translate-y-1/2 text-success-500 z-10">
            <Check size={18} />
          </div>
        )}

        {/* Dropdown Arrow */}
        {options && (
          <div className={`
            absolute right-5 top-1/2 transform -translate-y-1/2 transition-transform duration-200 z-10
            ${isDropdownOpen ? 'rotate-180' : ''}
            ${error ? 'text-error-400' : 'text-neutral-400'}
          `}>
            <ChevronDown size={18} />
          </div>
        )}

        {/* Input/Select */}
        {options ? (
          <select
            ref={inputRef as React.RefObject<HTMLSelectElement>}
            id={name}
            name={name}
            value={value}
            onChange={onChange}
            onFocus={() => {
              setIsFocused(true);
              setIsDropdownOpen(true);
            }}
            onBlur={() => {
              setIsFocused(false);
              setIsDropdownOpen(false);
            }}
            className={`${baseInputClasses} pr-12 cursor-pointer appearance-none`}
            required={required}
          >
            <option value="" disabled hidden></option>
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        ) : (
          <input
            ref={inputRef as React.RefObject<HTMLInputElement>}
            id={name}
            name={name}
            type={type}
            value={value}
            onChange={onChange}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder=""
            className={`${baseInputClasses} ${isValid ? 'pr-12' : 'pr-6'}`}
            required={required}
            min={min}
            max={max}
            step={step}
          />
        )}

        {/* Floating Label */}
        <label htmlFor={name} className={labelClasses}>
          {label} {required && <span className="text-error-500 ml-1">*</span>}
        </label>

        {/* Focus Ring Effect */}
        <div className={`
          absolute inset-0 rounded-xl pointer-events-none transition-all duration-300
          ${isFocused ? 'ring-4 ring-primary-100 ring-opacity-60' : ''}
          ${error && isFocused ? 'ring-error-100' : ''}
          ${isValid && isFocused ? 'ring-success-100' : ''}
        `} />
      </div>

      {/* Description */}
      {description && !error && (
        <p className="text-xs text-neutral-500 ml-1">{description}</p>
      )}

      {/* Error Message */}
      {error && (
        <div className="flex items-center gap-2 text-sm text-error-600 animate-slide-in ml-1">
          <AlertCircle size={16} className="flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Success Message for valid inputs */}
      {isValid && type === 'number' && (
        <div className="flex items-center gap-2 text-sm text-success-600 animate-slide-in ml-1">
          <Check size={16} className="flex-shrink-0" />
          <span>Looks good!</span>
        </div>
      )}
    </div>
  );
};