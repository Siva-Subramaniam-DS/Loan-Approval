import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';

interface Option {
  value: string;
  label: string;
}

interface CustomDropdownProps {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  error?: string;
  required?: boolean;
  options: Option[];
  icon?: React.ReactNode;
  description?: string;
}

export const CustomDropdown: React.FC<CustomDropdownProps> = ({
  label,
  name,
  value,
  onChange,
  error,
  required = false,
  options,
  icon,
  description
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const hasValue = value !== '' && value !== undefined;
  const isValid = hasValue && !error;
  const selectedOption = options.find(option => option.value === value);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setIsFocused(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleOptionSelect = (optionValue: string) => {
    // Create a synthetic event to match the expected onChange signature
    const syntheticEvent = {
      target: { name, value: optionValue }
    } as React.ChangeEvent<HTMLSelectElement>;
    
    onChange(syntheticEvent);
    setIsOpen(false);
    setIsFocused(false);
  };

  const handleToggle = () => {
    setIsOpen(!isOpen);
    setIsFocused(!isOpen);
  };

  const dropdownClasses = `
    input-field transition-all duration-300 ease-in-out cursor-pointer text-right
    ${error ? 'input-error' : ''}
    ${icon ? 'pl-12' : 'pl-6'}
    ${hasValue || isFocused ? 'pt-6 pb-4' : 'py-4'}
    pr-12
    ${isValid ? 'border-success-300 bg-success-50/30 focus:border-success-500 focus:ring-success-100' : ''}
    ${isOpen ? 'ring-4 ring-primary-100 border-primary-500' : ''}
  `;

  const labelClasses = `
    absolute text-neutral-500 pointer-events-none transition-all duration-300 ease-in-out
    ${hasValue || isFocused 
      ? 'top-2 text-xs font-medium' 
      : 'top-1/2 transform -translate-y-1/2 text-sm'
    }
    ${icon && !(hasValue || isFocused) ? 'left-12' : 'left-6'}
    ${error ? 'text-error-500' : ''}
    ${isFocused || isOpen ? 'text-primary-600' : ''}
    ${isValid ? 'text-success-600' : ''}
  `;

  return (
    <div className="space-y-2 animate-slide-in">
      <div className="relative group" ref={dropdownRef}>
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
        {isValid && (
          <div className="absolute right-12 top-1/2 transform -translate-y-1/2 text-success-500 z-10">
            <Check size={18} />
          </div>
        )}

        {/* Dropdown Arrow */}
        <div className={`
          absolute right-5 top-1/2 transform -translate-y-1/2 transition-all duration-300 z-10
          ${isOpen ? 'rotate-180 text-primary-500' : ''}
          ${error ? 'text-error-400' : 'text-neutral-400'}
        `}>
          <ChevronDown size={18} />
        </div>

        {/* Main Dropdown Button */}
        <div
          onClick={handleToggle}
          className={dropdownClasses}
        >
          <span className={`
            ${hasValue ? 'text-neutral-900 font-medium' : 'text-neutral-400'}
          `}>
            {selectedOption ? selectedOption.label : ''}
          </span>
        </div>

        {/* Floating Label */}
        <label className={labelClasses}>
          {label} {required && <span className="text-error-500 ml-1">*</span>}
        </label>

        {/* Focus Ring Effect */}
        <div className={`
          absolute inset-0 rounded-xl pointer-events-none transition-all duration-300
          ${isFocused || isOpen ? 'ring-4 ring-primary-100 ring-opacity-60' : ''}
          ${error && (isFocused || isOpen) ? 'ring-error-100' : ''}
          ${isValid && (isFocused || isOpen) ? 'ring-success-100' : ''}
        `} />

        {/* Dropdown Menu */}
        {isOpen && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white border-2 border-primary-200 rounded-xl shadow-hard z-50 overflow-hidden animate-scale-in">
            <div className="max-h-64 overflow-y-auto">
              {options.map((option, index) => (
                <div
                  key={option.value}
                  onClick={() => handleOptionSelect(option.value)}
                  className={`
                    px-6 py-4 cursor-pointer transition-all duration-200 flex items-center justify-between
                    ${value === option.value 
                      ? 'bg-primary-50 text-primary-700 font-medium' 
                      : 'text-neutral-700 hover:bg-neutral-50'
                    }
                    ${index === 0 ? 'border-b border-neutral-100' : ''}
                    ${index !== options.length - 1 ? 'border-b border-neutral-100' : ''}
                  `}
                >
                  <span className="text-right w-full">{option.label}</span>
                  {value === option.value && (
                    <Check size={16} className="text-primary-600 ml-3 flex-shrink-0" />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Description */}
      {description && !error && (
        <p className="text-xs text-neutral-500 ml-1">{description}</p>
      )}

      {/* Error Message */}
      {error && (
        <div className="flex items-center gap-2 text-sm text-error-600 animate-slide-in ml-1">
          <div className="w-4 h-4 rounded-full bg-error-100 flex items-center justify-center flex-shrink-0">
            <div className="w-2 h-2 rounded-full bg-error-500"></div>
          </div>
          <span>{error}</span>
        </div>
      )}

      {/* Success Message for valid selections */}
      {isValid && (
        <div className="flex items-center gap-2 text-sm text-success-600 animate-slide-in ml-1">
          <Check size={16} className="flex-shrink-0" />
          <span>Great choice!</span>
        </div>
      )}
    </div>
  );
}; 