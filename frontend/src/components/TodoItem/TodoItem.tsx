import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';

export interface Todo {
  id: number;
  text: string;
  completed: boolean;
  created_at?: string;
  updated_at?: string;
}

interface TodoItemProps {
  todo: Todo;
  onUpdate: (id: number, updates: Partial<Pick<Todo, 'text' | 'completed'>>) => void;
  onDelete: (id: number) => void;
}

const TodoItem: React.FC<TodoItemProps> = ({ todo, onUpdate, onDelete }) => {
  const [editing, setEditing] = useState(false);
  const [editText, setEditText] = useState(todo.text);

  const toggleComplete = () => {
    onUpdate(todo.id, { completed: !todo.completed });
  };

  const saveEdit = () => {
    if (!editText.trim()) return;
    onUpdate(todo.id, { text: editText.trim() });
    setEditing(false);
  };

  return (
    <li className="flex items-center justify-between p-2 border rounded">
      {editing ? (
        <>
          <Input
            className="flex-1 mr-2"
            value={editText}
            onChange={e => setEditText(e.target.value)}
          />
          <Button onClick={saveEdit}>Save</Button>
          <Button variant="ghost" onClick={() => setEditing(false)}>
            Cancel
          </Button>
        </>
      ) : (
        <>
          <label className="flex items-center flex-1">
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={toggleComplete}
              className="mr-2"
            />
            <span className={todo.completed ? 'line-through' : ''}>
              {todo.text}
            </span>
          </label>
          <div className="flex space-x-1">
            <Button variant="outline" size="sm" onClick={() => setEditing(true)}>
              Edit
            </Button>
            <Button variant="destructive" size="sm" onClick={() => onDelete(todo.id)}>
              Delete
            </Button>
          </div>
        </>
      )}
    </li>
  );
};

export default TodoItem;
