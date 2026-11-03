import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'surface' | 'interactive';
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'default',
  padding = 'md',
  className = '',
  ...props
}) => {
  const baseClasses = 'rounded-xl transition-colors duration-150 border';

  const variantClasses = {
    default: 'bg-[#122438] border-[#263A50] text-[#F1F5F9]',
    surface: 'bg-[#0D1B2A] border-[#263A50]/70 text-[#F1F5F9]',
    interactive:
      'bg-[#122438] border-[#263A50] hover:border-[#35E0D0]/60 hover:bg-[#152a42] text-[#F1F5F9] cursor-pointer',
  }[variant];

  const paddingClasses = {
    none: 'p-0',
    sm: 'p-3',
    md: 'p-5',
    lg: 'p-7',
  }[padding];

  return (
    <div className={`${baseClasses} ${variantClasses} ${paddingClasses} ${className}`} {...props}>
      {children}
    </div>
  );
};
