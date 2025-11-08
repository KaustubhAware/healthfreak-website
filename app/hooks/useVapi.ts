'use client';

import { useRef, useEffect, useState } from "react";

// Vapi instance type
type VapiInstance = {
  start: (config: any) => Promise<any>;
  stop: () => Promise<any>;
  [key: string]: any;
};

export function useVapi() {
  const vapiRef = useRef<VapiInstance | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isInitialized = useRef(false);

  useEffect(() => {
    if (typeof window === "undefined" || isInitialized.current) {
      return;
    }

    const apiKey = process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY;
    
    if (!apiKey) {
      setError("VAPI_PUBLIC_KEY is not configured");
      console.error("VAPI_PUBLIC_KEY environment variable is missing");
      return;
    }

    isInitialized.current = true;

    import("@vapi-ai/web")
      .then((mod) => {
        try {
          // Try to get Vapi constructor - default export
          const VapiConstructor = mod.default || mod;
          
          if (!VapiConstructor || typeof VapiConstructor !== 'function') {
            throw new Error("Vapi constructor not found in module");
          }
          
          // Check if an instance already exists (prevent duplicates)
          if (vapiRef.current) {
            console.log("VAPI instance already exists, skipping initialization");
            setIsReady(true);
            return;
          }
          
          vapiRef.current = new VapiConstructor(apiKey);
          setIsReady(true);
          console.log("VAPI initialized successfully", { hasVapi: !!vapiRef.current });
        } catch (err) {
          console.error("Error initializing Vapi:", err);
          setError(err instanceof Error ? err.message : "Failed to initialize Vapi");
          isInitialized.current = false;
        }
      })
      .catch((err) => {
        console.error("Error importing Vapi:", err);
        setError(err instanceof Error ? err.message : "Failed to load Vapi module");
        isInitialized.current = false;
      });

    // Cleanup function
    return () => {
      // Note: We don't stop the Vapi instance here as it should be controlled by the component
      // The component should call vapiRef.current.stop() when unmounting
    };
  }, []);

  return { vapiRef, isReady, error };
}

export type { VapiInstance as VapiType };
