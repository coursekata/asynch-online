<script setup lang="ts">
// Renders the accompanying recording. Vimeo is the default host; YouTube is
// supported so a lecture can fall back without a content rewrite.
//
// The Vimeo query params and the `allow` list below match the embed code Vimeo
// hands out in its share dialog. The player.js script from that snippet is only
// needed to drive the player through the JS API, so it is deliberately omitted.
const props = defineProps<{
  provider?: 'vimeo' | 'youtube'
  id: string
  hash?: string
  title?: string
}>()

const src = computed(() => {
  if (props.provider === 'youtube') {
    return `https://www.youtube-nocookie.com/embed/${props.id}?rel=0`
  }
  const params = new URLSearchParams({
    badge: '0',
    autopause: '0',
    player_id: '0',
    app_id: '58479',
    // Hide Vimeo's own title/byline overlay — the page already labels every
    // video, and the raw upload titles carry internal course codes.
    title: '0',
    byline: '0',
    portrait: '0',
  })
  // Unlisted videos with link-privacy enabled need their hash to play.
  if (props.hash) params.set('h', props.hash)
  return `https://player.vimeo.com/video/${props.id}?${params}`
})
</script>

<template>
  <div class="aspect-video w-full overflow-hidden rounded-lg bg-black shadow-sm">
    <iframe
      :src="src"
      :title="title ?? 'Lecture video'"
      class="h-full w-full"
      frameborder="0"
      allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share"
      referrerpolicy="strict-origin-when-cross-origin"
      loading="lazy"
      allowfullscreen
    />
  </div>
</template>
