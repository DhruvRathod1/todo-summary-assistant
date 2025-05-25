import TodoForm from './components/TodoForm/TodoForm';
import TodoItem from './components/TodoItem/TodoItem';  
import { useTodos } from './hooks/useTodos';
import { useSummary } from './hooks/useSummary';
import { Card, CardContent } from './components/ui/card';
import { Button } from './components/ui/button';

export default function App() {
  const { todos, addTodo, updateTodo, deleteTodo } = useTodos();
  const { status, summarize } = useSummary();

  const pendingTodos = todos.filter(todo => !todo.completed);
  const completedTodos = todos.filter(todo => todo.completed);

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-6xl mx-auto px-4">
        <Card>
          <CardContent>
            <h1 className="text-3xl font-bold mb-6 text-gray-800">Todo Summary Assistant</h1>
            
            <TodoForm onAdd={addTodo} />
            
            {todos.length === 0 ? (
              <div className="mt-8 text-center text-gray-500">
                <p>No todos yet. Add your first todo above!</p>
              </div>
            ) : (
              <div className="mt-8">
                {pendingTodos.length > 0 && (
                  <div className="mb-6">
                    <h2 className="text-lg font-semibold mb-3 text-gray-700">
                      Pending ({pendingTodos.length})
                    </h2>
                    <ul className="space-y-2">
                      {pendingTodos.map(todo => (
                        <TodoItem
                          key={todo.id}
                          todo={todo}
                          onUpdate={updateTodo}
                          onDelete={deleteTodo}
                        />
                      ))}
                    </ul>
                  </div>
                )}
                
                {completedTodos.length > 0 && (
                  <div className="mb-6">
                    <h2 className="text-lg font-semibold mb-3 text-gray-700">
                      Completed ({completedTodos.length})
                    </h2>
                    <ul className="space-y-2">
                      {completedTodos.map(todo => (
                        <TodoItem
                          key={todo.id}
                          todo={todo}
                          onUpdate={updateTodo}
                          onDelete={deleteTodo}
                        />
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
            
            {pendingTodos.length > 0 && (
              <div className="mt-6 pt-4 border-t border-gray-200">
                <Button 
                  onClick={summarize}
                  className="bg-purple-500 hover:bg-purple-600"
                >
                  Summarize Pending Todos ({pendingTodos.length})
                </Button>
              </div>
            )}
            
            {status && (
              <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded text-blue-800">
                {status}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}