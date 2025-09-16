export type ItemType = "url" | "app";

export interface Item {
  id: string;
  type: ItemType;
  value: string; // url o nombre/ruta/id de app
}

export interface Profile {
  id: string;
  name: string;
  icon?: string; // Nombre del icono de Lucide
  items: Item[];
}
