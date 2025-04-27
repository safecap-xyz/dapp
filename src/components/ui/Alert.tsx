import React, { ReactNode } from 'react';

type AlertVariant = 'info' | 'success' | 'warning' | 'error';

interface AlertProps {
  children: ReactNode;
  variant?: AlertVariant;
  title?: string;
  className?: string;
  onClose?: () => void;
}

export const Alert: React.FC<AlertProps> = ({
  children,
  variant = 'info',
  title,
  className = '',
  onClose,
}) => {
  // Base classes
  let alertClasses = 'rounded-md p-4 mb-4 flex items-start';

  // Variant-specific classes
  switch (variant) {
    case 'info':
      alertClasses += ' bg-primary-light/20 border border-primary-main/30 text-text-primary';
      break;
    case 'success':
      alertClasses += ' bg-success-dark/20 border border-success-main/30 text-success-main';
      break;
    case 'warning':
      alertClasses += ' bg-warning-dark/20 border border-warning-main/30 text-warning-main';
      break;
    case 'error':
      alertClasses += ' bg-error-dark/20 border border-error-main/30 text-error-main';
      break;
  }

  return (
    <div className={`${alertClasses} ${className}`} role="alert">
      <div className="flex-1">
        {title && (
          <h3 className="text-lg font-semibold mb-1">{title}</h3>
        )}
        <div className={title ? 'text-sm' : ''}>{children}</div>
      </div>
      {onClose && (
        <button
          type="button"
          className="ml-auto -mx-1.5 -my-1.5 p-1.5 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2"
          onClick={onClose}
          aria-label="Close"
        >
          <span className="sr-only">Close</span>
          <svg
            className="h-5 w-5"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      )}
    </div>
  );
};

export default Alert;
