import axios from 'axios';

export interface Task {
  id: string;
  title: string;
  description: string;
  completed: boolean;
}

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8080';

export const getTasks = () => axios.get<Task[]>(`${API_BASE}/tasks`);
export const createTask = (task: Omit<Task, 'id'>) =>
  axios.post<Task>(`${API_BASE}/tasks`, task);
export const updateTask = (id: string, task: Partial<Omit<Task, 'id'>>) =>
  axios.put<Task>(`${API_BASE}/tasks/${id}`, task);
export const deleteTask = (id: string) =>
  axios.delete<void>(`${API_BASE}/tasks/${id}`);
