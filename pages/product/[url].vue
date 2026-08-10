<template>
  <div v-if="product">
    <div class="main-container">
      <div class="images">
        <!-- Chargement immediat, volontairement. Ces photos n'ont pas de hauteur
             declaree (leurs proportions varient de 1:2 a 3:2) : en "lazy" elles
             occupent 0 px, et le chargement de l'une repousse les suivantes hors
             de l'ecran, si bien qu'elles ne se chargent jamais. Une fois
             converties en WebP elles pesent ~40 Ko piece, le gain ne justifie
             pas le risque. La premiere reste prioritaire (c'est le LCP). -->
        <NuxtImg class="image"
             v-for="(image, index) in product?.variants?.[variant]?.images"
             :key="index"
             :src="image.image"
             sizes="sm:100vw md:50vw lg:50vw"
             format="webp"
             loading="eager"
             :fetchpriority="index === 0 ? 'high' : 'auto'"
             decoding="async"
             :alt="`${product.title} - ${product?.variants?.[variant]?.title}`"
             />
      </div>

      <div class="details">
        <div class="details-content">
          <div class="small_screen">
            <div>
              <span class="title mr-6 text-xl">
                {{ product.title }}
              </span>
              <span class="price font-medium">{{ product?.variants?.[variant]?.price || 'Sur demande' }}</span>
            </div>
            
            <div v-if="product?.variants?.length > 1" class="variant-selector mt-4">
              <span class="text-[10px] text-gray-400 uppercase tracking-widest mb-2 block">Finitions</span>
              <div class="flex flex-wrap gap-2">
                <button
                  v-for="(v, index) in product?.variants"
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
              v-if="product?.variants?.[variant]?.payment_link"
              :href="product?.variants?.[variant]?.payment_link"
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

            <div v-if="isRing" class="ring-size mt-4 p-3 border border-gray-100 bg-gray-50 text-xs text-gray-600 text-center">
              Taille de bague à choisir à l'étape du paiement — ou « Je ne connais pas ma taille »
              si vous préférez en discuter avec Vincent.
            </div>

            <div v-if="product?.variants?.[variant]?.payment_link" class="klarna-advertisement text-center">
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
               {{ product?.variants?.[variant]?.title }}
            </div>
            <span class="price text-2xl">{{ product?.variants?.[variant]?.price || 'Sur demande' }}</span>
            <hr class="my-8" />
            <p class="text-gray-700 leading-relaxed">{{ product.description }}</p>
            <hr class="my-8" />

            <div v-if="product?.variants?.length > 1" class="variant-selector mt-8">
              <span class="text-xs text-gray-400 uppercase tracking-widest mb-3 block">Finitions disponibles</span>
              <div class="flex flex-wrap gap-3">
                <button
                  v-for="(v, index) in product?.variants"
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
              v-if="product?.variants?.[variant]?.payment_link"
              :href="product?.variants?.[variant]?.payment_link"
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

            <div v-if="isRing" class="ring-size mt-6 p-5 border border-gray-100 bg-gray-50 text-sm text-gray-700">
              <div class="flex items-center gap-2 mb-3 font-medium text-black">
                <UIcon name="i-lucide-ruler" class="text-yellow-600 size-4" />
                <span>Votre taille de bague</span>
              </div>
              <p class="mb-3">
                Vous choisirez votre tour de doigt à l'étape du paiement. Si vous ne le connaissez pas,
                sélectionnez « Je ne connais pas ma taille » : Vincent vous contactera pour la déterminer avec vous.
              </p>
              <p class="text-gray-600">
                Pour la mesurer vous-même : entourez votre doigt d'une bandelette de papier, marquez le point
                de rencontre, puis mesurez la longueur obtenue en millimètres. Cette longueur est votre taille
                (par exemple 52 mm = taille 52). Mesurez en fin de journée, doigts à température ambiante.
              </p>
            </div>

            <div v-if="product?.variants?.[variant]?.payment_link" class="klarna-advertisement">
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

    <template v-for="collection in orderedCollections" :key="collection.url">
      <div v-if="collection.products.length > 0" class="container mt-24 mb-24">
        <div class="text-center mb-12">
          <p class="text-xs tracking-[0.3em] text-gray-400 uppercase mb-3">
            {{ collection.url === product.collection ? 'Dans la même collection' : 'Découvrir aussi' }}
          </p>
          <h2 class="text-4xl font-title">{{ collection.title }}</h2>
        </div>

        <div class="other-products-list">
          <NuxtLink 
            v-for="(p, index) in collection.products"
            :key="index"
            :to="p.url === product.url ? null : `/product/${p.url}`"
            :class="['other-product group', p.url === product.url ? 'opacity-50 cursor-default' : '']"
          >
            <div class="image-wrapper aspect-square bg-gray-50 overflow-hidden">
              <!-- "eager" a dessein : en lazy, Chrome ne demande jamais ces
                   vignettes, meme une fois amenees au centre de l'ecran (teste).
                   Redimensionnees a 400 px et converties en WebP elles pesent
                   ~3 Ko chacune, le chargement immediat ne coute rien. -->
              <NuxtImg class="miniature w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                   v-if="p?.variants?.[0]?.images?.[0]"
                   :src="p?.variants?.[0]?.images?.[0]?.image"
                   sizes="sm:50vw md:33vw lg:400px"
                   format="webp"
                   loading="eager"
                   decoding="async"
                   :alt="p.title"
              />
            </div>
            <div class="product-info mt-6 text-center">
              <h3 class="text-xl font-title mb-2 group-hover:text-yellow-700 transition-colors">{{ p.title }}</h3>
              <p class="text-sm tracking-widest text-gray-400 uppercase">{{ p?.variants?.[0]?.price || 'Sur demande' }}</p>
            </div>
          </NuxtLink>
        </div>
      </div>
    </template>
  </div>
  <div v-else class="min-h-screen flex flex-col items-center justify-center p-8 text-center">
    <h1 class="text-3xl font-title mb-4">Produit non trouvé</h1>
    <p class="text-gray-600 mb-8">Désolé, nous ne parvenons pas à trouver le bijou que vous recherchez.</p>
    <UButton to="/" color="black" variant="solid" size="lg">
      Retour à l'accueil
    </UButton>
  </div>
</template>

<script setup lang="ts">

import { GetCollections } from '/composables/collections';
import { AbsoluteUrl, CanonicalUrl, ParsePrice, SITE_NAME } from '/composables/site';

const route = useRoute();
const router = useRouter();

const url = useRoute().params.url;
const product = await queryCollection('product').where('url', '=', url).first();
const collections = await GetCollections();

const orderedCollections = computed(() => {
  const all = Object.values(collections);
  const currentCollectionUrl = product?.collection;
  if (!currentCollectionUrl) return all;
  
  const current = all.find(c => c.url === currentCollectionUrl);
  const others = all.filter(c => c.url !== currentCollectionUrl);
  
  return current ? [current, ...others] : all;
});

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

// Les bagues demandent un tour de doigt, collecte a l'etape du paiement Stripe.
const isRing = computed(() =>
  /^bague/i.test(product?.title || '') && !!product?.variants?.[variant.value]?.payment_link
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
  ogImage: () => AbsoluteUrl(product?.variants?.[variant.value]?.images?.[0]?.image),
  ogUrl: CanonicalUrl(`/product/${url}`),
  ogType: 'website',
  twitterCard: 'summary_large_image',
});

