interface License {
  name: string;
  license: string;
  repository?: string;
}

interface AppInfo {
  applicationName: string;
  applicationVersion: string;
  version: string;
  electronVersion: string;
  website: string;
  repo: string;
}

interface Window {
  ugrc: {
    webFilePath: (file: File) => string;
    validateWithStats: (content: string) => Promise<{ isValid: boolean; stats: unknown }>;
    getCsvColumns: (content: string) => Promise<string[]>;
    saveConfig: (content: Record<string, unknown>) => Promise<void>;
    getConfigItem: (key: string) => Promise<unknown>;
    getLicenses: () => Promise<string>;
    geocode: (content: unknown) => Promise<unknown>;
    cancelGeocode: (content: unknown) => Promise<void>;
    startDrag: (content: unknown) => Promise<void>;
    checkApiKey: (content: string) => Promise<boolean>;
    getAppVersion: () => Promise<string>;
    getAppInfo: () => Promise<AppInfo>;
    getUserConfirmation: (content: string) => Promise<boolean>;
    subscribeToGeocodingUpdates: (handler: (event: unknown, data: unknown) => void) => void;
    unsubscribeFromGeocodingUpdates: () => void;
    isMacOS: () => boolean;
    relaunchApp: () => void;
    openIssue: (content: { message: string; stack?: string }) => void;
    openEmail: (content: { message: string; stack?: string }) => void;
    trackEvent: (content: { category: string; label: string }) => void;
  };
}
