import type { Request, Response } from 'express';
import supabase from '../services/supabase';

interface Todo {
  id: number;
  text: string;
  completed: boolean;
  created_at?: string;
  updated_at?: string;
}

/**
 * GET /todos
 */
export async function getTodos(req: Request, res: Response): Promise<void> {
  try {
    const { data, error } = await supabase
      .from('todos')
      .select('*')
      .order('id', { ascending: true });

    if (error) {
      console.error('Supabase fetch error:', error);
      res.status(500).json({ error: 'Failed to fetch todos.' });
      return;
    }
    
    res.json(data || []);
  } catch (err) {
    console.error('GET /todos error:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
}

/**
 * POST /todos
 */
export async function createTodo(req: Request, res: Response): Promise<void> {
  try {
    const { text } = req.body;
    
    if (!text || !text.trim()) {
      res.status(400).json({ error: 'Todo text is required.' });
      return;
    }

    const { data, error } = await supabase
      .from('todos')
      .insert({ text: text.trim(), completed: false })
      .select()
      .single();

    if (error) {
      console.error('Supabase insert error:', error);
      res.status(500).json({ error: 'Failed to create todo.' });
      return;
    }
    
    res.status(201).json(data);
  } catch (err) {
    console.error('POST /todos error:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
}

/**
 * PATCH /todos/:id
 */
export async function updateTodo(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const todoId = parseInt(id, 10);
    
    if (isNaN(todoId)) {
      res.status(400).json({ error: 'Invalid todo ID.' });
      return;
    }

    const updates: Partial<Pick<Todo, 'text' | 'completed'>> = {};
    
    if ('text' in req.body && req.body.text !== undefined) {
      const trimmedText = req.body.text?.trim();
      if (trimmedText === '') {
        res.status(400).json({ error: 'Todo text cannot be empty.' });
        return;
      }
      updates.text = trimmedText;
    }
    if ('completed' in req.body && req.body.completed !== undefined) {
      updates.completed = req.body.completed;
    }

    if (Object.keys(updates).length === 0) {
      res.status(400).json({ error: 'No valid updates provided.' });
      return;
    }

    const { data, error } = await supabase
      .from('todos')
      .update(updates)
      .eq('id', todoId)
      .select()
      .single();

    if (error) {
      console.error('Supabase update error:', error);
      res.status(500).json({ error: 'Failed to update todo.' });
      return;
    }
    
    if (!data) {
      res.status(404).json({ error: 'Todo not found.' });
      return;
    }
    
    res.json(data);
  } catch (err) {
    console.error('PATCH /todos/:id error:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
}

/**
 * DELETE /todos/:id
 */
export async function deleteTodo(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const todoId = parseInt(id, 10);
    
    if (isNaN(todoId)) {
      res.status(400).json({ error: 'Invalid todo ID.' });
      return;
    }
    
    const { error } = await supabase
      .from('todos')
      .delete()
      .eq('id', todoId);

    if (error) {
      console.error('Supabase delete error:', error);
      res.status(500).json({ error: 'Failed to delete todo.' });
      return;
    }
    
    res.sendStatus(204);
  } catch (err) {
    console.error('DELETE /todos/:id error:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
}