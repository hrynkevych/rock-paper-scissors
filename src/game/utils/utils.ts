import { WebSocket } from 'ws';

export function assignId(client: WebSocket): string {
  const id = Math.random().toString(36).substring(2);
  client['id'] = id;
  return id;
}

export function sendMessage(client: WebSocket, event: string, message: any): void {
  try {
    client.send(JSON.stringify({ event, data: message }));
  } catch (error) {
    console.error('Failed to send message:', error);
  }
}

export function sendMessageToSocket(server: WebSocket.Server, socketId: string, event: string, message: any): void {
  const client = [...server.clients].find((c: any) => c['id'] === socketId);
  if (client) {
    sendMessage(client, event, message);
  }
}

export function broadcast(server: WebSocket.Server, event: string, message: any): void {
  server.clients.forEach((client: WebSocket) => {
    sendMessage(client, event, message);
  });
}
