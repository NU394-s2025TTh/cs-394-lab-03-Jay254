// src/components/TodoDetail.tsx

import React, { useEffect, useState } from 'react';

import { Todo } from '../types/todo-type';

interface TodoDetailProps {
  todoId: number;
}
/**
 * TodoDetail component fetches and displays the details of a specific todo item based on the provided todoId.
 * It uses the useEffect hook to fetch the todo details from the API when the component mounts or when the todoId changes.
 * @param todoId - The ID of the todo item to fetch and display.
 */
export const TodoDetail: React.FC<TodoDetailProps> = ({ todoId }) => {
  const [todo, setTodo] = useState<Todo | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTodo = async () => {
      try {
        setLoading(true);
        const res = await fetch(`https://jsonplaceholder.typicode.com/todos/${todoId}`);
        if (!res.ok) throw new Error('Failed to fetch todo');
        const data: Todo = await res.json();
        setTodo(data);
        setError(null);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };
    fetchTodo();
  }, [todoId]);

  return (
    <div className="todo-detail">
      <h2>Todo Details</h2>
      {loading && <p>Loading...</p>}
      {error && <p>Error loading todo: {error}</p>}
      {todo && (
        <div>
          <p>
            <strong>ID:</strong> {todo.id}
          </p>
          <p>
            <strong>Title:</strong> {todo.title}
          </p>
          <p>
            <strong>Status:</strong> {todo.completed ? 'Completed' : 'Open'}
          </p>
        </div>
      )}
    </div>
  );
};
