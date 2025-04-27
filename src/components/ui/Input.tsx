import React, { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
  error?: boolean;
  fullWidth?: boolean;
}

export const Input: React.FC<InputProps> = ({
  label,
  helperText,
  error = false,
  fullWidth = false,
  className = '',
  ...props
}) => {
  // Base classes
  let inputClasses = 'bg-neutral-dark/50 border rounded-md py-2 px-3 focus:outline-none focus:ring-2 transition-all duration-200';
  let labelClasses = 'block mb-1 font-medium text-sm';
  let helperTextClasses = 'mt-1 text-xs';

  // Error state
  if (error) {
    inputClasses += ' border-error-main focus:ring-error-main/50';
    helperTextClasses += ' text-error-main';
  } else {
    inputClasses += ' border-secondary-main/30 focus:border-secondary-main focus:ring-secondary-main/50';
    helperTextClasses += ' text-text-secondary';
  }

  // Width
  if (fullWidth) {
    inputClasses += ' w-full';
  }

  // Disabled state
  if (props.disabled) {
    inputClasses += ' opacity-50 cursor-not-allowed';
  }

  return (
    <div className={`${fullWidth ? 'w-full' : ''} mb-4`}>
      {label && (
        <label className={labelClasses}>
          {label}
        </label>
      )}
      <input
        className={`${inputClasses} ${className}`}
        {...props}
      />
      {helperText && (
        <p className={helperTextClasses}>{helperText}</p>
      )}
    </div>
  );
};

export default Input;
