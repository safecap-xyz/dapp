import React from 'react';

type AlertVariant = 'info' | 'success' | 'warning' | 'error';

interface AlertProps {
  variant?: AlertVariant;
  title?: string;
  children: React.ReactNode;
  className?: string;
  icon?: React.ReactNode;
  onClose?: () => void;
}

export const Alert: React.FC<AlertProps> = ({
  variant = 'info',
  title,
  children,
  className = '',
  icon,
  onClose,
}) => {
  // Base classes
  let alertClasses = 'rounded-md p-4 mb-4';
  
  // Variant-specific classes
  switch (variant) {
    case 'info':
      alertClasses += ' bg-secondary-light/20 text-secondary-dark border-l-4 border-secondary-main';
      break;
    case 'success':
      alertClasses += ' bg-success-main/20 text-success-main border-l-4 border-success-main';
      break;
    case 'warning':
      alertClasses += ' bg-warning-main/20 text-warning-main border-l-4 border-warning-main';
      break;
    case 'error':
      alertClasses += ' bg-error-main/20 text-error-main border-l-4 border-error-main';
      break;
  }
  
  return (
    <div className={`${alertClasses} ${className}`}>
      <div className="flex items-start">
        {icon && <div className="flex-shrink-0 mr-3">{icon}</div>}
        <div className="flex-1">
          {title && <h3 className="text-base font-medium mb-1">{title}</h3>}
          <div className="text-sm">{children}</div>
        </div>
        {onClose && (
          <button
            type="button"
            className="ml-auto -mx-1.5 -my-1.5 p-1.5 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2"
            onClick={onClose}
          >
            <span className="sr-only">Dismiss</span>
            <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
};

export default Alert;
