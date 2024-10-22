import { WebSocket } from 'ws';

// Function to assign a unique ID to a WebSocket client
export function assignId(client: WebSocket): string {
  const id = Math.random().toString(36).substring(2);
  client['id'] = id;
  return id;
}

// Function to send a message to a specific WebSocket client
export function sendMessage(client: WebSocket, event: string, message: any): void {
  try {
    client.send(JSON.stringify({ event, data: message }));
  } catch (error) {
    console.error('Failed to send message:', error);
  }
}

// Function to send a message to a specific WebSocket client by socket ID
export function sendMessageToSocket(server: WebSocket.Server, socketId: string, event: string, message: any): void {
  const client = [...server.clients].find((c: any) => c['id'] === socketId);
  if (client) {
    sendMessage(client, event, message);
  }
}

// Function to broadcast a message to all connected WebSocket clients
export function broadcast(server: WebSocket.Server, event: string, message: any): void {
  server.clients.forEach((client: WebSocket) => {
    sendMessage(client, event, message);
  });
}
