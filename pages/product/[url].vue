<template>
  <div>
    <div class="main-container">
      <div class="images">
        <img class="image"
             v-for="(image, index) in product?.meta?.variants?.[variant]?.images"
             :key="index"
             :src="image.image"
             :alt="`${product.title} - ${product?.meta?.variants?.[variant]?.title}`"
             />
      </div>

      <div class="details">
        <div class="details-content">
          <div class="small_screen">
            <div>
              <span class="title mr-6 text-xl">
                {{ product.title }}
              </span>
              <span class="price font-medium">{{ product?.meta?.variants?.[variant]?.price || 'Sur demande' }}</span>
            </div>
            
            <div v-if="product?.meta?.variants?.length > 1" class="variant-selector mt-4">
              <span class="text-[10px] text-gray-400 uppercase tracking-widest mb-2 block">Finitions</span>
              <div class="flex flex-wrap gap-2">
                <button
                  v-for="(v, index) in product?.meta?.variants"
                  :key="index"
                  @click="variant = index"
                  :class="[
                    'px-4 py-2 text-sm border transition-all duration-300',
                    variant === index ? 'border-black bg-black text-white' : 'border-gray-200 text-gray-600 hover:border-gray-400'
                  ]"
                >
                  {{ v.title }}
                </button>
              </div>
            </div>

            <UButton
              v-if="product?.meta?.variants?.[variant]?.payment_link"
              :href="product?.meta?.variants?.[variant]?.payment_link"
              icon="i-lucide-shopping-bag"
              color="black"
              variant="solid"
              class="mt-6 w-full justify-center py-3 text-base tracking-wider uppercase"
              >
              Commander
            </UButton>
            <div v-else class="mt-6 p-4 border border-gray-100 bg-gray-50 text-center text-sm text-gray-500 italic">
              Cette pièce est disponible sur demande. Contactez-nous pour plus d'informations.
            </div>

            <div v-if="product?.meta?.variants?.[variant]?.payment_link" class="klarna-advertisement text-center">
              Payez en 2x sans frais avec Klarna
            </div>
            <div class="reassurance text-center mt-6 text-sm text-gray-600 flex flex-col gap-2">
              <div class="flex items-center justify-center gap-2">
                <UIcon name="i-lucide-hammer" class="text-yellow-600 size-4" />
                <span>Fait main en France</span>
              </div>
            </div>
          </div>

          <div class="large_screen">
            <h1 class="title font-title text-3xl mb-2">
              {{ product.title }} 
            </h1>
            <div class="text-lg text-gray-600 mb-6">
               {{ product?.meta?.variants?.[variant]?.title }}
            </div>
            <span class="price text-2xl">{{ product?.meta?.variants?.[variant]?.price || 'Sur demande' }}</span>
            <hr class="my-8" />
            <p class="text-gray-700 leading-relaxed">{{ product.description }}</p>
            <hr class="my-8" />

            <div v-if="product?.meta?.variants?.length > 1" class="variant-selector mt-8">
              <span class="text-xs text-gray-400 uppercase tracking-widest mb-3 block">Finitions disponibles</span>
              <div class="flex flex-wrap gap-3">
                <button
                  v-for="(v, index) in product?.meta?.variants"
                  :key="index"
                  @click="variant = index"
                  :class="[
                    'px-6 py-3 border transition-all duration-300 tracking-wide',
                    variant === index ? 'border-black bg-black text-white' : 'border-gray-200 text-gray-600 hover:border-gray-400'
                  ]"
                >
                  {{ v.title }}
                </button>
              </div>
            </div>

            <UButton
              v-if="product?.meta?.variants?.[variant]?.payment_link"
              :href="product?.meta?.variants?.[variant]?.payment_link"
              color="black"
              variant="solid"
              size="xl"
              icon="i-lucide-shopping-bag"
              class="w-full justify-center mt-8 py-4 text-base tracking-wider uppercase"
              >
              Commander
            </UButton>
            <div v-else class="mt-8 p-6 border border-gray-100 bg-gray-50 text-center text-gray-500 italic">
              Cette pièce d'exception est disponible sur demande. <br/>
              <a href="mailto:vinc388@hotmail.fr" class="underline hover:text-black transition-colors">Contactez Vincent Arnould</a> pour personnaliser votre commande.
            </div>

            <div v-if="product?.meta?.variants?.[variant]?.payment_link" class="klarna-advertisement">
              Payez en 2x sans frais avec Klarna
            </div>
            <div class="reassurance mt-8 text-sm text-gray-600 flex flex-col gap-2">
              <div class="flex items-center gap-2">
                <UIcon name="i-lucide-hammer" class="text-yellow-600 size-4" />
                <span>Artisanat d'excellence - Fait main en France</span>
              </div>
              <div class="flex items-center gap-2">
                <UIcon name="i-lucide-shield-check" class="text-yellow-600 size-4" />
                <span>Paiement sécurisé</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="container max-w-4xl">
      <ContentRenderer
        v-if="product"
        class="markdown p-8 lg:p-12 text-lg leading-loose"
        :value="product"
        >
      </ContentRenderer>
    </div>

    <hr class="border-gray-100" />

    <template v-for="collection in Object.values(collections)">
      <div v-if="collection.products.length > 0 && collection.meta.url !== product.meta.collection" class="container mt-24 mb-24">
        <div class="text-center mb-12">
          <h2 class="text-xs tracking-[0.3em] text-gray-400 uppercase mb-3">Découvrir aussi</h2>
          <h1 class="text-4xl font-title">{{ collection.title }}</h1>
        </div>

        <div class="other-products-list">
          <NuxtLink 
            v-for="(p, index) in collection.products"
            :key="index"
            :to="p.meta.url === product.meta.url ? null : `/product/${p.meta.url}`"
            :class="['other-product group', p.meta.url === product.meta.url ? 'opacity-50 cursor-default' : '']"
          >
            <div class="image-wrapper aspect-square bg-gray-50 overflow-hidden">
              <img class="miniature w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                   v-if="p?.meta?.variants?.[0]?.images?.[0]"
                   :src="p?.meta?.variants?.[0]?.images?.[0]?.image"
                   :alt="p.title"
              />
            </div>
            <div class="product-info mt-6 text-center">
              <h3 class="text-xl font-title mb-2 group-hover:text-yellow-700 transition-colors">{{ p.title }}</h3>
              <p class="text-sm tracking-widest text-gray-400 uppercase">{{ p?.meta?.variants?.[0]?.price || 'Sur demande' }}</p>
            </div>
          </NuxtLink>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">

