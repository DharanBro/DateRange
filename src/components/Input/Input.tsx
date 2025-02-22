import React from "react";
import { XIcon } from "lucide-react";
import { cn } from "../../utils/cn";

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
      <div className={cn("relative flex items-center w-full", containerClassName)}>
        {icon && (
          <div className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
            {icon}
          </div>
        )}
        <input
          ref={ref}
          value={value}
          onChange={onChange}
          className={cn(
            "w-full rounded-md border border-gray-200 bg-white px-3 py-1.5 text-sm text-gray-900 placeholder:text-gray-400",
            "focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/20",
            icon && "pl-8",
            clearable && "pr-8",
            className
          )}
          {...props}
        />
        {clearable && value && (
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center">
            <button
              type="button"
              onClick={handleClear}
              className="flex items-center justify-center text-gray-400 hover:text-gray-600 focus:outline-none focus:text-gray-600"
            >
              <XIcon className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    );
  }
);

Input.displayName = "Input"; 