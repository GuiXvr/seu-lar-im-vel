import { useState, useEffect, useRef } from "react";

interface CurrencyInputProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  step?: number;
  className?: string;
  prefix?: string;
}

function formatBRL(value: number): string {
  return value.toLocaleString("pt-BR", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
}

function parseBRL(str: string): number {
  const cleaned = str.replace(/[^\d]/g, "");
  return Number(cleaned) || 0;
}

export function CurrencyInput({
  value,
  onChange,
  min = 0,
  className = "",
  prefix = "R$ ",
}: CurrencyInputProps) {
  const [display, setDisplay] = useState(prefix + formatBRL(value));
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (document.activeElement !== inputRef.current) {
      setDisplay(prefix + formatBRL(value));
    }
  }, [value, prefix]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    const num = parseBRL(raw);
    setDisplay(prefix + formatBRL(num));
    onChange(Math.max(min, num));
  };

  const handleFocus = () => {
    setDisplay(prefix + formatBRL(value));
  };

  const handleBlur = () => {
    setDisplay(prefix + formatBRL(value));
  };

  return (
    <input
      ref={inputRef}
      type="text"
      inputMode="numeric"
      className={className}
      value={display}
      onChange={handleChange}
      onFocus={handleFocus}
      onBlur={handleBlur}
    />
  );
}
