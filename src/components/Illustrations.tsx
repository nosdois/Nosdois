/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

/**
 * Bespoke illustration of a happy couple playing together on a comfortable sofa with a smartphone.
 * Stylized in Nós Dois palette: deep teal, yellow accents (#FFD15C), and coral highlights (#F16D7A).
 */
export const CoupleHeroIllustration: React.FC<{ className?: string }> = ({ className = 'w-full max-w-sm h-auto' }) => (
  <svg
    viewBox="0 0 420 280"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-label="Ilustração de casal jogando junto no mesmo celular"
  >
    <defs>
      <linearGradient id="sofaGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#104B43" />
        <stop offset="100%" stopColor="#082F2B" />
      </linearGradient>
      <linearGradient id="goldGleam" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FFD15C" />
        <stop offset="100%" stopColor="#EAB83F" />
      </linearGradient>
      <radialGradient id="phoneGlow" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#FFD15C" stopOpacity="0.8" />
        <stop offset="50%" stopColor="#F16D7A" stopOpacity="0.4" />
        <stop offset="100%" stopColor="#063F39" stopOpacity="0" />
      </radialGradient>
      <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="6" result="blur" />
        <feComposite in="SourceGraphic" in2="blur" operator="over" />
      </filter>
    </defs>

    {/* Ambient Glow */}
    <ellipse cx="210" cy="150" rx="150" ry="90" fill="url(#phoneGlow)" />

    {/* Cozy Curved Sofa / Pod */}
    <path
      d="M50 200 C50 140 100 120 210 120 C320 120 370 140 370 200 C370 240 330 250 210 250 C90 250 50 240 50 200 Z"
      fill="url(#sofaGrad)"
      stroke="#17675C"
      strokeWidth="2.5"
    />
    <path
      d="M70 195 C90 170 140 160 210 160 C280 160 330 170 350 195"
      stroke="#17675C"
      strokeWidth="2"
      strokeLinecap="round"
      opacity="0.6"
    />

    {/* Floating Decorative Hearts & Stars */}
    <g filter="url(#softGlow)">
      <path
        d="M210 50 C210 40 220 32 230 40 C240 48 230 62 210 75 C190 62 180 48 190 40 C200 32 210 40 210 50 Z"
        fill="#F16D7A"
      />
      <circle cx="130" cy="70" r="3" fill="#FFD15C" />
      <polygon points="290,65 293,72 300,74 294,79 296,86 290,82 284,86 286,79 280,74 287,72" fill="#FFD15C" />
      <circle cx="310" cy="100" r="2.5" fill="#BBD9D2" />
      <path
        d="M110 110 C110 105 116 100 121 105 C126 110 121 117 110 124 C99 117 94 110 99 105 C104 100 110 105 110 110 Z"
        fill="#F16D7A"
        opacity="0.8"
      />
    </g>

    {/* Partner 1 (Left - Teal Pullover with soft hair) */}
    <g transform="translate(10, 0)">
      {/* Body / Sweater */}
      <path
        d="M130 230 C130 170 160 160 180 165 C190 170 195 190 190 230 Z"
        fill="#17675C"
      />
      {/* Head */}
      <circle cx="155" cy="130" r="24" fill="#FAD4C0" />
      {/* Hair (Wavy / Dark) */}
      <path
        d="M132 135 C130 110 145 102 165 106 C178 108 182 120 178 135 C172 120 160 116 145 120 Z"
        fill="#073630"
      />
      {/* Happy closed-eye smile */}
      <path d="M152 132 Q158 136 164 132" stroke="#073630" strokeWidth="2" strokeLinecap="round" />
      <ellipse cx="148" cy="138" rx="3" ry="1.5" fill="#F16D7A" opacity="0.6" />
      {/* Arm leaning towards phone */}
      <path
        d="M175 180 C185 185 200 185 205 182"
        stroke="#FAD4C0"
        strokeWidth="10"
        strokeLinecap="round"
      />
    </g>

    {/* Partner 2 (Right - Warm Coral/Amber Outfit) */}
    <g transform="translate(-10, 0)">
      {/* Body */}
      <path
        d="M290 230 C290 170 260 160 240 165 C230 170 225 190 230 230 Z"
        fill="#0E453E"
      />
      {/* Head */}
      <circle cx="265" cy="128" r="24" fill="#FAD4C0" />
      {/* Hair / Bun (Amber/Brown) */}
      <circle cx="276" cy="104" r="10" fill="#EAB83F" />
      <path
        d="M245 132 C242 110 260 102 278 106 C288 112 290 124 286 136 C282 120 270 116 255 120 Z"
        fill="#EAB83F"
      />
      {/* Happy smile */}
      <path d="M256 132 Q262 136 268 132" stroke="#073630" strokeWidth="2" strokeLinecap="round" />
      <ellipse cx="272" cy="138" rx="3" ry="1.5" fill="#F16D7A" opacity="0.6" />
      {/* Arm holding phone */}
      <path
        d="M245 180 C235 185 220 185 215 182"
        stroke="#FAD4C0"
        strokeWidth="10"
        strokeLinecap="round"
      />
    </g>

    {/* Glowing Smartphone in Center (Held together) */}
    <g transform="translate(195, 160)">
      {/* Phone Case */}
      <rect
        x="0"
        y="0"
        width="30"
        height="50"
        rx="6"
        fill="#073630"
        stroke="#FFD15C"
        strokeWidth="2"
      />
      {/* Screen with heart */}
      <rect x="3" y="4" width="24" height="42" rx="4" fill="#104B43" />
      <path
        d="M15 20 C15 17 18 14 21 17 C24 20 21 24 15 28 C9 24 6 20 9 17 C12 14 15 17 15 20 Z"
        fill="url(#goldGleam)"
      />
      {/* Mini score bars */}
      <rect x="7" y="32" width="7" height="3" rx="1.5" fill="#F16D7A" />
      <rect x="16" y="32" width="7" height="3" rx="1.5" fill="#FFD15C" />
      <circle cx="15" cy="40" r="1.5" fill="#BBD9D2" />
    </g>

    {/* Sparkles radiating from phone */}
    <g filter="url(#softGlow)">
      <polygon points="185,150 187,154 192,155 188,158 189,163 185,160 181,163 182,158 178,155 183,154" fill="#FFD15C" />
      <polygon points="235,150 237,154 242,155 238,158 239,163 235,160 231,163 232,158 228,155 233,154" fill="#FFD15C" />
    </g>
  </svg>
);

