<template>
  <div class="min-h-screen flex items-center justify-center bg-white">
    <div class="w-[360px] text-center">
      <!-- Title -->
      <h1 class="text-xl font-semibold mb-6">Your To Do</h1>

      <!-- Input -->
      <div class="flex items-center gap-2 mb-4">
        <input
          type="text"
          placeholder="Add new task"
          v-model="title"
          class="flex-1 border-b border-gray-400 focus:outline-none py-1 text-sm"
        />
        <button
          class="w-8 h-8 rounded-full bg-gray-800 text-white flex items-center justify-center hover:bg-gray-700"
          @click="onAddTodo"
        >
          +
        </button>
      </div>

      <!-- Todo List -->
      <div class="space-y-3">
        <div class="flex">
          <button class="b-">Todo</button>
          <button>completed</button>
        </div>
        <div
          v-for="(task, index) in todoStore.todos"
          :key="index"
          class="flex items-center justify-between border rounded-lg px-3 py-2"
        >
          <div class="flex items-center gap-2">
            <input type="checkbox" v-model="task.completed" />
            <span
              :class="
                task.completed ? 'line-through text-gray-400' : 'text-gray-800'
              "
              class="text-sm"
              @click="openEditDialog(task)"
            >
              {{ task.title }}
            </span>
          </div>
          <div>
            <button @click="onOpendDeleted(task)" class="text-gray-500">
              ×
            </button>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <p class="text-sm italic mt-4">
        Your remaining todos :
        <span class="font-semibold">{{ remaining }}</span>
      </p>
    </div>
  </div>
  <Dailog
    v-if="isDialogDelete"
    @no="isDialogDelete = false"
    @yes="remove(payload.id)"
    title="Delete Todo"
  >
    <p>Are you sure to delete this todo?</p>
  </Dailog>
  <Dailog
    v-if="isDialogEditOpen"
    @no="isDialogEditOpen = false"
    @yes="onEdit(payload)"
    title="Edit Todo"
  >
    <input
      type="text"
      placeholder="Add new task"
      v-model="payload.title"
      class="border-b border-gray-400 focus:outline-none py-1 text-sm mb-4 w-full"
    />
  </Dailog>
</template>
<script setup lang="ts">
import { onMounted, computed, ref } from "vue";
import { useTodoStore } from "./../store/todo";
import Dailog from "../components/Dailog.vue";
import type { Todo } from "../models/todo";

const todoStore = useTodoStore();
const isDialogEditOpen = ref(false);
const isDialogDelete = ref(false);
const title = ref("");
const payload = ref<Todo>({
  id: 0,
  title: "",
  completed: false,
});

const randomNumber = ref(0);

const onOpendDeleted = (todo: Todo) => {
  isDialogDelete.value = true;
  payload.value = todo;
};

const openEditDialog = (todo: Todo) => {
  isDialogEditOpen.value = true;
  payload.value = todo;
};

function generateNumber() {
  // Generate a random number between 1 and 100
  randomNumber.value = Math.floor(Math.random() * 100) + 1;
}

// Call addTodo with the input value
const onAddTodo = () => {
  generateNumber();
  const payload: Todo = {
    title: title.value.trim(),
    completed: false,
    id: randomNumber.value,
  };
  if (!payload.title) return; // prevent empty

  todoStore.addTodo(payload);
  title.value = ""; // clear input
};

// Wrapper function to call store action
const remove = (id: number) => {
  todoStore.removeTodo(id);
  isDialogDelete.value = false;
};

const onEdit = (payload: Todo) => {
  todoStore.editTodo(payload);
  isDialogEditOpen.value = false;
};

onMounted(() => {
  todoStore.fetchTodos();
});

const remaining = computed(
  () => todoStore.todos.filter((t) => !t.completed).length
);
</script>
