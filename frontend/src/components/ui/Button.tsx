import { Link } from 'react-router-dom';
import type { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  to?: string;
  children: ReactNode;
}

const variants = {
  primary:
    'bg-gold text-white hover:bg-gold/90 shadow-sm',
  secondary:
    'border-2 border-gold text-gold hover:bg-gold hover:text-white',
  ghost:
    'text-gold hover:text-gold/80 underline-offset-4 hover:underline',
};

export default function Button({
  variant = 'primary',
  to,
  children,
  className = '',
  ...props
}: ButtonProps) {
  const baseClasses =
    'inline-flex items-center justify-center px-6 py-3 text-sm font-medium tracking-wide uppercase rounded transition-all duration-200';
  const classes = `${baseClasses} ${variants[variant]} ${className}`;

  if (to) {
    return (
      <Link to={to} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
}
