<template>
  <div class="max-w-4xl mx-auto p-6">
    <ContentRenderer :value="document"  class="about p-5" />

    <div class="text-center mt-8">
      <NuxtLink
        to="/"
        class="text-lg text-gray-700 hover:text-gray-900 dark:text-gray-300
        dark:hover:text-white ml-4"
        >
        Accueil
      </NuxtLink>

      <button
        @click="scrollToTop"
        class="cursor-pointer text-lg text-gray-700 hover:text-gray-900 dark:text-gray-300
        dark:hover:text-white ml-4"
        >
        Retour en haut
      </button>

    </div>
  </div>
</template>

<script lang="ts" setup>

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const { data: document } = await useAsyncData(() =>
  queryCollection('content').path('/mentions-legales').first()
);

const seoTitle = 'Mentions légales | Vincent Arnould';

useSeoMeta({
  title: seoTitle,
  description: "Mentions légales du site Vincent Arnould : éditeur, hébergeur et coordonnées.",
  ogTitle: seoTitle,
  ogDescription: "Mentions légales du site Vincent Arnould : éditeur, hébergeur et coordonnées.",
});
</script>

<style scoped>
.about :deep(h1),
.about :deep(h2),
.about :deep(h3) {
  text-wrap: balance;
  margin-top: 2rem;
  margin-bottom: 1rem;
  font-weight: bold;
}

.about :deep(p) {
  text-wrap: pretty;
  margin-bottom: 1rem;
  line-height: 1.7;
}

.cursor-pointer {
  cursor: pointer;
}
</style>
