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
          v-model="newTitle"
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
            >
              {{ task.title }}
            </span>
          </div>
          <div>
            <button
              @click="onOpendDeleted(task.id)"
              class="bg-red-700 hover:bg-gray-700 px-3 rounded-lg"
            >
              Deleted
            </button>
            <button @click="openDialog(task.id, task)">edit</button>
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
    @yes="remove(editId)"
    title="Delete Todo"
  >
    <p>Are you sure to delete this todo?</p>
  </Dailog>
  <Dailog
    v-if="isDialogOpen"
    @no="isDialogOpen = false"
    @yes="onEdit(editId, editTitle)"
    title="Edit Todo"
  >
    <input
      type="text"
      placeholder="Add new task"
      v-model="editTitle"
      class="border-b border-gray-400 focus:outline-none py-1 text-sm mb-4"
    />
  </Dailog>
</template>
<script setup lang="ts">
import { onMounted, computed, ref } from "vue";
import { type TodoPayload, useTodoStore } from "./../store/todo";
import Dailog from "../components/Dailog.vue";

const todoStore = useTodoStore();
const isDialogOpen = ref(false);
const isDialogDelete = ref(false);
const newTitle = ref("");
const editId = ref(0);
const editTitle = ref("");

const randomNumber = ref(0);

const onOpendDeleted = (id: number) => {
  isDialogDelete.value = true;
  editId.value = id;
};

const openDialog = (id: number, payload: TodoPayload) => {
  isDialogOpen.value = true;
  editTitle.value = payload.title;
  editId.value = id;
};

function generateNumber() {
  // Generate a random number between 1 and 100
  randomNumber.value = Math.floor(Math.random() * 100) + 1;
}

// Call addTodo with the input value
const onAddTodo = () => {
  generateNumber();
  const payload: TodoPayload = {
    title: newTitle.value.trim(),
    id: randomNumber.value,
  };
  if (!payload.title) return; // prevent empty

  todoStore.addTodo(payload);
  newTitle.value = ""; // clear input
};

// Wrapper function to call store action
const remove = (id: number) => {
  todoStore.removeTodo(id);
  isDialogDelete.value = false;
};

const onEdit = (id: number, text: string) => {
  const payload: TodoPayload = {
    title: text.trim(),
    id: editId.value,
  };
  todoStore.editTodo(id, payload);
  isDialogOpen.value = false;
};

onMounted(() => {
  todoStore.fetchTodos();
});

const remaining = computed(
  () => todoStore.todos.filter((t) => !t.completed).length
);
</script>
