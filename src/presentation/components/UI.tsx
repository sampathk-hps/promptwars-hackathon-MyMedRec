import React from 'react';

export const Logo = () => (
  <div className="flex items-center gap-2 font-bold text-xl tracking-tight">
    <div className="flex items-center text-primary">
      <svg aria-hidden="true" focusable="false" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M4 14C4 14 6 18 12 18C18 18 20 14 20 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        <path d="M7 10C7 10 8 13 12 13C16 13 17 10 17 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        <path d="M10 6C10 6 10.5 8 12 8C13.5 8 14 6 14 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        <path d="M12 3V4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    </div>
    <span style={{ color: 'var(--text-primary)'}}>MyMedRec</span>
  </div>
);

interface CardProps {
  children: React.ReactNode;
  className?: string;
  compact?: boolean;
  style?: React.CSSProperties;
}

export const Card: React.FC<CardProps> = ({ children, className = '', compact = false, style }) => {
  return (
    <div className={`${compact ? 'card-compact' : 'card'} ${className}`} style={style}>
      {children}
    </div>
  );
};

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'coral' | 'emerald' | 'amber' | 'sky' | 'teal' | 'indigo' | 'gray';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ children, variant = 'gray', className = '' }) => {
  return (
    <span className={`badge badge-${variant} ${className}`}>
      {children}
    </span>
  );
};

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline' | 'coral-outline';
  style?: React.CSSProperties;
}

export const Button: React.FC<ButtonProps> = ({ children, variant = 'primary', className = '', style, ...props }) => {
  return (
    <button className={`btn btn-${variant} ${className}`} style={style} {...props}>
      {children}
    </button>
  );
};
