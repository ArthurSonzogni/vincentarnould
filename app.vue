<script setup lang="ts">
import { CanonicalUrl, NOINDEX } from '/composables/site';

const route = useRoute();

// Une seule URL canonique par page, declaree partout : le site repond aussi
// bien avec que sans slash final, et Google traiterait sinon les deux comme des
// pages distinctes en double.
const canonical = computed(() => CanonicalUrl(route.path));

const noindex = computed(() =>
  NOINDEX.includes(`/${route.path.replace(/^\/+|\/+$/g, '')}`) || route.path.startsWith('/audit')
);

useHead({
  link: [{ rel: 'canonical', href: canonical }],
  meta: [{ name: 'robots', content: () => (noindex.value ? 'noindex, follow' : 'index, follow') }],
});
</script>

<template>
   <UApp>
    <Navbar />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
    <SiteFooter />
  </UApp>
</template>

<style lang="scss">

body {
  box-sizing: border-box;
  font-family: "Playfair", sans-serif;
  margin: 0;
  padding: 0;
}

.font-title {
  font-family: "Cinzel", sans-serif;
} 

.page-enter-active {
  transition: all 0.3s;
}

.page-leave-active {
  transition: all 0.3s;
}

.page-enter-from {
  opacity: 0;
  transform: translate(50px, 0);
}

.page-leave-to {
  opacity: 0;
  transform: translate(-50px, 0);
}
</style>
