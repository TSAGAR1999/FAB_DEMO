import React from 'react';

const AIIcon = ({ size = 12, className = "" }) => {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 16 16" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={`inline-block ${className}`}
    >
      {/* Simple AI chip/brain icon */}
      <rect 
        x="2" 
        y="4" 
        width="12" 
        height="8" 
        rx="2" 
        stroke="currentColor" 
        strokeWidth="1" 
        fill="none"
        opacity="0.6"
      />
      <circle cx="5" cy="7" r="1" fill="currentColor" opacity="0.6" />
      <circle cx="8" cy="7" r="1" fill="currentColor" opacity="0.6" />
      <circle cx="11" cy="7" r="1" fill="currentColor" opacity="0.6" />
      <path 
        d="M6 10 L10 10" 
        stroke="currentColor" 
        strokeWidth="1" 
        opacity="0.6"
      />
    </svg>
  );
};

export default AIIcon;