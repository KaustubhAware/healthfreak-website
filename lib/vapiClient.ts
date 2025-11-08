'use client';

import { useRef, useEffect } from "react";

// ✅ TypeScript declaration for Vapi (for type safety)
export type VapiType = {
  start: (options: {
    name: string;
    systemPrompt: string;
    voice?: { provider: string; voiceId: string };
  }) => Promise<void>;
  stop: () => Promise<void>;
  sendMessage: (message: string) => Promise<{ text: string }>;
};

export function useVapi() {
  const vapiRef = useRef<VapiType | null>(null);

  useEffect(() => {
    // Only run on client side
    if (typeof window !== "undefined" && !vapiRef.current) {
      import("@vapi-ai/web").then(({ Vapi }) => {
        // Initialize Vapi with your public key
        vapiRef.current = new Vapi(
          process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY!
        ) as unknown as VapiType;
      }).catch(err => console.error("Error importing Vapi:", err));
    }
  }, []);

  return vapiRef;
}
