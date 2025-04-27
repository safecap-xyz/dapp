import React, { ButtonHTMLAttributes } from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'accent' | 'outline' | 'text';
type ButtonSize = 'small' | 'medium' | 'large';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'medium',
  fullWidth = false,
  children,
  className = '',
  ...props
}) => {
  // Base classes
  let buttonClasses = 'font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2';

  // Variant classes
  switch (variant) {
    case 'primary':
      buttonClasses += ' bg-primary-main text-primary-contrast hover:bg-primary-dark focus:ring-primary-light';
      break;
    case 'secondary':
      buttonClasses += ' bg-secondary-main text-secondary-contrast hover:bg-secondary-dark focus:ring-secondary-light';
      break;
    case 'accent':
      buttonClasses += ' bg-accent-main text-accent-contrast hover:bg-accent-dark focus:ring-accent-light';
      break;
    case 'outline':
      buttonClasses += ' bg-transparent border border-primary-main text-primary-main hover:bg-primary-main hover:text-primary-contrast focus:ring-primary-light';
      break;
    case 'text':
      buttonClasses += ' bg-transparent text-primary-main hover:bg-primary-main/10 focus:ring-primary-light';
      break;
  }

  // Size classes
  switch (size) {
    case 'small':
      buttonClasses += ' text-sm py-1 px-3 rounded';
      break;
    case 'medium':
      buttonClasses += ' text-base py-2 px-4 rounded-md';
      break;
    case 'large':
      buttonClasses += ' text-lg py-3 px-6 rounded-lg';
      break;
  }

  // Width classes
  if (fullWidth) {
    buttonClasses += ' w-full';
  }

  // Disabled state
  if (props.disabled) {
    buttonClasses += ' opacity-50 cursor-not-allowed';
  }

  return (
    <button
      className={`${buttonClasses} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
