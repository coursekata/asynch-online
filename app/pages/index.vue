<script setup lang="ts">
const { site } = useAppConfig()

const { data: sessions } = await useAsyncData('sessions', () =>
  queryCollection('teachingResources')
    .where('published', '=', true)
    .order('sequence', 'ASC')
    .all(),
)

useHead({ title: site.title })
</script>

<template>
  <div class="mx-auto max-w-6xl px-6 py-10">
    <h1 class="font-display text-3xl text-[var(--text-primary)]">{{ site.title }}</h1>
    <p class="mt-2 max-w-2xl text-[var(--text-secondary)]">{{ site.tagline }}</p>

    <p class="mt-4 max-w-3xl rounded-lg border border-[var(--border-light)] bg-[var(--bg-card)] p-4 text-sm text-[var(--text-secondary)]">
      Sixteen lecture notebooks with their accompanying recordings. Each lecture
      lists the sections it covers in both the <strong>ABC/ABCD</strong> books and
      the accelerated <strong>XCD</strong> book, so the set works with either.
    </p>

    <ul class="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <li v-for="s in sessions" :key="s.path">
        <NuxtLink
          :to="s.path"
          class="flex h-full flex-col rounded-lg border border-[var(--border-light)] bg-[var(--bg-card)] p-5 transition hover:border-[var(--ck-primary-mid)] hover:bg-[var(--bg-hover)]"
        >
          <div class="flex items-center gap-2 text-xs">
            <span class="rounded bg-[var(--ck-primary-light)] px-2 py-0.5 font-mono text-[var(--ck-primary)]">
              Lecture {{ s.sequence }}
            </span>
            <span v-if="!s.video?.id" class="ml-auto text-[var(--text-tertiary)]">no video yet</span>
          </div>

          <h2 class="mt-3 font-display text-lg leading-snug text-[var(--text-primary)]">{{ s.title }}</h2>
          <p class="mt-2 line-clamp-3 flex-1 text-sm text-[var(--text-secondary)]">{{ s.description }}</p>

          <dl v-if="s.coverage" class="mt-4 flex gap-6 border-t border-[var(--border-light)] pt-3 text-xs">
            <div v-if="s.coverage.abc">
              <dt class="text-[var(--text-tertiary)]">ABC / ABCD</dt>
              <dd class="font-mono text-[var(--text-primary)]">{{ s.coverage.abc }}</dd>
            </div>
            <div v-if="s.coverage.xcd">
              <dt class="text-[var(--text-tertiary)]">XCD</dt>
              <dd class="font-mono text-[var(--text-primary)]">{{ s.coverage.xcd }}</dd>
            </div>
          </dl>
        </NuxtLink>
      </li>
    </ul>
  </div>
</template>
