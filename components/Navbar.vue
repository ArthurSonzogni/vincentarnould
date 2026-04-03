<script setup lang="ts">
import { GetCollections } from '/composables/collections';

const open = ref(false);

const { data: home } = await useAsyncData(() =>
  queryCollection('content').path('/').first()
);

const collections = await GetCollections();

const logo = home.value?.meta?.logo;

</script>

<template>
  <USlideover
    side="left"
    v-model:open="open"
  >
    <!-- Un bouton hamburger chic flottant (Trigger) -->
    <button
      class="fixed top-6 left-6 z-50 bg-black/20 hover:bg-black/40 backdrop-blur-md text-white border border-white/30 rounded-full w-12 h-12 flex items-center justify-center transition-all duration-300"
    >
      <UIcon name="i-lucide-menu" class="size-6" />
    </button>

    <template #body>
      <div class="flex flex-col h-full bg-white">
        <!-- En-tête avec le logo -->
        <div class="flex items-center justify-center py-10 border-b border-gray-100 relative">
          <img v-if="logo" :src="logo" alt="Logo" class="h-32 object-contain" />
        </div>

        <!-- Corps du menu -->
        <div class="flex-1 overflow-y-auto px-8 py-8">
          <div class="flex flex-col gap-6">
            <NuxtLink to="/" class="nav-item font-title text-xl tracking-wider text-gray-900 hover:text-yellow-600 transition-colors" @click="open = false">
              Accueil
            </NuxtLink>

            <div class="w-8 h-px bg-yellow-600/50 my-2"></div>

            <div v-for="(collection, index) in Object.values(collections)" :key="index" class="collection-group">
              <NuxtLink :to="collection.path" class="font-title text-lg tracking-widest text-gray-900 uppercase mb-4 block hover:text-yellow-600 transition-colors" @click="open = false">
                {{ collection.title }}
              </NuxtLink>
              
              <ul class="flex flex-col gap-3 pl-4 border-l border-gray-100">
                <li v-for="(product, idx) in collection.products" :key="idx">
                  <NuxtLink :to="product.path" class="text-gray-500 hover:text-gray-900 text-sm tracking-wide transition-colors" @click="open = false">
                    {{ product.title }}
                  </NuxtLink>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <!-- Pied de page légal -->
        <div class="p-8 border-t border-gray-100 bg-gray-50 flex flex-col gap-2 text-xs text-gray-400">
          <NuxtLink to="/cgu" class="hover:text-gray-600 transition-colors" @click="open = false">
            Conditions Générales d'Utilisation
          </NuxtLink>
          <NuxtLink to="/cgv" class="hover:text-gray-600 transition-colors" @click="open = false">
            Conditions Générales de Vente
          </NuxtLink>
        </div>
      </div>
    </template>
  </USlideover>
</template>

<style scoped lang="scss">
.nav-item {
  position: relative;
  width: fit-content;
}
.nav-item::after {
  content: '';
  position: absolute;
  bottom: -4px;
  left: 0;
  width: 0;
  height: 1px;
  background-color: #ca8a04; /* yellow-600 */
  transition: width 0.3s ease;
}
.nav-item:hover::after {
  width: 100%;
}
</style>
