import { useState } from 'react';
import type { ChangeEvent, KeyboardEvent } from 'react';
import { Input } from '../ui/input';
import { Button } from '../ui/button';

interface TodoFormProps {
  onAdd: (text: string) => void;
}

export default function TodoForm({ onAdd }: TodoFormProps) {
  const [text, setText] = useState<string>('');

  const handleAdd = () => {
    const trimmed = text.trim();
    if (!trimmed) return;
    onAdd(trimmed);
    setText('');
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleAdd();
    }
  };

  return (
    <div className="w-6xl item-center flex gap-2">
      <Input
        placeholder="Enter a new todo…"
        value={text}
        onChange={handleChange}
        onKeyPress={handleKeyPress}
      />
      <Button onClick={handleAdd}>Add Todo</Button>
    </div>
  );
}