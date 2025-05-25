import { useState } from 'react';
import type { ChangeEvent, KeyboardEvent } from 'react';
import { Button } from '../ui/button';
import type { Todo } from '../../hooks/useTodos';

interface TodoItemProps {
  todo: Todo;
  onUpdate: (id: number, updates: Partial<Omit<Todo, 'id'>>) => void;
  onDelete: (id: number) => void;
}

export default function TodoItem({
  todo,
  onUpdate,
  onDelete
}: TodoItemProps) {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editText, setEditText] = useState<string>(todo.text);

  const handleToggleComplete = () => {
    onUpdate(todo.id, { completed: !todo.completed });
  };

  const handleSave = () => {
    const trimmed = editText.trim();
    if (!trimmed) return;
    onUpdate(todo.id, { text: trimmed });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditText(todo.text);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEditText(e.target.value);
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  return (
    <li className="flex items-center justify-between p-3 bg-gray-50 rounded border">
      {isEditing ? (
        <div className="flex gap-2 items-center flex-1">
          <input
            className="flex-1 px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={editText}
            onChange={handleChange}
            onKeyPress={handleKeyPress}
            autoFocus
          />
          <Button onClick={handleSave}>Save</Button>
          <Button onClick={handleCancel} className="bg-gray-500 hover:bg-gray-600">
            Cancel
          </Button>
        </div>
      ) : (
        <>
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={handleToggleComplete}
              className="w-4 h-4"
            />
            <span className={`${todo.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
              {todo.text}
            </span>
          </div>
          <div className="flex gap-2">
            <Button 
              onClick={() => setIsEditing(true)}
              className="bg-green-500 hover:bg-green-600 text-sm px-3 py-1"
            >
              Edit
            </Button>
            <Button 
              onClick={() => onDelete(todo.id)}
              className="bg-red-500 hover:bg-red-600 text-sm px-3 py-1"
            >
              Delete
            </Button>
          </div>
        </>
      )}
    </li>
  );
}