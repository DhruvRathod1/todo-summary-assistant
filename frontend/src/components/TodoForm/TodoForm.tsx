import React, { useState } from 'react';
import { Input } from '../ui/input';
import { Button } from '../ui/button';

interface TodoFormProps {
  onAdd: (text: string) => void;
}

const TodoForm: React.FC<TodoFormProps> = ({ onAdd }) => {
  const [text, setText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    onAdd(text.trim());
    setText('');
  };

  return (
    <form onSubmit={handleSubmit} className="flex space-x-2">
      <Input
        placeholder="New todo..."
        value={text}
        onChange={e => setText(e.target.value)}
      />
      <Button type="submit">Add</Button>
    </form>
  );
};

export default TodoForm;
