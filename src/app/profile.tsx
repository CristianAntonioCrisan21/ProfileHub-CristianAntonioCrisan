"use client";

import type { Profile, Item } from "@/types/profile";
import { AddItemForm } from "./addItemForm";

export function ProfileDetail({
  profile,
  onRename,
  onDelete,
  onAddItem,
  onRemoveItem,
  onOpenItem,
  onOpenProfile,
}: {
  profile: Profile;
  onRename: (id: string, name: string) => void;
  onDelete: (id: string) => void;
  onAddItem: (type: "url" | "app", value: string) => void;
  onRemoveItem: (itemId: string) => void;
  onOpenItem: (item: Item) => void;
  onOpenProfile: (profile: Profile) => void;
}) {
  return (
    <div className="space-y-4">
      {/* Header perfil */}
      <div className="flex flex-wrap items-center gap-2">
        <input
          className="px-3 py-2 rounded border border-gray-300 flex-1 min-w-40"
          value={profile.name}
          onChange={(e) => onRename(profile.id, e.target.value)}
        />
        <button
          className="px-3 py-2 rounded bg-black text-white"
          onClick={() => onOpenProfile(profile)}
        >
          Abrir perfil
        </button>
        <button
          className="px-3 py-2 rounded border border-red-300 text-red-600"
          onClick={() => onDelete(profile.id)}
        >
          Borrar perfil
        </button>
      </div>

      {/* Añadir item */}
      <AddItemForm onAdd={onAddItem} />

      {/* Lista items */}
      <ul className="space-y-2">
        {profile.items.map((it) => (
          <li key={it.id} className="flex items-center gap-2">
            <span className="text-xs px-2 py-1 rounded bg-gray-100">{it.type.toUpperCase()}</span>
            <code className="flex-1 truncate">{it.value}</code>
            <button className="px-2 py-1 rounded border" onClick={() => onOpenItem(it)}>
              Probar
            </button>
            <button
              className="px-2 py-1 rounded border border-red-300 text-red-600"
              onClick={() => onRemoveItem(it.id)}
            >
              Eliminar
            </button>
          </li>
        ))}
        {profile.items.length === 0 && (
          <li className="text-sm text-gray-500">Aún no hay elementos en este perfil.</li>
        )}
      </ul>
    </div>
  );
}
