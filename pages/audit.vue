<template>
  <div class="p-4 sm:p-8 max-w-4xl mx-auto font-mono text-black">
    
    <!-- Simple Title Header -->
    <div class="flex flex-col sm:flex-row gap-4 sm:justify-between sm:items-center pb-6 mb-12 sm:mb-[200px]">
      <h1 class="text-xl font-extrabold text-left">AUDIT DES LIENS DE PAIEMENT STRIPE</h1>
      <div class="flex flex-wrap gap-4 text-sm shrink-0">
        <a href="/" class="underline">[Retour au site]</a>
        <button class="underline cursor-pointer" @click="handleRefresh">
          [{{ isRefreshing ? 'Actualisation...' : 'Actualiser' }}]
        </button>
      </div>
    </div>

    <!-- Grouped Link Groups List -->
    <div class="space-y-6">
      <div
        v-for="(group, index) in groupedByLink"
        :key="index"
        style="background-color: #CCC;"
        class="p-4 sm:p-[30px] my-6 sm:my-[30px] space-y-4"
      >
        <!-- Group Header info -->
        <div class="space-y-2">
          <div class="font-bold break-all text-base">
            Lien: {{ group.link || 'Sans lien (Sur demande)' }}
          </div>
          <div class="flex flex-wrap gap-x-4 gap-y-2 text-sm text-gray-600">
            <span>Statut: {{ group.statusInfo.label }}</span>
            <span v-if="group.crossProduct" class="text-red-650 font-bold">[ERREUR: Produits différents]</span>
            <span v-else-if="group.isDuplicated" class="text-amber-600 font-bold">[Doublon]</span>
            <button
              v-if="group.link"
              class="underline text-black cursor-pointer"
              @click="copyToClipboard(group.link)"
            >
              {{ copiedLink === group.link ? '[Copié]' : '[Copier le lien]' }}
            </button>
          </div>
        </div>

        <!-- Variants list with aligned price & button -->
        <div class="pl-2 sm:pl-4 space-y-2 text-sm text-gray-700">
          <div
            v-for="(v, vIdx) in group.variants"
            :key="vIdx"
            class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4 py-2 sm:py-1 border-b border-black/10 last:border-b-0 sm:border-b-0"
          >
            <div class="flex items-center gap-2 min-w-0">
              <span class="text-gray-400 shrink-0">•</span>
              <span class="font-bold text-black truncate">{{ v.productTitle }}</span>
              <span class="text-gray-500 truncate">({{ v.variantTitle }})</span>
            </div>
            
            <div class="flex items-center justify-between sm:justify-end gap-4 sm:gap-6 w-full sm:w-auto shrink-0 font-mono text-black pl-5 sm:pl-0">
              <span class="sm:w-32 text-left sm:text-right">
                {{ v.price || 'Sur demande' }}
              </span>
              <a
                :href="`/product/${v.productUrl}?variant=${v.variantIndex}`"
                target="_blank"
                class="underline text-blue-600 sm:w-16 text-right font-bold"
              >
                [Voir]
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

interface VariantImage {
  image: string;
}

interface ProductVariant {
  title: string;
  price: string;
  payment_link?: string;
  color?: string;
  images?: VariantImage[];
}

interface Product {
  title: string;
  url: string;
  description: string;
  variants: ProductVariant[];
  collection: string;
}

interface FlattenedVariant {
  productTitle: string;
  productUrl: string;
  variantIndex: number;
  variantTitle: string;
  price: string;
  paymentLink: string;
  color: string;
  images: VariantImage[];
}

interface LinkGroup {
  link: string;
  variants: FlattenedVariant[];
  statusInfo: {
    status: string;
    label: string;
    colorClass: string;
  };
  isDuplicated: boolean;
  crossProduct: boolean;
}

// Fetch all products dynamically from @nuxt/content
const { data: rawProducts, refresh: refreshData } = await useAsyncData('audit-products', () => 
  queryCollection('product').all()
);

const products = computed(() => (rawProducts.value || []) as unknown as Product[]);
const isRefreshing = ref(false);

const handleRefresh = async () => {
  isRefreshing.value = true;
  await refreshData();
  setTimeout(() => {
    isRefreshing.value = false;
  }, 600);
};

