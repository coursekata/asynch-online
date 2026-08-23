<script setup lang="ts">
const route = useRoute()
const slug = route.params.slug as string

const { data: item } = await useAsyncData(`session-${slug}`, () =>
  queryCollection('teachingResources').path(`/resources/${slug}`).first(),
)

if (!item.value) {
  throw createError({ statusCode: 404, statusMessage: 'Session not found', fatal: true })
}

useHead({ title: item.value.title })

// Frontmatter stores root-relative paths; GitHub Pages serves the site from
// /<repo>/, so asset URLs need the base prefix that NuxtLink applies for us.
const base = useRuntimeConfig().app.baseURL.replace(/\/$/, '')
const withBase = (p: string) => `${base}${p}`

const { data: all } = await useAsyncData('sessions-nav', () =>
  queryCollection('teachingResources').where('published', '=', true).order('sequence', 'ASC').all(),
)
const idx = computed(() => all.value?.findIndex((s) => s.path === item.value!.path) ?? -1)
const prev = computed(() => (idx.value > 0 ? all.value![idx.value - 1] : null))
const next = computed(() =>
  idx.value >= 0 && idx.value < (all.value?.length ?? 0) - 1 ? all.value![idx.value + 1] : null,
)
</script>

<template>
  <div v-if="item" class="mx-auto max-w-6xl px-6 py-10">
    <NuxtLink to="/" class="text-sm text-[var(--ck-primary)] hover:underline">← All lectures</NuxtLink>

    <header class="mt-4">
      <div class="flex flex-wrap items-center gap-2 text-xs">
        <span class="rounded bg-[var(--ck-primary-light)] px-2 py-0.5 font-mono text-[var(--ck-primary)]">
          Lecture {{ item.sequence }}
        </span>
      </div>

      <h1 class="mt-2 font-display text-3xl text-[var(--text-primary)]">{{ item.title }}</h1>
      <p class="mt-2 max-w-3xl text-[var(--text-secondary)]">{{ item.description }}</p>

      <dl v-if="item.coverage" class="mt-4 flex flex-wrap gap-x-8 gap-y-2 text-sm">
        <div v-if="item.coverage.abc">
          <dt class="text-xs uppercase tracking-wide text-[var(--text-tertiary)]">ABC / ABCD</dt>
          <dd class="font-mono text-[var(--text-primary)]">{{ item.coverage.abc }}</dd>
        </div>
        <div v-if="item.coverage.xcd">
          <dt class="text-xs uppercase tracking-wide text-[var(--text-tertiary)]">XCD</dt>
          <dd class="font-mono text-[var(--text-primary)]">{{ item.coverage.xcd }}</dd>
        </div>
        <div v-if="item.dataset">
          <dt class="text-xs uppercase tracking-wide text-[var(--text-tertiary)]">Data</dt>
          <dd class="text-[var(--text-primary)]">{{ item.dataset }}</dd>
        </div>
      </dl>
    </header>

    <div class="mt-8 grid gap-8 lg:grid-cols-[3fr_2fr]">
      <section>
        <h2 class="mb-3 flex items-baseline gap-3 font-display text-xl">
          Video
          <span v-if="item.video?.duration" class="font-mono text-sm font-normal text-[var(--text-tertiary)]">
            {{ item.video.duration }}
          </span>
        </h2>
        <VideoEmbed
          v-if="item.video?.id"
          :provider="item.video.provider"
          :id="item.video.id"
          :hash="item.video.hash"
          :title="item.title"
        />
        <p
          v-else
          class="flex aspect-video items-center justify-center rounded-lg border border-dashed border-[var(--border-medium)] text-sm text-[var(--text-tertiary)]"
        >
          Video coming soon.
        </p>
      </section>

      <aside>
        <h2 class="mb-3 font-display text-xl">Files</h2>
        <ul class="space-y-1.5">
          <li v-for="f in item.files" :key="f.src">
            <a
              :href="withBase(f.src)"
              download
              class="flex items-center justify-between gap-3 rounded border border-[var(--border-light)] bg-[var(--bg-card)] px-3 py-2 text-sm hover:border-[var(--ck-primary-mid)]"
            >
              <span>{{ f.label }}</span>
              <span class="font-mono text-xs text-[var(--text-tertiary)]">
                .{{ f.src.split('.').pop() }}
              </span>
            </a>
          </li>
        </ul>

        <div v-if="item.tags?.length" class="mt-6">
          <p class="mb-1.5 text-xs uppercase tracking-wide text-[var(--text-tertiary)]">Topics</p>
          <div class="flex flex-wrap gap-1.5">
            <span
              v-for="t in item.tags"
              :key="t"
              class="rounded bg-[var(--ck-primary-light)] px-2 py-0.5 text-xs text-[var(--ck-primary)]"
            >{{ t }}</span>
          </div>
        </div>
      </aside>
    </div>

    <section v-if="item.preview" class="mt-10">
      <h2 class="mb-3 font-display text-xl">Notebook preview</h2>
      <NotebookPreview :src="withBase(item.preview)" />
    </section>

    <nav class="mt-12 flex justify-between gap-4 border-t border-[var(--border-light)] pt-6 text-sm">
      <NuxtLink v-if="prev" :to="prev.path" class="text-[var(--ck-primary)] hover:underline">
        ← {{ prev.title }}
      </NuxtLink>
      <span v-else />
      <NuxtLink v-if="next" :to="next.path" class="text-right text-[var(--ck-primary)] hover:underline">
        {{ next.title }} →
      </NuxtLink>
    </nav>
  </div>
</template>
