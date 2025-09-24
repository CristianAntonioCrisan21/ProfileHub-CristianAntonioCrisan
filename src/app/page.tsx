"use client";

import { useMemo, useState } from "react";
// Tipos importados por los hooks
import { useProfiles } from "@/hooks/useProfiles";
import { useProfileItems } from "@/hooks/useProfileItems";
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
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { SyncIndicator } from "@/components/sync-status";

export default function Home() {
  const [currentId, setCurrentId] = useState<string | null>(null);
  
  const {
    profiles,
    isLoading,
    isSyncing,
    error,
    addProfile: addProfileHook,
    updateProfile,
    deleteProfile: deleteProfileHook
  } = useProfiles();

  const current = useMemo(
    () => profiles.find((p) => p.id === currentId) ?? null,
    [profiles, currentId]
  );
  
  const {
    addItem,
    removeItem,
    openItem,
    openAllItems
  } = useProfileItems({ profile: current, updateProfile });

  // Actualizar currentId cuando se cargan los perfiles
  if (!currentId && profiles.length > 0 && !isLoading) {
    setCurrentId(profiles[0].id);
  }

  // CRUD perfiles
  const addProfile = (name: string, icon: string) => {
    addProfileHook(name, icon);
    // El nuevo perfil se seleccionará automáticamente cuando se actualice la lista
  };

  const renameProfile = (id: string, name: string) => {
    updateProfile(id, { name });
  };

  const deleteProfile = (id: string) => {
    deleteProfileHook(id);
    if (currentId === id) {
      setCurrentId(profiles.length > 1 ? profiles.find(p => p.id !== id)?.id || null : null);
    }
  };

  // Abrir todo el perfil
  const openProfile = () => {
    if (current) {
      openAllItems();
    }
  };

  return (
    <div className="mx-auto max-w-6xl p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">ProfileHub</h1>
        <div className="flex items-center gap-4">
          <SyncIndicator isSyncing={isSyncing} error={error} />
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
          {isLoading ? (
            <Card className="p-6 text-center">
              <div className="flex items-center justify-center gap-2">
                <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                <span>Cargando perfiles...</span>
              </div>
            </Card>
          ) : !current ? (
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
                    <Button onClick={openProfile}>
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
