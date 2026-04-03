<template>
  <div>
    <div class="main-container">
      <div class="images">
        <img class="image"
             v-for="(image, index) in product?.meta?.variants?.[variant]?.images"
             :key="index"
             :src="image.image"
             />
      </div>

      <div class="details">
        <div class="details-content">
          <div class="small_screen">
            <div>
              <span class="title mr-6">
                {{ product.title }}
              </span>
              <span class="price">{{ product?.meta?.variants?.[variant]?.price }}</span>
            </div>
            <div class="variant-selector">
              <span class="title">Variante</span>
              <select
                v-model="variant"
                class="form-select"
                >
                <option
                  v-for="(v, index) in product?.meta?.variants"
                  :key="index"
                  :value="index"
                  >
                  {{ v.title }}
                </option>
              </select>
            </div>

            <UButton
              v-if="product?.meta?.variants?.[variant]?.payment_link"
              :href="product?.meta?.variants?.[variant]?.payment_link"
              icon="fa6-solid:basket-shopping"
              color="primary"
              variant="soft"
              class="mt-4"
              >
              Acheter
            </UButton>
            <div v-if="product?.meta?.variants?.[variant]?.payment_link" class="klarna-advertisement text-center">
              Payez en 3x sans frais avec Klarna
            </div>
            <div class="reassurance text-center mt-6 text-sm text-gray-600 flex flex-col gap-2">
              <div class="flex items-center justify-center gap-2">
                <UIcon name="i-lucide-shield-check" class="text-green-600 size-4" />
                <span>S.A.V. à vie pour les gemmes</span>
              </div>
              <div class="flex items-center justify-center gap-2">
                <UIcon name="i-lucide-hammer" class="text-yellow-600 size-4" />
                <span>Fait main en France</span>
              </div>
              <div class="flex items-center justify-center gap-2">
                <UIcon name="i-lucide-truck" class="text-blue-600 size-4" />
                <span>Livraison sécurisée</span>
              </div>
            </div>
          </div>

          <div class="large_screen">
            <h1 class="title font-title mr-6">
              {{ product.title }} /
              {{ product?.meta?.variants?.[variant]?.title }}
            </h1>
            <span class="price">{{ product?.meta?.variants?.[variant]?.price }}</span>
            <hr />
            <p>{{ product.description }}</p>
            <hr />

            <div class="variant-selector">
              <span class="title">Variante</span>
              <select
                v-model="variant"
                class="form-select"
                >
                <option
                  v-for="(v, index) in product?.meta?.variants"
                  :key="index"
                  :value="index"
                  >
                  {{ v.title }}
                </option>
              </select>

            </div>

            <UButton
              v-if="product?.meta?.variants?.[variant]?.payment_link"
              :href="product?.meta?.variants?.[variant]?.payment_link"
              color="neutral"
              variant="soft"
              size="xl"
              icon="fa6-solid:basket-shopping"
              >
              Acheter
            </UButton>
            <div v-if="product?.meta?.variants?.[variant]?.payment_link" class="klarna-advertisement">
              Payez en 3x sans frais avec Klarna
            </div>
            <div class="reassurance mt-6 text-sm text-gray-600 flex flex-col gap-2">
              <div class="flex items-center gap-2">
                <UIcon name="i-lucide-shield-check" class="text-green-600 size-4" />
                <span>S.A.V. à vie pour les gemmes</span>
              </div>
              <div class="flex items-center gap-2">
                <UIcon name="i-lucide-hammer" class="text-yellow-600 size-4" />
                <span>Fait main en France</span>
              </div>
              <div class="flex items-center gap-2">
                <UIcon name="i-lucide-truck" class="text-blue-600 size-4" />
                <span>Livraison sécurisée</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="container">
      <ContentRenderer
        class="markdown p-5"
        :value="product"
        >
      </ContentRenderer>
    </div>

    <hr/>

    <template v-for="collection in Object
      .values(collections)

    ">

      <div class="container">
        <NuxtLink :to="collection.path">
        <h1 class="other-product title font-title">{{ collection.title }}</h1>
        </NuxtLink>

        <div class="other-products-list">
          <div
            v-for="(product, index) in collection.products"
            :key="index"
            class="other-product"
            >
            <NuxtLink :to="product.path"> 
            <img class="miniature"
                 v-if="product?.meta?.variants?.[0]?.images?.[0]"
                 :key="index"
                 :src="product?.meta?.variants?.[0]?.images?.[0]?.image"
                 />
            <h2>{{ product.title }}</h2>
            <p class="price">{{ product?.meta?.variants?.[0]?.price }}</p>
            </NuxtLink>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">

import { GetCollections } from '/composables/collections';

const route = useRoute();
const router = useRouter();

const config = useRuntimeConfig();

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
variant.value = Math.min(
  Math.max(variant.value, 0),
  (product?.meta?.variants?.length || 1) - 1
);
watch([variant], () => {
  router.replace({
    query: {
      variant: variant.value.toString(),
    },
  });
  // Reset scroll position to the top of the page when variant changes
  window.scrollTo(0, 0);
});

useSeoMeta({
  title: `${product.title} | Vincent Arnould`,
  description: product.description,
  ogTitle: `${product.title} | Vincent Arnould`,
  ogDescription: product.description,
  ogImage: () => product?.meta?.variants?.[variant.value]?.images?.[0]?.image || '',
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
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
}

.other-product {
  --width: 300px;
  max-width: var(--width);
  margin: 20px;
}

.miniature {
  width: var(--width);
  height: var(--width);
  object-fit: cover;
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
