import { useState } from 'react';

export interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

export const useTodos = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [nextId, setNextId] = useState<number>(1);

  const addTodo = (text: string) => {
    const newTodo: Todo = {
      id: nextId,
      text,
      completed: false
    };
    setTodos(prev => [...prev, newTodo]);
    setNextId(prev => prev + 1);
  };

  const updateTodo = (id: number, updates: Partial<Omit<Todo, 'id'>>) => {
    setTodos(prev => prev.map(todo => 
      todo.id === id ? { ...todo, ...updates } : todo
    ));
  };

  const deleteTodo = (id: number) => {
    setTodos(prev => prev.filter(todo => todo.id !== id));
  };

  return { todos, addTodo, updateTodo, deleteTodo };
};