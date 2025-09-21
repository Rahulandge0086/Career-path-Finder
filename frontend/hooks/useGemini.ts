// frontend/src/hooks/useGemini.ts
import { useState } from "react";

export function useGemini() {
  const [Loading, setLoading] = useState(false);
  const [response, setResponse] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const generate = async (prompt: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("http://localhost:5000/api/gemini/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      });

      if (!res.ok) throw new Error("Failed to fetch Gemini response");

      const data = await res.json();
      setResponse(data.content);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return { generate, response, Loading, error };
}
