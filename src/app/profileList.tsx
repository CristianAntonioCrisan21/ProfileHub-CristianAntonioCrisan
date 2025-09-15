"use client";

import type { Profile } from "@/types/profile";

export function ProfileList({
  profiles,
  currentId,
  onSelect,
}: {
  profiles: Profile[];
  currentId: string | null;
  onSelect: (id: string) => void;
}) {
  return (
    <div className="space-y-1">
      {profiles.map((p) => (
        <button
          key={p.id}
          onClick={() => onSelect(p.id)}
          className={`w-full text-left px-3 py-2 rounded border ${
            currentId === p.id
              ? "bg-gray-100 border-gray-300"
              : "border-gray-200 hover:bg-gray-50"
          }`}
        >
          {p.name}
        </button>
      ))}
    </div>
  );
}
