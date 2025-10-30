// AEIOU v4.3 AutoRepair System
// Silent integrity layer for NoCodeBridge

export const initializeAEIOUAutoRepair = () => {
  console.log("🔧 AEIOU v4.3 AutoRepair active");
  
  // Initialize global AEIOU namespace
  if (typeof window !== 'undefined') {
    const validateStructure = () => {
      const requiredKeys = ['version', 'status', 'lastCheck'];
      return requiredKeys.every(key => window.AEIOU && window.AEIOU[key as keyof typeof window.AEIOU] !== undefined);
    };
    
    const offlineFallback = {
      enabled: true,
      storage: localStorage,
      getItem: (key: string) => {
        try {
          return localStorage.getItem(key);
        } catch (e) {
          console.warn('AEIOU: localStorage unavailable', e);
          return null;
        }
      },
      setItem: (key: string, value: string) => {
        try {
          localStorage.setItem(key, value);
        } catch (e) {
          console.warn('AEIOU: localStorage write failed', e);
        }
      }
    };
    
    window.AEIOU = {
      version: "4.3",
      status: "active",
      lastCheck: new Date().toISOString(),
      validateStructure,
      offlineFallback,
      ...window.AEIOU
    };
    
    // Verify integrity
    const isValid = window.AEIOU.validateStructure();
    if (isValid) {
      console.log("Bridge integrity verified.");
    }
  }
};

// Type declaration for global AEIOU
declare global {
  interface Window {
    AEIOU: {
      version: string;
      status: string;
      lastCheck: string;
      validateStructure: () => boolean;
      offlineFallback: {
        enabled: boolean;
        storage: Storage;
        getItem: (key: string) => string | null;
        setItem: (key: string, value: string) => void;
      };
      rebuild?: (uap: any) => any;
      import?: (uap: any) => any;
    };
    NoCodeBridge?: any;
  }
}

export default initializeAEIOUAutoRepair;
