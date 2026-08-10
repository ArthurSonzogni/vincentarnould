<template>
  <div>
  <NuxtImg class="cover-image"
       v-if="collection.cover_image"
       :src="collection.cover_image"
       sizes="sm:100vw md:100vw lg:100vw"
       format="webp"
       fetchpriority="high"
       :alt="collection.title"
       />

  <div class="max-w-6xl mx-auto p-6 mt-20">
    <!--Display the product.cover_image-->

    <h1 class="title font-title">
      {{ collection.title }}
    </h1>

    <p class="description">
      {{ collection.description }}
    </p>

  </div>


  <div class="max-w-6xl mx-auto p-6 mt-20">
    <div class="products-list">
      <div v-for="product in products" :key="product.url" class="products">
           <NuxtLink :to="`/product/${product.url}`"> 
           <NuxtImg class="miniature mx-auto"
                v-if="product.variants?.[0]?.images?.[0]"
                :src="product.variants[0].images[0].image"
                sizes="sm:100vw md:300px lg:300px"
                format="webp"
                loading="eager"
                decoding="async"
                :alt="product.title"
                />
           <h2>{{ product.title }}</h2>
           <p class="price">{{ product.variants?.[0]?.price || 'Sur demande' }}</p>
           </NuxtLink>
      </div>
    </div>

  </div>

  <div class="lg:max-w-6xl lg:mx-auto lg:p-6">
    <!--Iterate over the models images: collection.images into a nuxt/ui
      UCarousel component.-->
      <UCarousel
        v-slot="{ item }"
        orientation="horizontal"
        :items="collection.images"
        class="carousel mx-auto"
        :autoplay="{ delay: 4000 }"
        :ui="{ item: 'lg:basis-1/3 md:basis-1/2 sd:basis-full' }"
        dots
        >
        <NuxtImg
          v-if="item.image"
          :src="item.image"
          sizes="sm:100vw md:50vw lg:33vw"
          format="webp"
          loading="eager"
          decoding="async"
          :alt="collection.title"
          class="rounded-lg"
          />
      </UCarousel>
  </div>

  </div>
</template>

<script setup lang="ts">

import { GetCollections } from '/composables/collections';
import { AbsoluteUrl, CanonicalUrl, SITE_NAME } from '/composables/site';

const route = useRoute();
const url = route.params.url;
const collections = await GetCollections();
const collection = collections[url];
const products = collection.products;

const seoTitle = `${collection.title} | ${SITE_NAME}`;

useSeoMeta({
  title: seoTitle,
  description: collection.description,
  ogTitle: seoTitle,
  ogDescription: collection.description,
  ogImage: AbsoluteUrl(collection.cover_image || products?.[0]?.variants?.[0]?.images?.[0]?.image),
  ogUrl: CanonicalUrl(`/collection/${url}`),
  ogType: 'website',
  twitterCard: 'summary_large_image',
});

// Le fil d'Ariane s'affiche sous le titre dans les resultats Google, a la place
// de l'URL brute ; la liste de produits aide a rattacher chaque fiche a sa
// collection.
useHead({
  script: [{
    type: 'application/ld+json',
    innerHTML: JSON.stringify({
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Accueil', item: CanonicalUrl('/') },
            { '@type': 'ListItem', position: 2, name: collection.title, item: CanonicalUrl(`/collection/${url}`) },
          ],
        },
        {
          '@type': 'CollectionPage',
          name: collection.title,
          description: collection.description,
          url: CanonicalUrl(`/collection/${url}`),
          mainEntity: {
            '@type': 'ItemList',
            itemListElement: products.map((product, index) => ({
              '@type': 'ListItem',
              position: index + 1,
              name: product.title,
              url: CanonicalUrl(`/product/${product.url}`),
            })),
          },
        },
      ],
    }),
  }],
});
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

.title {
  text-wrap: balance;
}

.description {
  text-wrap: pretty;
}

.products h2 {
  text-wrap: balance;
}

</style>
