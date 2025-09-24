
import type { Profile } from "@/types/profile";

const STORAGE_KEY = "workprofiles:data:v1";

// Datos de demostración
const createDemoProfiles = (): Profile[] => [
  {
    id: crypto.randomUUID(),
    name: "Trading",
    items: [
      { 
        id: crypto.randomUUID(), 
        type: "url", 
        value: "https://www.tradingview.com/" 
      },
      { 
        id: crypto.randomUUID(), 
        type: "app", 
        value: "/System/Applications/Calculator.app" 
      }
    ]
  }
];

export function loadProfiles(): Profile[] {
  if (typeof window === "undefined") return [];
  
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    
    if (!raw) {
      const demoProfiles = createDemoProfiles();
      saveProfiles(demoProfiles);
      return demoProfiles;
    }
    
    return JSON.parse(raw) as Profile[];
  } catch (error) {
    console.warn("Error loading profiles from localStorage:", error);
    return [];
  }
}

export function saveProfiles(profiles: Profile[]): void {
  if (typeof window === "undefined") return;
  
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profiles));
  } catch (error) {
    console.error("Error saving profiles to localStorage:", error);
  }
}
