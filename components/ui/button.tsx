'use client';

import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  fullWidth = false, 
  className = '', 
  ...props 
}) => {
  const baseStyles = "py-3 px-6 rounded-xl font-bold transition-all transform active:scale-95 shadow-md flex items-center justify-center gap-2";
  
  const variants = {
    primary: "bg-green-600 text-white hover:bg-green-700 shadow-green-900/20",
    secondary: "bg-red-600 text-white hover:bg-red-700 shadow-red-900/20",
    outline: "bg-white text-slate-600 border-2 border-slate-200 hover:bg-slate-50",
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${fullWidth ? 'w-full' : ''} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};