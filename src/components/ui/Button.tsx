import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  icon,
  className = '',
  disabled,
  ...props
}) => {
  const baseClasses =
    'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-150 cursor-pointer select-none disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2';

  const sizeClasses = {
    sm: 'text-xs px-3 py-1.5 gap-1.5',
    md: 'text-sm px-4 py-2 gap-2',
    lg: 'text-base px-5 py-2.5 gap-2.5',
  }[size];

  const variantClasses = {
    primary:
      'bg-[#35E0D0] text-[#08111F] hover:bg-[#48C8F5] active:bg-[#2bc4b5] font-semibold shadow-sm shadow-[#35E0D0]/20 focus-visible:outline-[#35E0D0]',
    secondary:
      'bg-[#122438] text-[#F1F5F9] border border-[#263A50] hover:bg-[#1A324C] hover:border-[#35E0D0]/50 active:bg-[#0D1B2A] focus-visible:outline-[#48C8F5]',
    outline:
      'bg-transparent text-[#35E0D0] border border-[#35E0D0]/60 hover:bg-[#35E0D0]/10 active:bg-[#35E0D0]/20 focus-visible:outline-[#35E0D0]',
    danger:
      'bg-[#FB7185]/20 text-[#FB7185] border border-[#FB7185]/40 hover:bg-[#FB7185]/30 active:bg-[#FB7185]/40 focus-visible:outline-[#FB7185]',
    ghost:
      'bg-transparent text-[#A7B5C7] hover:text-[#F1F5F9] hover:bg-[#122438] active:bg-[#0D1B2A] focus-visible:outline-[#35E0D0]',
  }[variant];

  return (
    <button
      className={`${baseClasses} ${sizeClasses} ${variantClasses} ${className}`}
      disabled={disabled}
      {...props}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      <span>{children}</span>
    </button>
  );
};
