"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import type { Profile, Item, ItemType } from "@/types/profile";
import { loadProfiles, saveProfiles } from "@/lib/storage";
import { ProfileList } from "./profileList";
import { NewProfileForm } from "./newProfileForm";
import { AddItemForm } from "./addItemForm";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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
  const addProfile = useCallback((name: string, icon: string) => {
    const n = name.trim();
    if (!n) return;
    const p: Profile = { id: crypto.randomUUID(), name: n, icon, items: [] };
    setProfiles((ps) => [...ps, p]);
    setCurrentId(p.id);
  }, []);

  const renameProfile = useCallback((id: string, name: string) => {
    setProfiles((ps) => ps.map((p) => (p.id === id ? { ...p, name } : p)));
  }, []);

  const deleteProfile = useCallback(
    (id: string) => {
      setProfiles((ps) => ps.filter((p) => p.id !== id));
      if (currentId === id) setCurrentId(null);
    },
    [currentId]
  );

  // CRUD items
  const addItem = useCallback(
    (type: ItemType, value: string) => {
      if (!current) return;
      const v = value.trim();
      if (!v) return;
      const item: Item = { id: crypto.randomUUID(), type, value: v };
      setProfiles((ps) =>
        ps.map((p) =>
          p.id === current.id ? { ...p, items: [...p.items, item] } : p
        )
      );
    },
    [current]
  );

  const removeItem = useCallback(
    (itemId: string) => {
      if (!current) return;
      setProfiles((ps) =>
        ps.map((p) =>
          p.id === current.id
            ? { ...p, items: p.items.filter((i) => i.id !== itemId) }
            : p
        )
      );
    },
    [current]
  );

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
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">ProfileHub</h1>
        <div className="flex items-center gap-2">
          <ThemeToggle />
        </div>
      </div>

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
            <Card className="p-6 text-center text-gray-500">
              Crea o selecciona un perfil 👈
            </Card>
          ) : (
            <Card className="p-4 space-y-4">
              {/* Header perfil */}
              <div className="flex flex-wrap items-center gap-2">
                <input
                  className="px-3 py-2 rounded border border-gray-300 flex-1 min-w-40"
                  value={current.name}
                  onChange={(e) => renameProfile(current.id, e.target.value)}
                />
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button onClick={() => openProfile(current)}>
                      Abrir perfil
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Abrir todas las aplicaciones y URLs de este perfil</p>
                  </TooltipContent>
                </Tooltip>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive">Borrar perfil</Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Esta acción no se puede deshacer. El perfil y todos sus
                        elementos serán eliminados permanentemente.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => deleteProfile(current.id)}
                      >
                        Eliminar
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>

              {/* Añadir item */}
              <AddItemForm onAdd={addItem} />

              {/* Lista items */}
              <ul className="space-y-2">
                {current.items.map((it) => (
                  <li key={it.id} className="flex items-center gap-2">
                    <span
                      className={`text-xs px-2 py-1 rounded ${
                        it.type === "url"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {it.type.toUpperCase()}
                    </span>
                    <code className="flex-1 truncate">{it.value}</code>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => openItem(it)}
                        >
                          Probar
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Abrir este elemento</p>
                      </TooltipContent>
                    </Tooltip>

                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button size="sm" variant="destructive">
                          Eliminar
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Esta acción no se puede deshacer. El elemento será
                            eliminado permanentemente.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction onClick={() => removeItem(it.id)}>
                            Eliminar
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </li>
                ))}
                {current.items.length === 0 && (
                  <li className="text-sm text-gray-500">
                    Aún no hay elementos en este perfil.
                  </li>
                )}
              </ul>
            </Card>
          )}
        </main>
      </div>
    </div>
  );
}
