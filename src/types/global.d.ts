export {};

declare global {
  interface Window {
    native?: {
      openUrl: (url: string) => Promise<void>;
      openApp: (path: string) => Promise<void>;
    };
  }
}
