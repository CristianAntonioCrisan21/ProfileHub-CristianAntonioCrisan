"use client";

import { useState } from "react";
import type { ItemType } from "@/types/profile";

export function AddItemForm({ onAdd }: { onAdd: (type: ItemType, value: string) => void }) {
  const [type, setType] = useState<ItemType>("url");
  const [value, setValue] = useState<string>("");

  return (
    <div className="flex flex-wrap items-center gap-2">
      <select
        className="px-3 py-2 rounded border border-gray-300"
        value={type}
        onChange={(e) => setType(e.target.value as ItemType)}
      >
        <option value="url">URL</option>
        <option value="app">APP</option>
      </select>

      <input
        className="px-3 py-2 rounded border border-gray-300 flex-1"
        placeholder={
          type === "url"
            ? "https://..., slack://..., zoommtg://..."
            : "/System/Applications/Calculator.app | Calculator | id:com.apple.calculator"
        }
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && value && (onAdd(type, value), setValue(""))}
      />

      <button
        className="px-3 py-2 rounded bg-black text-white"
        onClick={() => value && (onAdd(type, value), setValue(""))}
      >
        Añadir
      </button>
    </div>
  );
}
