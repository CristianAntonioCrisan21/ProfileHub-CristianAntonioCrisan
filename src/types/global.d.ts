export {};

declare global {
  interface Window {
    native?: {
      openUrl: (url: string) => Promise<boolean>;
      openApp: (pathOrId: string, args?: string[]) => Promise<boolean>;
      openFile: (path: string) => Promise<boolean>;
      selectApp: () => Promise<string | null>;
    };
  }
}
export {};

