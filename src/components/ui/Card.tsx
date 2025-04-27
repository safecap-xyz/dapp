import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  elevation?: 'none' | 'low' | 'medium' | 'high';
  padding?: 'none' | 'small' | 'medium' | 'large';
  border?: boolean;
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  elevation = 'medium',
  padding = 'medium',
  border = false,
  onClick,
}) => {
  // Base classes
  let cardClasses = 'bg-neutral-light rounded-lg';
  
  // Elevation classes
  switch (elevation) {
    case 'none':
      cardClasses += ' shadow-none';
      break;
    case 'low':
      cardClasses += ' shadow-sm';
      break;
    case 'medium':
      cardClasses += ' shadow-md';
      break;
    case 'high':
      cardClasses += ' shadow-lg';
      break;
  }
  
  // Padding classes
  switch (padding) {
    case 'none':
      cardClasses += ' p-0';
      break;
    case 'small':
      cardClasses += ' p-2';
      break;
    case 'medium':
      cardClasses += ' p-4';
      break;
    case 'large':
      cardClasses += ' p-6';
      break;
  }
  
  // Border classes
  if (border) {
    cardClasses += ' border border-neutral-dark';
  }
  
  // Interactive classes
  if (onClick) {
    cardClasses += ' cursor-pointer transition-transform hover:scale-[1.02]';
  }
  
  return (
    <div 
      className={`${cardClasses} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export default Card;
