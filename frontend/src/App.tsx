// src/App.tsx
import { useState, useEffect } from "react";
import TodoForm from "./components/TodoForm/TodoForm";
import TodoItem from "./components/TodoItem/TodoItem";
import type { Todo } from "./components/TodoItem/TodoItem";
import {
  getTodos,
  createTodo,
  updateTodo,
  deleteTodo,
  summarize,
} from "./services/api";

export default function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Summarization states
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [summaryStatus, setSummaryStatus] = useState<string | null>(null);
  const [summaryText, setSummaryText] = useState<string | null>(null);

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      setLoading(true);
      const data = await getTodos();
      setTodos(data);
      setError(null);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch todos");
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (text: string) => {
    try {
      const newTodo = await createTodo(text);
      setTodos((prev) => [...prev, newTodo]);
      setError(null);
    } catch (err) {
      console.error(err);
      setError("Failed to create todo");
    }
  };

  const handleUpdate = async (
    id: number,
    updates: Partial<Pick<Todo, "text" | "completed">>
  ) => {
    try {
      const updated = await updateTodo(id, updates);
      setTodos((prev) =>
        prev.map((t) => (t.id === id ? updated : t))
      );
      setError(null);
    } catch (err) {
      console.error(err);
      setError("Failed to update todo");
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteTodo(id);
      setTodos((prev) => prev.filter((t) => t.id !== id));
      setError(null);
    } catch (err) {
      console.error(err);
      setError("Failed to delete todo");
    }
  };

  const handleSummarize = async () => {
    setIsSummarizing(true);
    setSummaryStatus(null);
    setSummaryText(null);

    try {
      const { message, summary } = await summarize();
      setSummaryStatus(message);
      if (summary) setSummaryText(summary);
    } catch (err: any) {
      console.error(err);
      setSummaryStatus("Failed to generate summary");
    } finally {
      setIsSummarizing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold text-center">
          Todo Summary Assistant
        </h1>

        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded">
            {error}
          </div>
        )}

        <div className="bg-white p-6 rounded shadow">
          <TodoForm onAdd={handleAdd} />

          {/* Summarize Button */}
          <div className="mt-6 text-center">
            <button
              onClick={handleSummarize}
              disabled={isSummarizing}
              className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
            >
              {isSummarizing
                ? "Summarizing…"
                : "Summarize Pending Todos"}
            </button>
          </div>

          {/* Summary Status & Text */}
          {summaryStatus && (
            <div className="mt-4 p-4 bg-gray-50 rounded border">
              <p className="font-medium">{summaryStatus}</p>
              {summaryText && (
                <pre className="mt-2 whitespace-pre-wrap">
                  {summaryText}
                </pre>
              )}
            </div>
          )}

          {/* Todo List */}
          <div className="mt-6">
            {todos.length === 0 ? (
              <p className="text-gray-500 text-center">
                No todos yet. Add one above!
              </p>
            ) : (
              <ul className="space-y-2">
                {todos.map((todo) => (
                  <TodoItem
                    key={todo.id}
                    todo={todo}
                    onUpdate={handleUpdate}
                    onDelete={handleDelete}
                  />
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