// Flatten all product variants with metadata for auditing
const allVariants = computed<FlattenedVariant[]>(() => {
  const list: FlattenedVariant[] = [];
  products.value.forEach((product) => {
    if (product.variants && Array.isArray(product.variants)) {
      product.variants.forEach((variant, index) => {
        list.push({
          productTitle: product.title,
          productUrl: product.url,
          variantIndex: index,
          variantTitle: variant.title,
          price: variant.price,
          paymentLink: (variant.payment_link || '').trim(),
          color: variant.color || '',
          images: variant.images || []
        });
      });
    }
  });
  return list;
});

// UI states
const copiedLink = ref('');

// Helper: check link status
function getLinkStatus(link: string) {
  if (!link) {
    return {
      status: 'missing',
      label: 'Sur demande',
      colorClass: 'text-gray-600 bg-gray-100 border-transparent shadow-sm'
    };
  }

  try {
    const urlObj = new URL(link);
    // Check if it's a Stripe test link
    if (link.includes('buy.stripe.com/test_') || link.includes('stripe.com/test_')) {
      return {
        status: 'test_link',
        label: 'Sandbox / Test',
        colorClass: 'text-amber-805 bg-amber-100 border-transparent shadow-sm'
      };
    }
    
    // Check if it's a Stripe production link
    if (urlObj.hostname === 'buy.stripe.com') {
      return {
        status: 'valid',
        label: 'Production',
        colorClass: 'text-emerald-805 bg-emerald-100 border-transparent shadow-sm'
      };
    }

    return {
      status: 'other_url',
      label: 'Autre URL',
      colorClass: 'text-blue-808 bg-blue-105 border-transparent shadow-sm'
    };
  } catch {
    return {
      status: 'invalid_url',
      label: 'Format invalide',
      colorClass: 'text-red-808 bg-red-105 border-transparent shadow-sm'
    };
  }
}

// Compute grouped list of variants by payment link
const groupedByLink = computed<LinkGroup[]>(() => {
  const groups: Record<string, FlattenedVariant[]> = {};
  
  allVariants.value.forEach(v => {
    const key = v.paymentLink || 'missing';
    if (!groups[key]) {
      groups[key] = [];
    }
    groups[key].push(v);
  });

  const list: LinkGroup[] = [];
  for (const [link, variants] of Object.entries(groups)) {
    const isMissing = link === 'missing';
    const actualLink = isMissing ? '' : link;
    const statusInfo = getLinkStatus(actualLink);
    const productTitles = new Set(variants.map(v => v.productTitle));
    
    list.push({
      link: actualLink,
      variants,
      statusInfo,
      isDuplicated: variants.length > 1 && !isMissing,
      crossProduct: productTitles.size > 1 && !isMissing
    });
  }

  // Sort groups: show issues first, then duplicates, then standard links, then missing links
  return list.sort((a, b) => {
    if (!a.link && b.link) return 1;
    if (a.link && !b.link) return -1;
    
    const aStatus = a.statusInfo.status;
    const bStatus = b.statusInfo.status;
    const aIsIssue = aStatus === 'invalid_url' || aStatus === 'test_link';
    const bIsIssue = bStatus === 'invalid_url' || bStatus === 'test_link';
    if (aIsIssue && !bIsIssue) return -1;
    if (!aIsIssue && bIsIssue) return 1;
    
    if (a.crossProduct && !b.crossProduct) return -1;
    if (!a.crossProduct && b.crossProduct) return 1;
    
    if (a.isDuplicated && !b.isDuplicated) return -1;
    if (!a.isDuplicated && b.isDuplicated) return 1;
    
    return a.link.localeCompare(b.link);
  });
});

// Copy to clipboard function
function copyToClipboard(text: string) {
  navigator.clipboard.writeText(text).then(() => {
    copiedLink.value = text;
    setTimeout(() => {
      if (copiedLink.value === text) {
        copiedLink.value = '';
      }
    }, 2000);
  }).catch(err => {
    /* eslint-disable-next-line no-console */
    console.error('Erreur lors de la copie', err);
  });
}
</script>

<style scoped>
.font-mono {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
}
</style>
