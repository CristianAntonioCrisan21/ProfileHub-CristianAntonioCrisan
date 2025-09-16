"use client";

import type { Profile } from "@/types/profile";
import { Card } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
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
  LucideIcon
} from "lucide-react";

const PROFILE_ICONS: Record<string, LucideIcon> = {
  "briefcase": Briefcase,
  "code": Code,
  "coffee": Coffee,
  "film": Film,
  "gamepad2": Gamepad2,
  "globe": Globe,
  "home": Home,
  "music": Music,
  "pencil": Pencil,
  "shopping-cart": ShoppingCart,
};

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
    <TooltipProvider>
      <div className="space-y-2">
        {profiles.map((p) => {
          const IconComponent = p.icon ? PROFILE_ICONS[p.icon] : Briefcase;
          return (
            <Tooltip key={p.id}>
              <TooltipTrigger asChild>
                <Card
                  className={`p-2 cursor-pointer flex items-center gap-2 rounded-lg border ${
                    currentId === p.id
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-muted"
                  }`}
                  onClick={() => onSelect(p.id)}
                  aria-pressed={currentId === p.id}
                >
                  <IconComponent className="h-4 w-4 flex-shrink-0" />
                  <span className="truncate">{p.name}</span>
                </Card>
              </TooltipTrigger>
              <TooltipContent>
                <p>{p.items.length} elementos en este perfil</p>
              </TooltipContent>
            </Tooltip>
          );
        })}
      </div>
    </TooltipProvider>
  );
}
