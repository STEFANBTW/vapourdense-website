import React from 'react';

interface VDVCLogoProps {
  className?: string;
  size?: number;
}

export const VDVCLogo: React.FC<VDVCLogoProps> = ({ className = 'w-8 h-8', size = 32 }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 transition-transform duration-300 group-hover:scale-105 ${className}`}
      aria-label="VDVC Logo"
    >
      <defs>
        <linearGradient id="vdvc-bg" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
          <stop stopColor="#130f30" />
          <stop offset="1" stopColor="#241b4b" />
        </linearGradient>
        <linearGradient id="vdvc-steam" x1="16" y1="6" x2="32" y2="24" gradientUnits="userSpaceOnUse">
          <stop stopColor="#c084fc" />
          <stop offset="0.5" stopColor="#38bdf8" />
          <stop offset="1" stopColor="#818cf8" />
        </linearGradient>
        <linearGradient id="vdvc-accent" x1="12" y1="24" x2="36" y2="40" gradientUnits="userSpaceOnUse">
          <stop stopColor="#f8fafc" />
          <stop offset="1" stopColor="#cbd5e1" />
        </linearGradient>
      </defs>

      {/* Modern Squircle Badge with subtle border */}
      <rect width="48" height="48" rx="12" fill="url(#vdvc-bg)" />
      <rect x="0.75" y="0.75" width="46.5" height="46.5" rx="11.25" stroke="rgba(255, 255, 255, 0.15)" strokeWidth="1.5" />

      {/* Dense Rising Vapor / Steam Curves (forming V & D dynamic contours) */}
      <path
        d="M 18 17 C 16 13, 20 9, 18 6"
        stroke="url(#vdvc-steam)"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M 24 18 C 22 13, 26 9, 24 5"
        stroke="url(#vdvc-steam)"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M 30 17 C 28 13, 32 9, 30 6"
        stroke="url(#vdvc-steam)"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Virtual Cafe Cup / Chalice Silhouette */}
      <path
        d="M 13 22 H 33 C 33 22, 33.5 33, 23 33 C 12.5 33, 13 22, 13 22 Z"
        fill="url(#vdvc-accent)"
      />

      {/* Cup Handle */}
      <path
        d="M 32 24 C 36 24, 37.5 28, 33 30"
        stroke="url(#vdvc-accent)"
        strokeWidth="2.2"
        strokeLinecap="round"
        fill="none"
      />

      {/* Elegant Saucer Base */}
      <rect x="11" y="35" width="24" height="2.5" rx="1.25" fill="#a78bfa" />
    </svg>
  );
};
