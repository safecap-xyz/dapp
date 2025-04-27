import React from 'react';

type TypographyVariant = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'subtitle1' | 'subtitle2' | 'body1' | 'body2' | 'caption' | 'overline';
type FontWeight = 'light' | 'regular' | 'medium' | 'semibold' | 'bold' | 'extrabold';
type TextAlign = 'left' | 'center' | 'right';
type TextColor = 'primary' | 'secondary' | 'accent' | 'light' | 'dark' | 'muted' | 'success' | 'warning' | 'error';

interface TypographyProps {
  variant?: TypographyVariant;
  weight?: FontWeight;
  align?: TextAlign;
  color?: TextColor;
  className?: string;
  children: React.ReactNode;
  gutterBottom?: boolean;
}

export const Typography: React.FC<TypographyProps> = ({
  variant = 'body1',
  weight = 'regular',
  align = 'left',
  color = 'dark',
  className = '',
  children,
  gutterBottom = false,
}) => {
  // Base classes
  let classes = 'font-faustina';
  
  // Font weight classes
  switch (weight) {
    case 'light':
      classes += ' font-light';
      break;
    case 'regular':
      classes += ' font-regular';
      break;
    case 'medium':
      classes += ' font-medium';
      break;
    case 'semibold':
      classes += ' font-semibold';
      break;
    case 'bold':
      classes += ' font-bold';
      break;
    case 'extrabold':
      classes += ' font-extrabold';
      break;
  }
  
  // Text alignment classes
  switch (align) {
    case 'left':
      classes += ' text-left';
      break;
    case 'center':
      classes += ' text-center';
      break;
    case 'right':
      classes += ' text-right';
      break;
  }
  
  // Text color classes
  switch (color) {
    case 'primary':
      classes += ' text-primary';
      break;
    case 'secondary':
      classes += ' text-secondary';
      break;
    case 'accent':
      classes += ' text-accent';
      break;
    case 'light':
      classes += ' text-light';
      break;
    case 'dark':
      classes += ' text-dark';
      break;
    case 'muted':
      classes += ' text-muted';
      break;
    case 'success':
      classes += ' text-success';
      break;
    case 'warning':
      classes += ' text-warning';
      break;
    case 'error':
      classes += ' text-error';
      break;
  }
  
  // Margin bottom for gutterBottom
  if (gutterBottom) {
    classes += ' mb-4';
  }
  
  // Variant-specific styles and component selection
  switch (variant) {
    case 'h1':
      return <h1 className={`text-4xl leading-tight ${classes} ${className}`}>{children}</h1>;
    case 'h2':
      return <h2 className={`text-3xl leading-tight ${classes} ${className}`}>{children}</h2>;
    case 'h3':
      return <h3 className={`text-2xl leading-tight ${classes} ${className}`}>{children}</h3>;
    case 'h4':
      return <h4 className={`text-xl leading-snug ${classes} ${className}`}>{children}</h4>;
    case 'h5':
      return <h5 className={`text-lg leading-snug ${classes} ${className}`}>{children}</h5>;
    case 'h6':
      return <h6 className={`text-base leading-normal ${classes} ${className}`}>{children}</h6>;
    case 'subtitle1':
      return <p className={`text-lg leading-normal ${classes} ${className}`}>{children}</p>;
    case 'subtitle2':
      return <p className={`text-base leading-normal ${classes} ${className}`}>{children}</p>;
    case 'body1':
      return <p className={`text-base leading-relaxed ${classes} ${className}`}>{children}</p>;
    case 'body2':
      return <p className={`text-sm leading-relaxed ${classes} ${className}`}>{children}</p>;
    case 'caption':
      return <span className={`text-sm leading-normal ${classes} ${className}`}>{children}</span>;
    case 'overline':
      return <span className={`text-xs uppercase tracking-wider leading-normal ${classes} ${className}`}>{children}</span>;
    default:
      return <p className={`text-base leading-relaxed ${classes} ${className}`}>{children}</p>;
  }
};

export default Typography;
