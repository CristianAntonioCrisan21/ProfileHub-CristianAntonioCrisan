import { useState, useEffect, useCallback } from 'react';
import type { Profile } from '@/types/profile';
import { 
  loadProfiles, 
  saveProfiles, 
  syncProfiles, 
  saveProfilesToSupabase 
} from '@/lib/storage';

interface UseProfilesReturn {
  profiles: Profile[];
  isLoading: boolean;
  isSyncing: boolean;
  error: string | null;
  addProfile: (name: string, icon?: string) => void;
  updateProfile: (id: string, updates: Partial<Profile>) => void;
  deleteProfile: (id: string) => void;
  refreshProfiles: () => Promise<void>;
}

export function useProfiles(): UseProfilesReturn {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Cargar perfiles inicialmente
  const loadInitialProfiles = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const data = await syncProfiles();
      setProfiles(data);
    } catch (err) {
      console.error('Error loading profiles:', err);
      setError('Error al cargar los perfiles');
      // Fallback a localStorage
      const localData = loadProfiles();
      setProfiles(localData);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Guardar perfiles (con sincronización)
  const saveProfilesWithSync = useCallback(async (newProfiles: Profile[]) => {
    if (newProfiles.length === 0 || isLoading) return;
    
    setIsSyncing(true);
    setError(null);
    
    try {
      // Guardar en localStorage inmediatamente
      saveProfiles(newProfiles);
      // Intentar sincronizar con Supabase
      await saveProfilesToSupabase(newProfiles);
    } catch (err) {
      console.error('Error syncing profiles:', err);
      setError('Error al sincronizar con la nube');
      // localStorage ya se guardó, así que los datos están seguros
    } finally {
      setIsSyncing(false);
    }
  }, [isLoading]);

  // Efecto para cargar datos inicialmente
  useEffect(() => {
    loadInitialProfiles();
  }, [loadInitialProfiles]);

  // Efecto para guardar cambios automáticamente
  useEffect(() => {
    if (profiles.length > 0 && !isLoading) {
      saveProfilesWithSync(profiles);
    }
  }, [profiles, isLoading, saveProfilesWithSync]);

  // Funciones CRUD
  const addProfile = useCallback((name: string, icon?: string) => {
    const trimmedName = name.trim();
    if (!trimmedName) return;
    
    const newProfile: Profile = {
      id: crypto.randomUUID(),
      name: trimmedName,
      icon,
      items: []
    };
    
    setProfiles(prev => [...prev, newProfile]);
  }, []);

  const updateProfile = useCallback((id: string, updates: Partial<Profile>) => {
    setProfiles(prev => 
      prev.map(profile => 
        profile.id === id 
          ? { ...profile, ...updates }
          : profile
      )
    );
  }, []);

  const deleteProfile = useCallback((id: string) => {
    setProfiles(prev => prev.filter(profile => profile.id !== id));
  }, []);

  const refreshProfiles = useCallback(async () => {
    await loadInitialProfiles();
  }, [loadInitialProfiles]);

  return {
    profiles,
    isLoading,
    isSyncing,
    error,
    addProfile,
    updateProfile,
    deleteProfile,
    refreshProfiles
  };
}
