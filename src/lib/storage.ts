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
