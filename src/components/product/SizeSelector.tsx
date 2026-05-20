"use client";

import { cn } from "@/lib/utils";

export function SizeSelector({
  options,
  value,
  onChange,
}: {
  options: string[];
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((option) => (
        <button
          key={option}
          type="button"
          className={cn(
            "rounded-full border px-4 py-2 text-sm",
            value === option ? "border-primary bg-primary text-white" : "border-border bg-white"
          )}
          onClick={() => onChange(option)}
        >
          {option}
        </button>
      ))}
    </div>
  );
}
