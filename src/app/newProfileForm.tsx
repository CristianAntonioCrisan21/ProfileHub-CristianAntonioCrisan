"use client";

import { useState } from "react";

export function NewProfileForm({ onCreate }: { onCreate: (name: string) => void }) {
  const [name, setName] = useState<string>("");

  return (
    <div className="flex gap-2">
      <input
        className="px-3 py-2 rounded border border-gray-300 flex-1"
        placeholder="Nuevo perfil (p. ej. Trading)"
        value={name}
        onChange={(e) => setName(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && (onCreate(name), setName(""))}
      />
      <button
        className="px-3 py-2 rounded bg-black text-white"
        onClick={() => (onCreate(name), setName(""))}
      >
        Añadir
      </button>
    </div>
  );
}
