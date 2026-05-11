<template>
  <div>
  <img class="cover-image"
       v-if="collection.meta.cover_image"
       :src="collection.meta.cover_image"
       />

  <div class="max-w-6xl mx-auto p-6 mt-20">
    <!--Display the product.meta.cover_image-->

    <h1 class="title font-title">
      {{ collection.title }}
    </h1>

    <p class="description">
      {{ collection.description }}
    </p>

  </div>


  <div class="max-w-6xl mx-auto p-6 mt-20">
    <div class="products-list">
      <div v-for="product in products" class="products">
           <NuxtLink :to="product.path"> 
           <img class="miniature mx-auto"
                v-if="product.meta.variants[0].images[0]"
                :src="product.meta.variants[0].images[0].image"
                />
           <h2>{{ product.title }}</h2>
           <p class="price">{{ product.meta.variants[0].price || 'Sur demande' }}</p>
           </NuxtLink>
      </div>
    </div>

  </div>

  <div class="lg:max-w-6xl lg:mx-auto lg:p-6">
    <!--Iterate over the models images: collection.meta.images into a nuxt/ui
      UCarousel component.-->
      <UCarousel
        v-slot="{ item }"
        orientation="horizontal"
        :items="collection.meta.images"
        class="carousel mx-auto"
        :autoplay="{ delay: 4000 }"
        :ui="{ item: 'lg:basis-1/3 md:basis-1/2 sd:basis-full' }"
        dots
        >
        <img
          v-if="item.image"
          :src="item.image"
          class="rounded-lg"
          />
      </UCarousel>
  </div>

  </div>
</template>

<script setup lang="ts">

import { GetCollections } from '/composables/collections';

const config = useRuntimeConfig();
const route = useRoute();
const url = route.params.url;
const collections = await GetCollections();
const collection = collections[url];
const products = collection.products;

</script>


<style scoped lang="scss">
.products {
  padding: 20px 0;
}

.products-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
}

.products {
  --width: 300px;
  max-width: var(--width);
}

.miniature {
  width: var(--width);
  height: var(--width);
  object-fit: cover;
  border-radius: 10px;
}

.cover-image {
  width: 100%;
  height: 30lvh;
  object-fit: cover;
}

.carousel {
  margin-bottom: 80px;
}

</style>
