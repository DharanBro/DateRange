import React from "react";
import { XIcon } from "lucide-react";
import { cn } from "../../utils/cn";
import "./Input.css";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode;
  clearable?: boolean;
  onClear?: () => void;
  containerClassName?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, icon, clearable, onClear, containerClassName, value, onChange, ...props }, ref) => {
    const handleClear = (e: React.MouseEvent) => {
      e.stopPropagation();
      if (onClear) {
        onClear();
      } else if (onChange) {
        const event = {
          target: { value: "" }
        } as React.ChangeEvent<HTMLInputElement>;
        onChange(event);
      }
    };

    return (
      <div className={cn("input-container", containerClassName)}>
        {icon && (
          <div className="input-icon">
            {icon}
          </div>
        )}
        <input
          ref={ref}
          value={value}
          onChange={onChange}
          className={cn(
            "input-base",
            icon && "input-with-icon",
            clearable && "input-with-clear",
            className
          )}
          {...props}
        />
        {clearable && value && (
          <div className="clear-button-container">
            <button
              type="button"
              onClick={handleClear}
              className="clear-button"
            >
              <XIcon className="clear-icon" />
            </button>
          </div>
        )}
      </div>
    );
  }
);

Input.displayName = "Input"; 