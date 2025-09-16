"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export function AddItemForm({
  onAdd,
}: {
  onAdd: (type: "url" | "app", value: string) => void;
}) {
  const [type, setType] = useState<"url" | "app">("url");
  const [value, setValue] = useState("");

  const handleSubmit = () => {
    const v = value.trim();
    if (!v) return;
    onAdd(type, v);
    setValue("");
  };

  const handleSelectApp = async () => {
    if (type !== "app") return;
    try {
      const selectedPath = await window.native?.selectApp();
      if (selectedPath) {
        setValue(selectedPath);
      }
    } catch (error) {
      console.error("Error selecting app:", error);
    }
  };

  return (
    <TooltipProvider>
      <div className="flex flex-col gap-2">
        <div className="flex gap-2">
          <div className="flex rounded-md overflow-hidden">
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  className={`px-3 py-2 ${
                    type === "url"
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 text-gray-700"
                  }`}
                  onClick={() => setType("url")}
                >
                  URL
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Añadir una dirección web</p>
              </TooltipContent>
            </Tooltip>
            
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  className={`px-3 py-2 ${
                    type === "app"
                      ? "bg-green-500 text-white"
                      : "bg-gray-200 text-gray-700"
                  }`}
                  onClick={() => setType("app")}
                >
                  App
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Añadir una aplicación local</p>
              </TooltipContent>
            </Tooltip>
          </div>
          <Input
            className="flex-1"
            placeholder={
              type === "url"
                ? "URL (p. ej. https://github.com)"
                : "Ruta de aplicación (p. ej. /Applications/Slack.app)"
            }
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          />
          {type === "app" && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" onClick={handleSelectApp}>
                  Buscar
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Abrir Finder para seleccionar una aplicación</p>
              </TooltipContent>
            </Tooltip>
          )}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button onClick={handleSubmit}>Añadir</Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Añadir elemento al perfil</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
    </TooltipProvider>
  );
}
