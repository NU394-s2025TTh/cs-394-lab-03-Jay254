// src/components/TodoList.tsx

import React, { useEffect, useState } from 'react';

import { Todo } from '../types/todo-type';

interface TodoListProps {
  onSelectTodo: (id: number) => void;
}
interface FetchTodosParams {
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  setFilteredTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
}
/**
 * fetchTodos function fetches todos from the API and updates the state.
 * @param setTodos - React setState Function to set the todos state.
 * @param setFilteredTodos - React setState Function to set the filtered todos state.
 * @param setLoading - react setState Function to set the loading state.
 * @param setError - react setState Function to set the error state.
 *
 * @returns {Promise<void>} - A promise that resolves when the todos are fetched and state is updated.  You should call this in useEffect.
 * setup useEffect to call this function when the component mounts
 * wraps the fetch API call in a try-catch block to handle errors gracefully and update the loading and error states accordingly.
 * The function uses async/await syntax to handle asynchronous operations, making the code cleaner and easier to read.
 * fetch from the URL https://jsonplaceholder.typicode.com/todos
 */
// remove eslint-disable-next-line @typescript-eslint/no-unused-vars when you use the parameters in the function
export const fetchTodos = async ({
  setTodos,
  setFilteredTodos,
  setLoading,
  setError,
}: FetchTodosParams): Promise<void> => {
  try {
    setLoading(true);
    const response = await fetch('https://jsonplaceholder.typicode.com/todos');
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

    const data: Todo[] = await response.json();
    setTodos(data);
    setFilteredTodos(data);
  } catch (error) {
    setError((error as Error).message);
  } finally {
    setLoading(false);
  }
};

/**
 * TodoList component fetches todos from the API and displays them in a list.
 * It also provides filter buttons to filter the todos based on their completion status.
 * @param onSelectTodo - A function that is called when a todo is selected. It receives the todo id as an argument.
 * @returns
 */

// remove the following line when you use onSelectTodo in the component
export const TodoList: React.FC<TodoListProps> = ({ onSelectTodo }) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filteredTodos, setFilteredTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<'all' | 'open' | 'completed'>('all');

  useEffect(() => {
    fetchTodos({ setTodos, setFilteredTodos, setLoading, setError });
  }, []);

  const handleFilter = (filter: 'all' | 'open' | 'completed') => {
    setActiveFilter(filter);
    switch (filter) {
      case 'completed':
        setFilteredTodos(todos.filter((todo) => todo.completed));
        break;
      case 'open':
        setFilteredTodos(todos.filter((todo) => !todo.completed));
        break;
      default:
        setFilteredTodos(todos);
    }
  };

  return (
    <div className="todo-list">
      <h2>Todo List</h2>
      <p>...</p>
      <div className="filter-buttons">
        <button
          data-testid="filter-all"
          onClick={() => handleFilter('all')}
          className={activeFilter === 'all' ? 'active' : ''}
        >
          All
        </button>
        <button
          data-testid="filter-open"
          onClick={() => handleFilter('open')}
          className={activeFilter === 'open' ? 'active' : ''}
        >
          Open
        </button>
        <button
          data-testid="filter-completed"
          onClick={() => handleFilter('completed')}
          className={activeFilter === 'completed' ? 'active' : ''}
        >
          Completed
        </button>
      </div>
      {loading && <p>Loading todos...</p>}
      {error && <p>Error loading todos: {error}</p>}
      {!loading && !error && (
        <ul>
          {filteredTodos.map((todo) => (
            <li key={todo.id} data-testid={`todo-${todo.id}`}>
              <button onClick={() => onSelectTodo(todo.id)}>
                <span>{todo.title}</span> {todo.completed ? '✅' : '❌'}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
