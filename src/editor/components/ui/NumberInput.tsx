interface NumberInputProps {
  value: number;
  onChange: (value: number) => void;
  disabled?: boolean;
}

export function NumberInput({ value, onChange, disabled }: NumberInputProps) {
  return (
    <input
      type="number"
      value={Math.round(value)}
      onChange={(e) => onChange(Number(e.target.value))}
      disabled={disabled}
      className="w-full px-2 py-1 text-xs border border-gray-200 rounded bg-white disabled:bg-gray-50 disabled:text-gray-400"
    />
  );
}
