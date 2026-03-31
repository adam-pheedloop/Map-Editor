import { useState, useEffect } from "react";
import { PiCaretUp, PiCaretDown } from "react-icons/pi";

interface NumberInputProps {
  value: number;
  onChange: (value: number) => void;
  disabled?: boolean;
  step?: number;
}

export function NumberInput({ value, onChange, disabled, step = 1 }: NumberInputProps) {
  const [localValue, setLocalValue] = useState(String(Math.round(value)));

  useEffect(() => {
    setLocalValue(String(Math.round(value)));
  }, [value]);

  const commit = () => {
    const parsed = Number(localValue);
    if (!isNaN(parsed) && localValue.trim() !== "") {
      onChange(parsed);
    } else {
      setLocalValue(String(Math.round(value)));
    }
  };

  const increment = () => {
    const next = Math.round(value) + step;
    onChange(next);
  };

  const decrement = () => {
    const next = Math.round(value) - step;
    onChange(next);
  };

  return (
    <div className="flex items-stretch">
      <input
        type="number"
        value={localValue}
        onChange={(e) => setLocalValue(e.target.value)}
        onBlur={commit}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            commit();
            (e.target as HTMLInputElement).blur();
          }
        }}
        disabled={disabled}
        className="w-full px-2 py-1 text-xs border border-gray-200 rounded-l bg-white disabled:bg-gray-50 disabled:text-gray-400 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
      />
      {!disabled && (
        <div className="flex flex-col border border-l-0 border-gray-200 rounded-r overflow-hidden">
          <button
            type="button"
            onClick={increment}
            className="flex items-center justify-center px-1 h-1/2 hover:bg-gray-100 cursor-pointer text-gray-400 hover:text-gray-600 transition-colors"
            tabIndex={-1}
          >
            <PiCaretUp size={10} />
          </button>
          <button
            type="button"
            onClick={decrement}
            className="flex items-center justify-center px-1 h-1/2 border-t border-gray-200 hover:bg-gray-100 cursor-pointer text-gray-400 hover:text-gray-600 transition-colors"
            tabIndex={-1}
          >
            <PiCaretDown size={10} />
          </button>
        </div>
      )}
    </div>
  );
}
