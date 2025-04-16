import { useEffect, useRef, useState } from 'react';

const useWebSocket = (onMessage) => {
  const ws = useRef(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    ws.current = new WebSocket('wss://tarea-2.2025-1.tallerdeintegracion.cl/connect');

    ws.current.onopen = () => {
      console.log("✅ WebSocket conectado");
      setIsReady(true);
      const authPayload = {
        type: "AUTH",
        name: "Bruno Claverie",
        student_number: "15639797"
      };
      console.log("📤 Enviando AUTH:", authPayload);
      ws.current.send(JSON.stringify(authPayload));
    };

    ws.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log("🛰️ Evento recibido:", data);
      onMessage(data);
    };

    ws.current.onerror = (err) => {
      console.error("❌ WebSocket error:", err);
    };

    return () => {
      ws.current?.close();
      console.log("🔌 WebSocket cerrado");
    };
  }, [onMessage]);

  const sendMessage = (msg) => {
    if (ws.current?.readyState === WebSocket.OPEN) {
      console.log("📤 Enviando mensaje:", msg);
      ws.current.send(JSON.stringify(msg));
    } else {
      console.warn("⚠️ WebSocket no está listo para enviar mensajes.");
    }
  };

  return { sendMessage, isReady };
};

export default useWebSocket;