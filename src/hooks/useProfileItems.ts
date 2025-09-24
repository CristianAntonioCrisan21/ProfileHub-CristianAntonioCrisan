import { useCallback } from 'react';
import type { Profile, Item, ItemType } from '@/types/profile';

interface UseProfileItemsProps {
  profile: Profile | null;
  updateProfile: (id: string, updates: Partial<Profile>) => void;
}

interface UseProfileItemsReturn {
  addItem: (type: ItemType, value: string) => void;
  updateItem: (itemId: string, updates: Partial<Item>) => void;
  removeItem: (itemId: string) => void;
  reorderItems: (startIndex: number, endIndex: number) => void;
  openItem: (item: Item) => Promise<void>;
  openAllItems: () => Promise<void>;
}

export function useProfileItems({ 
  profile, 
  updateProfile 
}: UseProfileItemsProps): UseProfileItemsReturn {
  
  const addItem = useCallback((type: ItemType, value: string) => {
    if (!profile) return;
    
    const trimmedValue = value.trim();
    if (!trimmedValue) return;
    
    const newItem: Item = {
      id: crypto.randomUUID(),
      type,
      value: trimmedValue
    };
    
    updateProfile(profile.id, {
      items: [...profile.items, newItem]
    });
  }, [profile, updateProfile]);

  const updateItem = useCallback((itemId: string, updates: Partial<Item>) => {
    if (!profile) return;
    
    updateProfile(profile.id, {
      items: profile.items.map(item =>
        item.id === itemId
          ? { ...item, ...updates }
          : item
      )
    });
  }, [profile, updateProfile]);

  const removeItem = useCallback((itemId: string) => {
    if (!profile) return;
    
    updateProfile(profile.id, {
      items: profile.items.filter(item => item.id !== itemId)
    });
  }, [profile, updateProfile]);

  const reorderItems = useCallback((startIndex: number, endIndex: number) => {
    if (!profile) return;
    
    const items = [...profile.items];
    const [reorderedItem] = items.splice(startIndex, 1);
    items.splice(endIndex, 0, reorderedItem);
    
    updateProfile(profile.id, { items });
  }, [profile, updateProfile]);

  const openItem = useCallback(async (item: Item) => {
    try {
      if (item.type === 'url') {
        await window.native?.openUrl(item.value);
      } else {
        await window.native?.openApp(item.value);
      }
    } catch (error) {
      console.error('Error opening item:', error);
      // Fallback para desarrollo: abrir URL en el navegador
      if (item.type === 'url') {
        window.open(item.value, '_blank');
      }
    }
  }, []);

  const openAllItems = useCallback(async () => {
    if (!profile) return;
    
    const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
    
    for (const item of profile.items) {
      try {
        await openItem(item);
        await delay(120); // Pequeña pausa entre aperturas
      } catch (error) {
        console.error('Error opening item:', item, error);
      }
    }
  }, [profile, openItem]);

  return {
    addItem,
    updateItem,
    removeItem,
    reorderItems,
    openItem,
    openAllItems
  };
}