import { GetCollections } from '/composables/collections';

const route = useRoute();
const router = useRouter();

const url = useRoute().params.url;
const product = await queryCollection('product').path(`/product/${url}`).first();
const collections = await GetCollections();

const variant = ref(0);
try {
  if (route.query.variant) {
    variant.value = parseInt(route.query.variant as string, 10);
  }
} catch (e) {
  console.error('Invalid variant query parameter:', e);
}

const variantsLength = product?.variants?.length || 1;
variant.value = Math.min(
  Math.max(variant.value, 0),
  variantsLength - 1
);

watch([variant], () => {
  router.replace({
    query: {
      variant: variant.value.toString(),
    },
  });
  window.scrollTo(0, 0);
});

useSeoMeta({
  title: `${product?.title} | Vincent Arnould`,
  description: product?.description,
  ogTitle: `${product?.title} | Vincent Arnould`,
  ogDescription: product?.description,
  ogImage: () => product?.variants?.[variant.value]?.images?.[0]?.image || '',
  twitterCard: 'summary_large_image',
});
</script>

<style scoped lang="scss">

html {
  scroll-behavior: smooth;
  box-sizing: border-box;
}



.container {
  margin: 0 auto;
}

.main-container {
  display: flex;
  justify-content: space-between;
  align-items: stretch;
  flex-wrap: nowrap;

  @media (min-width: 800px) {
    flex-direction: row;
  }
  @media (max-width: 800px) {
    flex-direction: column;
  }
}

.images {
  display: flex;
  justify-content: center;
  flex-direction: column;
  @media (min-width: 800px) {
    width: 50vw;
  }
  @media (max-width: 800px) {
    width: 100vw;
  }
}

.image {
  width: 100%;

  @media (max-width: 800px) {
    width: 100vw;
  }
}

// The content stick to the top of the screen.
.details {
  @media (min-width: 800px) {
    width: 50vw;
  }
  @media (max-width: 800px) {
    width: 100vw;
    position:sticky;
    bottom: 0;
    background-color: white;
  }
}

.details-content {
  margin: 20px;
  @media (min-width: 800px) {
    position: sticky;
    top: 50%;
    transform: translateY(-50%);
  }
}

.title {
  font-weight: bold;
}

.klarna-advertisement {
  font-size: 0.8rem;
  color: #666;
  margin-top: 8px;
}

pre {
  overflow: scroll;
}

hr {
  margin: 20px 0;
  color: rgba(0, 0, 0, 0.1);
}



.other-products-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 2rem;
  padding: 0 1rem;
}

.other-product {
  text-decoration: none;
  color: inherit;
}

.other-product .image-wrapper {
  overflow: hidden;
  background-color: #f9f9f9;
}

.miniature {
  width: 100%;
  aspect-ratio: 1;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.other-product:hover .miniature {
  transform: scale(1.05);
}

.large_screen{
  @media (max-width: 800px) {
    display: none;
  }
}

.small_screen{
  @media (min-width: 800px) {
    display: none;
  }
}

</style>
