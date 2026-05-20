"use client";

import { cn } from "@/lib/utils";

export function ColorSelector({
  options,
  value,
  onChange,
}: {
  options: Array<{ label: string; hex: string }>;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-3">
      {options.map((option) => (
        <button
          key={option.label}
          type="button"
          className={cn(
            "flex items-center gap-2 rounded-full border px-3 py-2 text-sm",
            value === option.label ? "border-primary" : "border-border"
          )}
          onClick={() => onChange(option.label)}
        >
          <span
            className="h-4 w-4 rounded-full border border-black/10"
            style={{ backgroundColor: option.hex }}
          />
          {option.label}
        </button>
      ))}
    </div>
  );
}
