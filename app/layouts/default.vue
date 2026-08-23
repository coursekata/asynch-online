<script setup lang="ts">
const { site } = useAppConfig()
</script>

<template>
  <div class="min-h-screen flex flex-col">
    <header class="bg-[var(--ck-indigo)] text-white">
      <div class="mx-auto max-w-6xl px-6 py-4 flex items-center gap-4">
        <NuxtLink to="/" class="flex items-center gap-3">
          <img src="/ck-logo-white.png" alt="CourseKata" class="h-7 w-auto">
          <span class="font-display text-lg">{{ site.title }}</span>
        </NuxtLink>
      </div>
    </header>

    <main class="flex-1">
      <slot />
    </main>

    <footer class="border-t border-[var(--border-light)] bg-[var(--bg-card)]">
      <div class="mx-auto max-w-6xl px-6 py-6 text-sm text-[var(--text-tertiary)]">
        {{ site.footer }}
      </div>
    </footer>
  </div>
</template>
