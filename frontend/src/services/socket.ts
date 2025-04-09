import { Task } from './api';

export type ChangeEvent = {
  type: 'insert' | 'update' | 'delete';
  task: Task;
};

const WS_URL = import.meta.env.VITE_WS_URL || 'ws://localhost:8080/ws';

export function connectSocket(onEvent: (evt: ChangeEvent) => void) {
  const ws = new WebSocket(WS_URL);
  ws.onopen = () => console.log('WebSocket connected');
  ws.onmessage = e => {
    const data: ChangeEvent = JSON.parse(e.data);
    onEvent(data);
  };
  ws.onclose = () => console.log('WebSocket disconnected');
  return ws;
}