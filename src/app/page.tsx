"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import type { Profile, Item, ItemType } from "@/types/profile";
import { loadProfiles, saveProfiles } from "@/lib/storage";

import { ProfileList } from "./profileList";
import { NewProfileForm } from "./newProfileForm";
import { AddItemForm } from "./addItemForm";

export default function Home() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [currentId, setCurrentId] = useState<string | null>(null);

  const current = useMemo(
    () => profiles.find((p) => p.id === currentId) ?? null,
    [profiles, currentId]
  );

  useEffect(() => {
    const data = loadProfiles();
    setProfiles(data);
    setCurrentId(data[0]?.id ?? null);
  }, []);

  useEffect(() => {
    saveProfiles(profiles);
  }, [profiles]);

  // CRUD perfiles
  const addProfile = useCallback((name: string) => {
    const n = name.trim();
    if (!n) return;
    const p: Profile = { id: crypto.randomUUID(), name: n, items: [] };
    setProfiles((ps) => [...ps, p]);
    setCurrentId(p.id);
  }, []);

  const renameProfile = useCallback((id: string, name: string) => {
    setProfiles((ps) => ps.map((p) => (p.id === id ? { ...p, name } : p)));
  }, []);

  const deleteProfile = useCallback((id: string) => {
    setProfiles((ps) => ps.filter((p) => p.id !== id));
    if (currentId === id) setCurrentId(null);
  }, [currentId]);

  // CRUD items
  const addItem = useCallback((type: ItemType, value: string) => {
    if (!current) return;
    const v = value.trim();
    if (!v) return;
    const item: Item = { id: crypto.randomUUID(), type, value: v };
    setProfiles((ps) =>
      ps.map((p) => (p.id === current.id ? { ...p, items: [...p.items, item] } : p))
    );
  }, [current]);

  const removeItem = useCallback((itemId: string) => {
    if (!current) return;
    setProfiles((ps) =>
      ps.map((p) =>
        p.id === current.id ? { ...p, items: p.items.filter((i) => i.id !== itemId) } : p
      )
    );
  }, [current]);

  // Abrir un item
  const openItem = useCallback(async (it: Item) => {
    if (it.type === "url") {
      await window.native?.openUrl(it.value);
    } else {
      await window.native?.openApp(it.value);
    }
  }, []);

  // Abrir todo el perfil
  const openProfile = useCallback(async (p: Profile) => {
    const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));
    for (const it of p.items) {
      if (it.type === "url") {
        await window.native?.openUrl(it.value);
      } else {
        await window.native?.openApp(it.value);
      }
      await delay(120);
    }
  }, []);

  return (
    <div className="mx-auto max-w-6xl p-6 space-y-6">
      <h1 className="text-2xl font-semibold">WorkProfiles</h1>

      <div className="grid grid-cols-12 gap-6">
        {/* Sidebar */}
        <aside className="col-span-12 md:col-span-3 space-y-3">
          <NewProfileForm onCreate={addProfile} />
          <ProfileList
            profiles={profiles}
            currentId={currentId}
            onSelect={setCurrentId}
          />
        </aside>

        {/* Detalle */}
        <main className="col-span-12 md:col-span-9 space-y-4">
          {!current ? (
            <div className="p-6 rounded border border-gray-200">
              Crea o selecciona un perfil 👈
            </div>
          ) : (
            <div className="space-y-4">
              {/* Header perfil */}
              <div className="flex flex-wrap items-center gap-2">
                <input
                  className="px-3 py-2 rounded border border-gray-300 flex-1 min-w-40"
                  value={current.name}
                  onChange={(e) => renameProfile(current.id, e.target.value)}
                />
                <button
                  className="px-3 py-2 rounded bg-black text-white"
                  onClick={() => openProfile(current)}
                >
                  Abrir perfil
                </button>
                <button
                  className="px-3 py-2 rounded border border-red-300 text-red-600"
                  onClick={() => deleteProfile(current.id)}
                >
                  Borrar perfil
                </button>
              </div>

              {/* Añadir item */}
              <AddItemForm onAdd={addItem} />

              {/* Lista items */}
              <ul className="space-y-2">
                {current.items.map((it) => (
                  <li key={it.id} className="flex items-center gap-2">
                    <span className="text-xs px-2 py-1 rounded bg-gray-100">{it.type.toUpperCase()}</span>
                    <code className="flex-1 truncate">{it.value}</code>
                    <button className="px-2 py-1 rounded border" onClick={() => openItem(it)}>
                      Probar
                    </button>
                    <button
                      className="px-2 py-1 rounded border border-red-300 text-red-600"
                      onClick={() => removeItem(it.id)}
                    >
                      Eliminar
                    </button>
                  </li>
                ))}
                {current.items.length === 0 && (
                  <li className="text-sm text-gray-500">Aún no hay elementos en este perfil.</li>
                )}
              </ul>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
