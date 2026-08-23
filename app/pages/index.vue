<script setup lang="ts">
const { site } = useAppConfig()

const { data: sessions } = await useAsyncData('sessions', () =>
  queryCollection('teachingResources')
    .where('published', '=', true)
    .order('sequence', 'ASC')
    .all(),
)

const { data: instructors } = await useAsyncData('instructors', () =>
  queryCollection('instructors').order('sequence', 'ASC').all(),
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

    <section v-if="instructors?.length" class="mt-10">
      <h2 class="font-display text-xl text-[var(--text-primary)]">Meet the instructors</h2>
      <p class="mt-1 max-w-3xl text-sm text-[var(--text-secondary)]">
        The instructors you'll see throughout the lecture videos. Annie Ditta led
        the creation of these materials, and her introduction goes into the most
        depth about the course. Jim Stigler also appears throughout the lectures.
      </p>

      <ul class="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <li
          v-for="p in instructors"
          :key="p.name"
          class="rounded-lg border border-[var(--border-light)] bg-[var(--bg-card)] p-4"
        >
          <VideoEmbed
            :provider="p.video.provider"
            :id="p.video.id"
            :hash="p.video.hash"
            :title="`${p.name} — introduction`"
          />
          <div class="mt-3 flex items-baseline justify-between gap-2">
            <p class="font-display text-[var(--text-primary)]">{{ p.name }}</p>
            <span v-if="p.video.duration" class="font-mono text-xs text-[var(--text-tertiary)]">
              {{ p.video.duration }}
            </span>
          </div>
        </li>
      </ul>
    </section>

    <h2 class="mt-12 font-display text-xl text-[var(--text-primary)]">Lectures</h2>

    <ul class="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <li v-for="s in sessions" :key="s.path">
        <NuxtLink
          :to="s.path"
          class="flex h-full flex-col rounded-lg border border-[var(--border-light)] bg-[var(--bg-card)] p-5 transition hover:border-[var(--ck-primary-mid)] hover:bg-[var(--bg-hover)]"
        >
          <div class="flex items-center gap-2 text-xs">
            <span class="rounded bg-[var(--ck-primary-light)] px-2 py-0.5 font-mono text-[var(--ck-primary)]">
              Lecture {{ s.sequence }}
            </span>
            <span v-if="s.video?.duration" class="ml-auto font-mono text-[var(--text-tertiary)]">
              {{ s.video.duration }}
            </span>
            <span v-else-if="!s.video?.id" class="ml-auto text-[var(--text-tertiary)]">no video yet</span>
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
