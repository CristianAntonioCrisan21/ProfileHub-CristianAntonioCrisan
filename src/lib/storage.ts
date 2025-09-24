
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://bwqpzmipbevwtwcklwso.supabase.co'
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_KEY

if (!supabaseKey) {
  console.warn('Supabase key not found. Database operations will not work.');
}

const supabase = createClient(supabaseUrl, supabaseKey || '')

import type { Profile } from "@/types/profile";

const KEY = "workprofiles:data:v1";

export function loadProfiles(): Profile[] {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem(KEY);
  if (!raw) {
    const demo: Profile[] = [
      {
        id: crypto.randomUUID(),
        name: "Trading",
        items: [
          { id: crypto.randomUUID(), type: "url", value: "https://www.tradingview.com/" },
          { id: crypto.randomUUID(), type: "app", value: "/System/Applications/Calculator.app" }
        ]
      }
    ];
    localStorage.setItem(KEY, JSON.stringify(demo));
    return demo;
  }
  try {
    return JSON.parse(raw) as Profile[];
  } catch {
    return [];
  }
}

export function saveProfiles(profiles: Profile[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(profiles));
}

// Funciones para operaciones con Supabase
export async function saveProfilesToSupabase(profiles: Profile[]) {
  if (!supabaseKey) {
    console.warn('Supabase not configured. Falling back to localStorage.');
    return saveProfiles(profiles);
  }

  try {
    const { data, error } = await supabase
      .from('profiles')
      .upsert(profiles.map(profile => ({
        id: profile.id,
        name: profile.name,
        icon: profile.icon,
        items: profile.items,
        updated_at: new Date().toISOString()
      })));

    if (error) {
      console.error('Error saving to Supabase:', error);
      // Fallback to localStorage
      saveProfiles(profiles);
      return;
    }

    console.log('Profiles saved to Supabase successfully');
    return data;
  } catch (error) {
    console.error('Error connecting to Supabase:', error);
    // Fallback to localStorage
    saveProfiles(profiles);
  }
}

export async function loadProfilesFromSupabase(): Promise<Profile[]> {
  if (!supabaseKey) {
    console.warn('Supabase not configured. Using localStorage.');
    return loadProfiles();
  }

  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('updated_at', { ascending: false });

    if (error) {
      console.error('Error loading from Supabase:', error);
      // Fallback to localStorage
      return loadProfiles();
    }

    if (data && data.length > 0) {
      // Save to localStorage as backup
      const profiles: Profile[] = data.map((item: Record<string, unknown>) => ({
        id: item.id as string,
        name: item.name as string,
        icon: item.icon as string | undefined,
        items: item.items as Profile['items']
      }));
      saveProfiles(profiles);
      return profiles;
    }

    // If no data in Supabase, use localStorage
    return loadProfiles();
  } catch (error) {
    console.error('Error connecting to Supabase:', error);
    // Fallback to localStorage
    return loadProfiles();
  }
}

// Función para sincronizar datos entre localStorage y Supabase
export async function syncProfiles(): Promise<Profile[]> {
  const localProfiles = loadProfiles();
  
  if (!supabaseKey) {
    return localProfiles;
  }

  try {
    // Intentar cargar desde Supabase
    const supabaseProfiles = await loadProfilesFromSupabase();
    
    // Si hay datos en Supabase, usarlos
    if (supabaseProfiles.length > 0) {
      return supabaseProfiles;
    }
    
    // Si no hay datos en Supabase pero sí en local, subirlos
    if (localProfiles.length > 0) {
      await saveProfilesToSupabase(localProfiles);
    }
    
    return localProfiles;
  } catch (error) {
    console.error('Error syncing profiles:', error);
    return localProfiles;
  }
}

// Exportar el cliente de Supabase para uso directo si es necesario
export { supabase };