// Donnees structurees produit : c'est ce qui permet a Google d'afficher le prix
// et la disponibilite directement dans les resultats de recherche. Les pieces
// affichees "Sur demande" n'ont pas de montant ferme, donc pas d'offre publiee.
const productSchema = computed(() => {
  const parentCollection = collections[product?.collection];
  const prices = (product?.variants || [])
    .map(v => ParsePrice(v.price))
    .filter(price => price !== null);

  const schema: Record<string, unknown> = {
    '@type': 'Product',
    name: product?.title?.trim(),
    description: product?.description,
    url: CanonicalUrl(`/product/${url}`),
    brand: { '@type': 'Brand', name: SITE_NAME },
    image: (product?.variants || [])
      .flatMap(v => (v.images || []).map(i => AbsoluteUrl(i.image)))
      .filter(Boolean)
      .slice(0, 10),
  };

  if (parentCollection) {
    schema.category = parentCollection.title?.trim();
  }

  if (product?.variants?.length > 1) {
    schema.hasVariant = product.variants.map(v => ({
      '@type': 'Product',
      name: `${product.title?.trim()} — ${v.title?.trim()}`,
      color: v.color,
    }));
  }

  if (prices.length > 0) {
    schema.offers = {
      '@type': 'Offer',
      price: Math.min(...prices),
      priceCurrency: 'EUR',
      availability: 'https://schema.org/InStock',
      itemCondition: 'https://schema.org/NewCondition',
      url: CanonicalUrl(`/product/${url}`),
      seller: { '@type': 'Organization', name: SITE_NAME },
    };
  }

  return schema;
});

useHead({
  script: [{
    type: 'application/ld+json',
    innerHTML: computed(() => JSON.stringify({
      '@context': 'https://schema.org',
      '@graph': [
        productSchema.value,
        {
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Accueil', item: CanonicalUrl('/') },
            ...(collections[product?.collection]
              ? [{
                  '@type': 'ListItem',
                  position: 2,
                  name: collections[product.collection].title,
                  item: CanonicalUrl(`/collection/${product.collection}`),
                }]
              : []),
            {
              '@type': 'ListItem',
              position: collections[product?.collection] ? 3 : 2,
              name: product?.title?.trim(),
              item: CanonicalUrl(`/product/${url}`),
            },
          ],
        },
      ],
    })),
  }],
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
  text-wrap: balance;
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

.other-product h3 {
  text-wrap: balance;
}

.font-title {
  text-wrap: balance;
}
</style>