/**
 * Thumbnail illustration for Quanto Você Me Conhece
 */
export const CardConheceIllustration: React.FC<{ className?: string }> = ({ className = 'w-12 h-12' }) => (
  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <circle cx="32" cy="32" r="30" fill="#104B43" stroke="#17675C" strokeWidth="2" />
    <path
      d="M32 46 C32 46 16 36 16 26 C16 20 21 16 27 16 C30 16 32 18 32 20 C32 18 34 16 37 16 C43 16 48 20 48 26 C48 36 32 46 32 46 Z"
      fill="#F16D7A"
    />
    <path
      d="M32 22 C30 22 28.5 23 28.5 25 C28.5 27 32 28 32 30"
      stroke="#FFFDF7"
      strokeWidth="2.5"
      strokeLinecap="round"
    />
    <circle cx="32" cy="35" r="1.5" fill="#FFFDF7" />
  </svg>
);

/**
 * Thumbnail illustration for Duelo de Casais
 */
export const CardDueloIllustration: React.FC<{ className?: string }> = ({ className = 'w-12 h-12' }) => (
  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <circle cx="32" cy="32" r="30" fill="#104B43" stroke="#17675C" strokeWidth="2" />
    <path
      d="M20 26 L30 36 M30 26 L20 36"
      stroke="#FFD15C"
      strokeWidth="3.5"
      strokeLinecap="round"
    />
    <polygon points="42,20 46,28 54,28 48,34 50,42 42,37 34,42 36,34 30,28 38,28" fill="#F16D7A" />
    <circle cx="42" cy="31" r="2" fill="#FFFDF7" />
  </svg>
);

/**
 * Thumbnail illustration for E Se Nós Dois
 */
export const CardESeIllustration: React.FC<{ className?: string }> = ({ className = 'w-12 h-12' }) => (
  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <circle cx="32" cy="32" r="30" fill="#104B43" stroke="#17675C" strokeWidth="2" />
    <path
      d="M20 42 C20 32 28 26 32 26 C36 26 44 32 44 42"
      stroke="#BBD9D2"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeDasharray="3 3"
    />
    <polygon points="32,15 35,22 43,24 37,29 39,37 32,33 25,37 27,29 21,24 29,22" fill="#FFD15C" />
    <circle cx="20" cy="42" r="4" fill="#F16D7A" />
    <circle cx="44" cy="42" r="4" fill="#FFD15C" />
  </svg>
);

/**
 * Thumbnail illustration for Vida Real
 */
export const CardVidaRealIllustration: React.FC<{ className?: string }> = ({ className = 'w-12 h-12' }) => (
  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <circle cx="32" cy="32" r="30" fill="#104B43" stroke="#17675C" strokeWidth="2" />
    <circle cx="32" cy="32" r="16" stroke="#FFD15C" strokeWidth="2.5" />
    <path d="M32 22 V32 L38 35" stroke="#FFD15C" strokeWidth="2.5" strokeLinecap="round" />
    <path
      d="M44 18 C44 18 41 15 38 18 C35 21 38 24 44 28 C50 24 53 21 50 18 C47 15 44 18 44 18 Z"
      fill="#F16D7A"
    />
  </svg>
);

/**
 * Thumbnail illustration for Jogos de Tabuleiro / Presenciais
 */
export const CardBoardGamesIllustration: React.FC<{ className?: string }> = ({ className = 'w-12 h-12' }) => (
  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <circle cx="32" cy="32" r="30" fill="#104B43" stroke="#17675C" strokeWidth="2" />
    {/* Die 1 */}
    <rect x="18" y="24" width="18" height="18" rx="4" fill="#082F2B" stroke="#FFD15C" strokeWidth="2" />
    <circle cx="23" cy="29" r="1.5" fill="#FFD15C" />
    <circle cx="31" cy="37" r="1.5" fill="#FFD15C" />
    <circle cx="27" cy="33" r="1.5" fill="#F16D7A" />
    {/* Pawn token */}
    <path
      d="M42 22 C44 22 46 24 46 26 C46 28 44 29 42 29 C40 29 38 28 38 26 C38 24 40 22 42 22 Z M42 29 C45 32 46 38 48 42 H36 C38 38 39 32 42 29 Z"
      fill="#FFD15C"
    />
  </svg>
);
