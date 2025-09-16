"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Briefcase,
  Code,
  Coffee,
  Film,
  Gamepad2,
  Globe,
  Home,
  Music,
  Pencil,
  ShoppingCart,
} from "lucide-react";

const PROFILE_ICONS = [
  { value: "briefcase", label: "Trabajo", icon: Briefcase },
  { value: "code", label: "Desarrollo", icon: Code },
  { value: "coffee", label: "Café", icon: Coffee },
  { value: "film", label: "Entretenimiento", icon: Film },
  { value: "gamepad2", label: "Juegos", icon: Gamepad2 },
  { value: "globe", label: "Web", icon: Globe },
  { value: "home", label: "Hogar", icon: Home },
  { value: "music", label: "Música", icon: Music },
  { value: "pencil", label: "Estudio", icon: Pencil },
  { value: "shopping-cart", label: "Compras", icon: ShoppingCart },
];

export function NewProfileForm({
  onCreate,
}: {
  onCreate: (name: string, icon: string) => void;
}) {
  const [name, setName] = useState<string>("");
  const [icon, setIcon] = useState<string>("briefcase");

  const selectedIcon = PROFILE_ICONS.find(i => i.value === icon);

  return (
    <div className="flex flex-col gap-2 w-full max-w-md mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="md:col-span-10">
          <Select value={icon} onValueChange={setIcon}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Icono">
                {selectedIcon && (
                  <div className="flex items-center gap-2">
                    {React.createElement(selectedIcon.icon, { className: "h-4 w-4" })}
                    <span>{selectedIcon.label}</span>
                  </div>
                )}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {PROFILE_ICONS.map((iconOption) => {
                const IconComponent = iconOption.icon;
                return (
                  <SelectItem key={iconOption.value} value={iconOption.value}>
                    <div className="flex items-center gap-2">
                      <IconComponent className="h-4 w-4" />
                      <span>{iconOption.label}</span>
                    </div>
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </div>
        <div className="md:col-span-5">
          <Input
            className="w-full"
            placeholder="Nuevo perfil"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) =>
              e.key === "Enter" &&
              name.trim() &&
              (onCreate(name, icon), setName(""))
            }
          />
        </div>
        <div className="md:col-span-5">
          <Button
            className="w-full"
            onClick={() => name.trim() && (onCreate(name, icon), setName(""))}
          >
            Añadir
          </Button>
        </div>
      </div>
    </div>
  );
}
