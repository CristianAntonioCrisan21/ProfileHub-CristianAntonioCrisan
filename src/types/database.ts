import type { Profile, Item } from './profile';

// Tipos para la base de datos de Supabase
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          name: string;
          icon?: string;
          items: Item[];
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          name: string;
          icon?: string;
          items: Item[];
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          icon?: string;
          items?: Item[];
          updated_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}

// Tipos de conveniencia para trabajar con las tablas
export type ProfileRow = Database['public']['Tables']['profiles']['Row'];
export type ProfileInsert = Database['public']['Tables']['profiles']['Insert'];
export type ProfileUpdate = Database['public']['Tables']['profiles']['Update'];

// Función para convertir de ProfileRow a Profile (frontend)
export function profileRowToProfile(row: ProfileRow): Profile {
  return {
    id: row.id,
    name: row.name,
    icon: row.icon,
    items: row.items
  };
}

// Función para convertir de Profile a ProfileInsert (para insertar en DB)
export function profileToProfileInsert(profile: Profile): ProfileInsert {
  return {
    id: profile.id,
    name: profile.name,
    icon: profile.icon,
    items: profile.items,
    updated_at: new Date().toISOString()
  };
}
