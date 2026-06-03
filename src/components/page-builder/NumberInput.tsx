import * as React from "react";
import { Input } from "@/components/ui/input";

interface NumberInputProps {
  value?: number;
  onChange: (value: number | undefined) => void;
  min?: number;
  max?: number;
  placeholder?: string;
  className?: string;
}

export const NumberInput = ({ value, onChange, min, max, placeholder, className }: NumberInputProps) => {
  const [raw, setRaw] = React.useState<string>(value !== undefined ? String(value) : "");

  React.useEffect(() => {
    setRaw(value !== undefined ? String(value) : "");
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value;
    if (v === "" || /^-?\d*$/.test(v)) {
      setRaw(v);
    }
  };

  const handleBlur = () => {
    if (raw === "" || raw === "-") {
      onChange(undefined);
      return;
    }
    let num = Number(raw);
    if (!Number.isFinite(num)) num = 0;
    if (min !== undefined) num = Math.max(min, num);
    if (max !== undefined) num = Math.min(max, num);
    onChange(num);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      (e.target as HTMLInputElement).blur();
    }
  };

  return (
    <Input
      type="text"
      inputMode={min !== undefined && min >= 0 ? "numeric" : "decimal"}
      value={raw}
      onChange={handleChange}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
      placeholder={placeholder}
      className={className}
    />
  );
};
