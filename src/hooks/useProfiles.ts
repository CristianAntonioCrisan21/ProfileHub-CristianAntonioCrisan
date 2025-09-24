import { useState, useEffect, useCallback } from 'react';
import type { Profile } from '@/types/profile';
import { loadProfiles, saveProfiles } from '@/lib/storage';

interface UseProfilesReturn {
  profiles: Profile[];
  isLoading: boolean;
  addProfile: (name: string, icon?: string) => void;
  updateProfile: (id: string, updates: Partial<Profile>) => void;
  deleteProfile: (id: string) => void;
  refreshProfiles: () => void;
}

export function useProfiles(): UseProfilesReturn {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Cargar perfiles inicialmente
  const loadInitialProfiles = useCallback(() => {
    setIsLoading(true);
    const data = loadProfiles();
    setProfiles(data);
    setIsLoading(false);
  }, []);

  // Efecto para cargar datos inicialmente
  useEffect(() => {
    loadInitialProfiles();
  }, [loadInitialProfiles]);

  // Efecto para guardar cambios automáticamente
  useEffect(() => {
    if (profiles.length > 0 && !isLoading) {
      saveProfiles(profiles);
    }
  }, [profiles, isLoading]);

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

  const refreshProfiles = useCallback(() => {
    loadInitialProfiles();
  }, [loadInitialProfiles]);

  return {
    profiles,
    isLoading,
    addProfile,
    updateProfile,
    deleteProfile,
    refreshProfiles
  };
}
