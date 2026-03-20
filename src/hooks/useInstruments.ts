import { useState, useEffect } from "react";
import type { Instrument } from "../types/instrument";

export function useInstruments() {
  const [instruments, setInstruments] = useState<Instrument[]>([]);

  useEffect(() => {
    // Replace with your actual WebSocket URL
    const ws = new WebSocket("ws://localhost:8080/ws");

    ws.onopen = () => {
      console.log("WebSocket Connected");
    };

    ws.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);

        // Example handling of different message types
        if (message.type === "INIT") {
          setInstruments(message.data);
        } else if (message.type === "UPDATE") {
          setInstruments((prevInstruments) =>
            prevInstruments.map((inst) =>
              inst.id === message.data.id ? { ...inst, ...message.data } : inst,
            ),
          );
        }
      } catch (error) {
        console.error("Failed to parse WebSocket message:", error);
      }
    };

    ws.onerror = (error) => {
      console.error("WebSocket Error:", error);
    };

    ws.onclose = () => {
      console.log("WebSocket Disconnected");
    };

    // Cleanup on unmount
    return () => {
      ws.close();
    };
  }, []);

  return instruments;
}
