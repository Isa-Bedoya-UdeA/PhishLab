import React from 'react';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'neutral' | 'turquoise' | 'success' | 'danger' | 'warning' | 'lilac';
  size?: 'sm' | 'md';
  icon?: React.ReactNode;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'neutral',
  size = 'sm',
  icon,
  className = '',
}) => {
  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 gap-1',
    md: 'text-xs px-2.5 py-1 gap-1.5',
  }[size];

  const variantClasses = {
    neutral: 'bg-[#122438] text-[#A7B5C7] border border-[#263A50]',
    turquoise: 'bg-[#35E0D0]/10 text-[#35E0D0] border border-[#35E0D0]/30',
    success: 'bg-[#4ADE80]/10 text-[#4ADE80] border border-[#4ADE80]/30',
    danger: 'bg-[#FB7185]/10 text-[#FB7185] border border-[#FB7185]/30',
    warning: 'bg-[#FBBF24]/10 text-[#FBBF24] border border-[#FBBF24]/30',
    lilac: 'bg-[#A78BFA]/10 text-[#C4B5FD] border border-[#A78BFA]/30',
  }[variant];

  return (
    <span
      className={`inline-flex items-center font-medium rounded-md whitespace-nowrap ${sizeClasses} ${variantClasses} ${className}`}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      <span>{children}</span>
    </span>
  );
};
