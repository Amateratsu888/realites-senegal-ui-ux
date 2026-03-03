import React from 'react';

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'secondary' | 'outline' | 'destructive' | 'gold';
  children: React.ReactNode;
}

export function Badge({ 
  variant = 'default', 
  children, 
  className = '',
  ...props 
}: BadgeProps) {
  const baseStyles = 'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-primary-600 focus:ring-offset-2';
  
  const variants = {
    default: 'border-transparent bg-primary-600 text-white',
    secondary: 'border-transparent bg-slate-100 text-slate-900',
    outline: 'text-slate-950 border-slate-200',
    destructive: 'border-transparent bg-red-500 text-slate-50',
    gold: 'border-transparent bg-gradient-to-r from-gold-500 via-gold-600 to-gold-700 text-white font-bold shadow-md',
  };
  
  return (
    <div className={`${baseStyles} ${variants[variant]} ${className}`} {...props}>
      {children}
    </div>
  );
}