import React, { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
  error?: boolean;
  fullWidth?: boolean;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
}

export const Input: React.FC<InputProps> = ({
  label,
  helperText,
  error = false,
  fullWidth = false,
  startIcon,
  endIcon,
  className = '',
  ...props
}) => {
  // Base classes
  let inputWrapperClasses = 'mb-4';
  let inputClasses = 'px-3 py-2 bg-neutral-light border rounded-md focus:outline-none focus:ring-2 transition-all';
  
  // Error state
  if (error) {
    inputClasses += ' border-error-main focus:border-error-main focus:ring-error-light';
  } else {
    inputClasses += ' border-neutral-dark focus:border-secondary-main focus:ring-secondary-light';
  }
  
  // Width
  if (fullWidth) {
    inputWrapperClasses += ' w-full';
    inputClasses += ' w-full';
  }
  
  // Icon adjustments
  if (startIcon) {
    inputClasses += ' pl-10';
  }
  
  if (endIcon) {
    inputClasses += ' pr-10';
  }
  
  // Disabled state
  if (props.disabled) {
    inputClasses += ' bg-neutral-dark opacity-60 cursor-not-allowed';
  }
  
  return (
    <div className={inputWrapperClasses}>
      {label && (
        <label 
          htmlFor={props.id} 
          className={`block text-sm font-medium mb-1 ${error ? 'text-error' : 'text-dark'}`}
        >
          {label}
        </label>
      )}
      
      <div className="relative">
        {startIcon && (
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-text-secondary">
            {startIcon}
          </div>
        )}
        
        <input
          className={`${inputClasses} ${className}`}
          {...props}
        />
        
        {endIcon && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-text-secondary">
            {endIcon}
          </div>
        )}
      </div>
      
      {helperText && (
        <p className={`mt-1 text-sm ${error ? 'text-error' : 'text-muted'}`}>
          {helperText}
        </p>
      )}
    </div>
  );
};

export default Input;
