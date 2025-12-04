import React from 'react';

interface LogoProps {
  className?: string;
  showText?: boolean;
  variant?: 'light' | 'dark';
}

export const Logo: React.FC<LogoProps> = ({ className = "w-10 h-10", showText = true, variant = 'dark' }) => {
  return (
    <div className="flex items-center gap-3">
      {/* Stylized Shield Logo representing the uploaded image */}
      <svg 
        viewBox="0 0 100 120" 
        className={className} 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M50 115C50 115 95 95 95 30V10H5V30C5 95 50 115 50 115Z" fill="#F0FDF4" stroke="#15803D" strokeWidth="3"/>
        
        {/* Left red bars (Chart) */}
        <path d="M25 80V50H35V80H25Z" fill="#DC2626" />
        <path d="M40 80V35H50V80H40Z" fill="#DC2626" />
        
        {/* Right Green Leaf/Curve */}
        <path d="M60 80C60 80 80 75 80 50C80 25 60 25 60 25" stroke="#15803D" strokeWidth="6" strokeLinecap="round" />
        <path d="M60 50H80" stroke="#15803D" strokeWidth="4" strokeLinecap="round" />
        
        {/* Recycle arrows top left */}
        <path d="M20 25L25 15L30 25" stroke="#15803D" strokeWidth="2" strokeLinejoin="round"/>
        <path d="M25 20C20 20 15 25 15 30" stroke="#15803D" strokeWidth="2" strokeLinecap="round" />
      </svg>
      
      {showText && (
        <div className="flex flex-col">
          <span className={`text-2xl font-bold tracking-tight leading-none ${variant === 'light' ? 'text-white' : 'text-emerald-900'}`}>
            KLINCAM
          </span>
          <span className={`text-[0.65rem] font-bold tracking-wider uppercase mt-0.5 ${variant === 'light' ? 'text-slate-300' : 'text-red-600'}`}>
            Clean Cities. Smart Future.
          </span>
        </div>
      )}
    </div>
  );
};