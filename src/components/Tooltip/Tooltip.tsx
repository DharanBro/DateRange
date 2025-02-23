import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import './Tooltip.css';

export type TooltipPosition = 'top' | 'bottom' | 'left' | 'right';

interface TooltipProps {
  content: React.ReactNode;
  position?: TooltipPosition;
  children: React.ReactElement;
  className?: string;
  fullWidth?: boolean;
  fullHeight?: boolean;
}

export const Tooltip: React.FC<TooltipProps> = ({
  content,
  position = 'top',
  children,
  className = '',
  fullWidth = false,
  fullHeight = false,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updatePosition = () => {
      if (isVisible && wrapperRef.current) {
        const childRect = wrapperRef.current.getBoundingClientRect();
        const tooltipElement = document.querySelector('.tooltip') as HTMLElement;
        
        if (tooltipElement) {
          const tooltipRect = tooltipElement.getBoundingClientRect();
          const spacing = 8;
          const offset = 4;

          const positions = {
            top: {
              top: childRect.top - tooltipRect.height - spacing + window.scrollY - offset,
              left: childRect.left + (childRect.width - tooltipRect.width) / 2 + window.scrollX,
            },
            bottom: {
              top: childRect.bottom + spacing + window.scrollY + offset,
              left: childRect.left + (childRect.width - tooltipRect.width) / 2 + window.scrollX,
            },
            left: {
              top: childRect.top + (childRect.height - tooltipRect.height) / 2 + window.scrollY,
              left: childRect.left - tooltipRect.width - spacing + window.scrollX - offset,
            },
            right: {
              top: childRect.top + (childRect.height - tooltipRect.height) / 2 + window.scrollY,
              left: childRect.right + spacing + window.scrollX + offset,
            },
          };

          setCoords(positions[position]);
        }
      }
    };

    updatePosition();

    window.addEventListener('scroll', updatePosition);
    window.addEventListener('resize', updatePosition);

    return () => {
      window.removeEventListener('scroll', updatePosition);
      window.removeEventListener('resize', updatePosition);
    };
  }, [isVisible, position]);

  if (!content) {
    return <>{children}</>;
  }

  const wrapperClassName = [
    'tooltip-wrapper',
    fullWidth ? 'tooltip-full-width' : '',
    fullHeight ? 'tooltip-full-height' : '',
  ].filter(Boolean).join(' ');

  return (
    <div 
      role='tooltip'
      ref={wrapperRef}
      onMouseEnter={() => {
        setIsVisible(true);
      }}
      onMouseLeave={() => {
        setIsVisible(false);
      }}
      className={wrapperClassName}
    >
      {children}
      {isVisible && createPortal(
        <div
          className={`tooltip tooltip-${position} ${className}`}
          style={{
            top: coords.top,
            left: coords.left,
          }}
        >
          {content}
        </div>,
        document.body
      )}
    </div>
  );
}; 