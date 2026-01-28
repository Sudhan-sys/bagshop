'use client';

import React from 'react';
import '@/styles/components/bag-loader.css';

/**
 * BagLoader Component
 * 
 * A premium, custom-branded loading animation representing a shopping bag.
 * features:
 * - Bouncing animation
 * - Fluid fill-up progress
 * - Dynamic handle sway
 * - Premium accessibility support
 * 
 * @param {Object} props
 * @param {string} props.text - Custom loading text (default: "Packing your bag...")
 * @param {boolean} props.fullScreen - Whether to fill the viewport (default: false, but CSS handles this mostly)
 */
export default function BagLoader({ text = "Packing your bag..." }) {
  return (
    <div 
      className="bag-loader-container"
      role="status"
      aria-label="Loading content"
    >
      <div className="bag-loader-icon">
        <svg 
          className="bag-svg"
          viewBox="0 0 64 64" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Defs for reusability */}
          <defs>
            <path 
              id="bag-shape" 
              d="M16 22H48V52C48 54.2091 46.2091 56 44 56H20C17.7909 56 16 54.2091 16 52V22Z" 
            />
            <element id="bag-mask-path">
                 <path d="M16 22H48V52C48 54.2091 46.2091 56 44 56H20C17.7909 56 16 54.2091 16 52V22Z" fill="white" />
            </element>
          </defs>

          {/* FILLING ANIMATION */}
          <mask id="bag-mask-fill">
            <path d="M16 22H48V52C48 54.2091 46.2091 56 44 56H20C17.7909 56 16 54.2091 16 52V22Z" fill="white" />
          </mask>
          
          <rect 
            x="16" 
            y="22" 
            width="32" 
            height="34" 
            className="bag-fill-rect" 
            mask="url(#bag-mask-fill)"
          />

          {/* BAG BODY OUTLINE */}
          <path 
            d="M16 22H48V52C48 54.2091 46.2091 56 44 56H20C17.7909 56 16 54.2091 16 52V22Z" 
            className="bag-body-outline"
          />

          {/* HANDLE (ANIMATED) */}
          <g className="bag-handle-group">
            <path 
              d="M24 22V16C24 11.5817 27.5817 8 32 8C36.4183 8 40 11.5817 40 16V22" 
              className="bag-handle" 
            />
          </g>

          {/* PREMIUM SHINE/HIGHLIGHT */}
          <path 
            d="M44 26L44 34" 
            className="bag-shine"
          />
        </svg>
      </div>

      {text && (
        <p className="bag-loader-text">
          {text}
        </p>
      )}
    </div>
  );
}
