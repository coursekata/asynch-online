<script setup lang="ts">
// The nbconvert render is a complete standalone HTML document with its own
// stylesheet, so it goes in an iframe rather than inline — that keeps notebook
// CSS from leaking into the page.
defineProps<{ src: string; height?: string }>()
</script>

<template>
  <div class="overflow-hidden rounded-lg border border-[var(--border-medium)] bg-white">
    <iframe
      :src="src"
      title="Notebook preview"
      class="w-full"
      :style="{ height: height ?? '70vh' }"
      loading="lazy"
    />
  </div>
</template>
