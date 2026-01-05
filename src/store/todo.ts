import { defineStore } from "pinia";
import { ref } from "vue";
import type { Todo } from "../models/todo";

const API_URL = "https://jsonplaceholder.typicode.com/todos";

export const useTodoStore = defineStore("todo", () => {
  // ===== State =====
  const todos = ref<Todo[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  // ===== Actions =====

  // READ: fetch todos
  const fetchTodos = async (limit = 10) => {
    loading.value = true;
    error.value = null;

    try {
      const res = await fetch(`${API_URL}?_limit=${limit}`);
      if (!res.ok) throw new Error("Failed to fetch todos");

      todos.value = await res.json();
    } catch (err: any) {
      error.value = err.message;
    } finally {
      loading.value = false;
    }
  };

  // CREATE: add a new todo
  const addTodo = async (payload: Todo) => {
    loading.value = true;
    error.value = null;

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Failed to add todo");

      const newTodo: Todo = await res.json();
      todos.value.unshift(newTodo);
    } catch (err: any) {
      error.value = err.message;
    } finally {
      loading.value = false;
    }
  };

  // UPDATE: toggle completed status
  const toggleTodo = async (id: number) => {
    const todo = todos.value.find((t) => t.id === id);
    if (!todo) return;

    loading.value = true;
    error.value = null;

    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completed: !todo.completed }),
      });
      if (!res.ok) throw new Error("Failed to update todo");

      todo.completed = !todo.completed; // Optimistic update
    } catch (err: any) {
      error.value = err.message;
    } finally {
      loading.value = false;
    }
  };

  // EDIT: update title or completed status
  const editTodo = async (payload: Todo) => {
    const todo = todos.value.find((t) => t.id === payload.id);
    if (!todo) return;

    loading.value = true;
    error.value = null;

    try {
      const res = await fetch(`${API_URL}/${payload.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Failed to edit todo");

      Object.assign(todo, payload); // Optimistic update
    } catch (err: any) {
      error.value = err.message;
    } finally {
      loading.value = false;
    }
  };

  // DELETE: remove a todo
  const removeTodo = async (id: number) => {
    loading.value = true;
    error.value = null;

    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete todo");

      todos.value = todos.value.filter((t) => t.id !== id);
    } catch (err: any) {
      error.value = err.message;
    } finally {
      loading.value = false;
    }
  };

  return {
    // state
    todos,
    loading,
    error,
    // actions
    fetchTodos,
    addTodo,
    toggleTodo,
    editTodo,
    removeTodo,
  };
});
