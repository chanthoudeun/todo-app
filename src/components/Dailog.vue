<template>
  <div class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
    <!-- Dialog box -->
    <div class="bg-white rounded-lg shadow-lg p-6 w-96 relative">
      <h2 class="text-xl font-semibold mb-4">{{ title }}</h2>

      <!-- Body -->
      <div class="p-3">
        <slot />
      </div>

      <!-- Buttons -->
      <div class="flex justify-end gap-2">
        <button
          class="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
          @click="emit('no')"
        >
          {{ noText }}
        </button>
        <button
          class="px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600"
          @click="emit('yes')"
        >
          {{ yesText }}
        </button>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
const props = defineProps({
  title: {
    type: String,
    default: "Confirm",
  },
  yesText: {
    type: String,
    default: "Yes",
  },
  noText: {
    type: String,
    default: "No",
  },
  loading: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["yes", "no"]);
</script>
