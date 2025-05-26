// src/services/api.ts
import axios from 'axios';
import type { Todo } from '../components/TodoItem/TodoItem';

// strip trailing slash or fallback to localhost:5000
const API_BASE =
  import.meta.env.VITE_API_URL?.replace(/\/$/, '') ||
  'http://localhost:5000';

console.log('📡 API_BASE =', API_BASE);

const api = axios.create({
  baseURL: API_BASE,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

// Request interceptor for logging
api.interceptors.request.use(
  (config) => {
    console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for logging
api.interceptors.response.use(
  (response) => {
    console.log(`API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error('API Response Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export async function getTodos(): Promise<Todo[]> {
  try {
    const res = await api.get<Todo[]>('/todos');
    return res.data;
  } catch (error) {
    console.error('Failed to fetch todos:', error);
    throw new Error('Failed to fetch todos');
  }
}

export async function createTodo(text: string): Promise<Todo> {
  try {
    const res = await api.post<Todo>('/todos', { text });
    return res.data;
  } catch (error) {
    console.error('Failed to create todo:', error);
    throw new Error('Failed to create todo');
  }
}

export async function updateTodo(
  id: number,
  updates: Partial<Omit<Todo, 'id'>>
): Promise<Todo> {
  try {
    const res = await api.patch<Todo>(`/todos/${id}`, updates);
    return res.data;
  } catch (error) {
    console.error('Failed to update todo:', error);
    throw new Error('Failed to update todo');
  }
}

export async function deleteTodo(id: number): Promise<void> {
  try {
    await api.delete(`/todos/${id}`);
  } catch (error) {
    console.error('Failed to delete todo:', error);
    throw new Error('Failed to delete todo');
  }
}

export async function summarize(): Promise<{ message: string; summary?: string }> {
  try {
    const res = await api.post<{ message: string; summary?: string }>('/summarize');
    return res.data;
  } catch (error) {
    console.error('Failed to generate summary:', error);
    throw new Error('Failed to generate summary');
  }
}