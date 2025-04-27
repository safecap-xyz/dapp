import React, { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  hoverable?: boolean;
  glassEffect?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  hoverable = false,
  glassEffect = false,
}) => {
  // Base classes
  let cardClasses = 'card rounded-lg shadow-md p-4 border border-secondary-main/10';

  // Add hoverable effect
  if (hoverable) {
    cardClasses += ' transform transition-transform duration-300 hover:translate-y-[-5px] hover:shadow-lg';
  }

  // Add glass effect
  if (glassEffect) {
    cardClasses += ' glass-panel';
  }

  return (
    <div className={`${cardClasses} ${className}`}>
      {children}
    </div>
  );
};

export default Card;
