import React from 'react';
import './Button.css';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  ...props
}) => {
  const baseClass = [
    'button',
    `button-${variant}`,
    `button-${size}`,
    className
  ].filter(Boolean).join(' ');

  return (
    <button className={baseClass} {...props}>
      {children}
    </button>
  );
}; 