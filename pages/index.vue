<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { GetCollections } from '/composables/collections';
import { AbsoluteUrl, BUSINESS, CanonicalUrl, SITE_NAME, SITE_URL } from '/composables/site';

const { data: home } = await useAsyncData(() =>
  queryCollection('content').path('/').first()
);

const meta = computed(() => home.value?.meta || {});

const activeSections = computed(() => 
  (meta.value?.sections || []).filter(section => 
    section && (section.title || section.paragraph1 || section.paragraph2)
  )
);

const seoTitle = home.value?.title || 'L\'Artisanat d\'Exception | Vincent Arnould';
const seoDescription = home.value?.description || 'Découvrez le savoir-faire de Vincent Arnould, lapidaire.';

useSeoMeta({
  title: seoTitle,
  description: seoDescription,
  ogTitle: seoTitle,
  ogDescription: seoDescription,
  ogImage: AbsoluteUrl(meta.value?.hero?.image),
  ogUrl: CanonicalUrl('/'),
  ogType: 'website',
  twitterCard: 'summary_large_image',
})

// Identite de la marque : c'est ce qui relie le site, le logo et le compte
// Instagram a une meme entite aux yeux de Google, condition pour apparaitre
// dans le panneau de connaissance sur une recherche "Vincent Arnould".
useHead({
  script: [{
    type: 'application/ld+json',
    innerHTML: JSON.stringify({
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'Organization',
          '@id': `${SITE_URL}/#organization`,
          name: SITE_NAME,
          url: CanonicalUrl('/'),
          description: seoDescription,
          logo: AbsoluteUrl(meta.value?.logo),
          image: AbsoluteUrl(meta.value?.hero?.image),
          email: meta.value?.footer_cta?.email,
          telephone: BUSINESS.phone,
          legalName: BUSINESS.legalName,
          vatID: BUSINESS.vatId,
          taxID: BUSINESS.siret,
          sameAs: [meta.value?.footer_cta?.instagram_link].filter(Boolean),
          address: {
            '@type': 'PostalAddress',
            streetAddress: BUSINESS.street,
            postalCode: BUSINESS.postalCode,
            addressLocality: BUSINESS.city,
            addressCountry: BUSINESS.country,
          },
        },
        {
          '@type': 'WebSite',
          '@id': `${SITE_URL}/#website`,
          name: SITE_NAME,
          url: CanonicalUrl('/'),
          inLanguage: 'fr-FR',
          publisher: { '@id': `${SITE_URL}/#organization` },
        },
      ],
    }),
  }],
})

const showVideo = ref(false);
// La photo reste affichee sous la video et ne s'efface qu'une fois la lecture
// reellement commencee. Ni un minuteur ni l'evenement "load" de l'iframe ne
// suffisent : YouTube peut avoir charge son lecteur et n'afficher qu'un carre
// noir, le temps de mettre l'image en tampon ou parce que la lecture
// automatique est refusee. C'est le cas courant dans le navigateur integre de
// Facebook et d'Instagram, d'ou vient la majorite du trafic.
const videoReady = ref(false);
const isMuted = ref(true);

const toggleMute = () => {
  isMuted.value = !isMuted.value;
};

const YOUTUBE_ORIGINS = [
  'https://www.youtube-nocookie.com',
  'https://www.youtube.com',
];

// Le lecteur n'envoie son etat que si on le lui demande : ce message est la
// poignee de main prevue par l'API iframe de YouTube (enablejsapi=1).
const askPlayerForState = (event) => {
  event.target?.contentWindow?.postMessage(
    JSON.stringify({ event: 'listening', id: 'hero' }),
    '*',
  );
};

// L'etat 1 signifie "en cours de lecture" : c'est le seul moment ou l'on sait
// qu'il y a vraiment une image a montrer.
const onPlayerMessage = (event) => {
  if (!YOUTUBE_ORIGINS.includes(event.origin)) return;
  let data;
  try {
    data = JSON.parse(event.data);
  } catch {
    return;
  }
  const playing =
    (data?.event === 'onStateChange' && data.info === 1) ||
    (data?.event === 'infoDelivery' && data.info?.playerState === 1);
  if (playing) videoReady.value = true;
};

onMounted(() => {
  window.addEventListener('message', onPlayerMessage);
  setTimeout(() => {
    showVideo.value = true;
  }, 3500); // Transition after 3.5 seconds
});

onBeforeUnmount(() => {
  window.removeEventListener('message', onPlayerMessage);
});

const collections = await GetCollections();

const athenaProducts = computed(() => collections['athena']?.products || []);
</script>

<template>
  <div class="storytelling">
    <div class="hero">
      <div class="hero-background">
        <NuxtImg :src="meta.hero?.image || '/images/about/vincent.jpeg'" sizes="sm:100vw md:100vw lg:100vw" format="webp" fetchpriority="high" alt="Vincent Arnould, lapidaire en pierres de couleur, dans son atelier" class="hero-image" />
        <iframe
          v-if="showVideo && meta.hero?.video_id"
          :class="['hero-video', { 'is-ready': videoReady }]"
          @load="askPlayerForState"
          :src="`https://www.youtube-nocookie.com/embed/${meta.hero.video_id}?enablejsapi=1&autoplay=1&mute=${isMuted ? 1 : 0}&loop=1&playlist=${meta.hero.video_id}&controls=0&showinfo=0&rel=0`"
          title="Vincent Arnould, lapidaire en pierres de couleur, au travail dans son atelier"
          loading="lazy"
          frameborder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
          allowfullscreen
        ></iframe>
      </div>
      <div class="hero-text">
        <h1 class="font-title">{{ meta.hero?.title || 'L\'Artisanat d\'Exception' }}</h1>
        <p class="subtitle">{{ meta.hero?.subtitle || 'Vincent Arnould, Lapidaire' }}</p>
      </div>
      <div v-if="videoReady" class="hero-controls">
        <button @click="toggleMute" class="mute-btn">
          <UIcon :name="isMuted ? 'i-lucide-volume-x' : 'i-lucide-volume-2'" class="size-6" />
        </button>
      </div>
    </div>

    <div class="products-selection">
      <div class="container-inner">
        <h2 class="font-title section-title">La Collection Athéna</h2>
        <div class="product-grid">
          <NuxtLink 
            v-for="product in athenaProducts" 
            :key="product.url" 
            :to="`/product/${product.url}`"
            class="product-card"
          >
            <div class="image-wrapper">
              <NuxtImg
                v-if="product?.variants?.[0]?.images?.[0]"
                :src="product.variants[0].images[0].image"
                sizes="sm:50vw md:33vw lg:400px"
                format="webp"
                loading="eager"
                decoding="async"
                :alt="product.title"
              />
            </div>
            <div class="product-info">
              <h3 class="product-name">{{ product.title }}</h3>
              <p class="product-price">{{ product?.variants?.[0]?.price || '' }}</p>
            </div>
          </NuxtLink>
        </div>
      </div>
    </div>

    <div v-for="(section, index) in activeSections" :key="index" class="content-section" :class="{ 'reverse bg-gray': index % 2 !== 0 }">
      <div class="text-block">
        <h2 class="font-title">{{ section.title }}</h2>
        <div class="divider"></div>
        <p>
          {{ section.paragraph1 }}
        </p>
        <p>
          {{ section.paragraph2 }}
        </p>
        <div v-if="section.cta_text && section.cta_link" class="cta-wrapper">
          <UButton :to="section.cta_link" color="black" :variant="section.cta_variant || (index === 2 ? 'outline' : 'solid')" size="xl">
            {{ section.cta_text }}
          </UButton>
        </div>
      </div>
      <div class="image-block">
        <div v-if="section.images && section.images.length > 0" class="carousel-wrapper">
          <UCarousel
            v-slot="{ item }"
            orientation="horizontal"
            :items="section.images"
            class="section-carousel mx-auto"
            :autoplay="{ delay: 4000 }"
            :ui="{ item: 'basis-full' }"
            dots
          >
            <NuxtImg
              :src="typeof item === 'string' ? item : item.image"
              sizes="sm:100vw md:50vw lg:50vw"
              format="webp"
              loading="eager"
              decoding="async"
              :alt="section.title"
              class="carousel-image"
            />
          </UCarousel>
        </div>
        <div v-else-if="section.image" class="image-with-caption">
          <NuxtImg :src="section.image" sizes="sm:100vw md:50vw lg:50vw" format="webp" loading="eager" decoding="async" :alt="section.title" />
          <p v-if="section.image_caption" class="image-caption">{{ section.image_caption }}</p>
        </div>
      </div>
    </div>

    <!-- Galerie d'images individuelles -->
    <div v-if="meta?.gallery && meta.gallery.length > 0" class="gallery-section">
      <div class="container-inner">
        <div class="gallery-grid" :class="`items-${meta.gallery.length}`">
          <div v-for="(item, idx) in meta.gallery" :key="idx" class="gallery-item">
            <div class="gallery-image-wrapper">
              <NuxtImg :src="item.image" sizes="sm:100vw md:50vw lg:50vw" format="webp" loading="eager" decoding="async" :alt="item.image_caption || 'Galerie image'" />
            </div>
            <p v-if="item.image_caption" class="gallery-caption">{{ item.image_caption }}</p>
          </div>
        </div>
      </div>
    </div>

    <div class="footer-cta">
      <h2 class="font-title">{{ meta.footer_cta?.title }}</h2>
      <p class="subtitle-cta">{{ meta.footer_cta?.subtitle }}</p>
      
      <div v-if="meta.footer_cta?.scarcity" class="scarcity-box">
        <UIcon name="i-lucide-clock" class="size-5" />
        <p>{{ meta.footer_cta.scarcity }}</p>
      </div>

      <div class="contact-action">
        <UButton 
          :to="`mailto:${meta.footer_cta?.email}?subject=Demande de projet sur-mesure&body=Bonjour Vincent,%0D%0A%0D%0AJe vous contacte pour un projet sur-mesure pour [moi-même / mon animal].%0D%0A%0D%0AVoici quelques détails sur mon idée :%0D%0A...%0D%0A%0D%0ACordialement,`" 
          color="black" 
          variant="solid" 
          size="xl"
          icon="i-lucide-mail"
        >
          Démarrer un projet
        </UButton>
      </div>

      <div class="contact-info">
        <a :href="meta.footer_cta?.instagram_link" target="_blank">{{ meta.footer_cta?.instagram_handle }}</a>
        <span>{{ meta.footer_cta?.phone }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.storytelling {
  font-family: "Playfair", serif;
  color: #1a1a1a;
  background-color: #fff;
}

.hero {
  position: relative;
  height: 60vh;
  width: 100%;
  overflow: hidden;
  background-color: #000;
}

.hero-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.hero-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center 20%;
  filter: brightness(0.4);
  transition: opacity 2s ease-in-out;
  opacity: 1;
}

.hero-video {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 100vw;
  height: 56.25vw;
  min-height: 60vh;
  min-width: 106.66vh;
  transform: translate(-50%, -50%);
  pointer-events: none;
  filter: brightness(0.5);
  opacity: 0;
  transition: opacity 1.5s ease-in-out;
}

/* Tant que YouTube n'a pas repondu, l'iframe reste invisible et laisse voir la
   photo posee dessous, au lieu de couvrir le heros d'un rectangle noir. */
.hero-video.is-ready {
  opacity: 1;
}

.hero-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  color: white;
  width: 90%;
  z-index: 2;
  pointer-events: none;
}

.hero-controls {
  position: absolute;
  bottom: 2rem;
  right: 2rem;
  z-index: 10;
}

.mute-btn {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
  padding: 0.75rem;
  border-radius: 50%;
  cursor: pointer;
  backdrop-filter: blur(4px);
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.mute-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: scale(1.1);
}

.hero-text h1 {
  font-size: 3.5rem;
  letter-spacing: 0.05em;
  margin-bottom: 1rem;
  text-wrap: balance;
}

.subtitle {
  font-size: 1.25rem;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: #e5e5e5;
  margin-bottom: 2rem;
  text-wrap: balance;
}

.hero-caption {
  font-size: 0.9rem;
  font-style: italic;
  color: rgba(255, 255, 255, 0.8);
  max-width: 400px;
  margin: 0 auto;
  transition: opacity 1.5s ease-in-out;
}

.hero-caption.fade-out {
  opacity: 0;
}

@media (max-width: 768px) {
  .hero-text h1 {
    font-size: 2rem;
  }
  .subtitle {
    font-size: 1rem;
  }
}

.bg-gray {
  background-color: #fafafa;
}

.content-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 6rem 2rem;
  gap: 4rem;
}

@media (min-width: 900px) {
  .content-section {
    flex-direction: row;
    justify-content: center;
    gap: 6rem;
  }
  .content-section.reverse {
    flex-direction: row-reverse;
  }
}

.text-block {
  flex: 1;
  max-width: 500px;
}

.text-block h2 {
  font-size: 2.5rem;
  color: #111;
  margin-bottom: 1rem;
  line-height: 1.2;
  text-wrap: balance;
}

.divider {
  width: 50px;
  height: 2px;
  background-color: #c5a059;
  margin-bottom: 2rem;
}

.text-block p {
  font-size: 1.125rem;
  line-height: 1.8;
  margin-bottom: 1.5rem;
  color: #444;
}

.cta-wrapper {
  margin-top: 3rem;
}

.image-block {
  flex: 1;
  display: flex;
  justify-content: center;
  max-width: 600px;
}

.image-block img {
  width: 100%;
  height: auto;
  border-radius: 2px;
  box-shadow: 0 10px 40px rgba(0,0,0,0.08);
}

.image-caption {
  margin-top: 1rem;
  font-size: 0.85rem;
  color: #666;
  font-style: italic;
  line-height: 1.4;
  text-align: center;
}

.carousel-wrapper {
  width: 100%;
}

.section-carousel {
  width: 100%;
}

.carousel-image {
  width: 100%;
  aspect-ratio: 4/3;
  object-fit: cover;
  border-radius: 2px;
  box-shadow: 0 10px 40px rgba(0,0,0,0.08);
}

.footer-cta {
  text-align: center;
  padding: 8rem 2rem;
  background-color: #fff;
  border-top: 1px solid #eee;
}

.gallery-section {
  padding: 6rem 2rem;
}

.gallery-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 4rem;
  justify-content: center;
  align-items: end;
}

@media (min-width: 900px) {
  .gallery-grid.items-2 {
    grid-template-columns: repeat(2, 1fr);
    gap: 4rem;
  }
  .gallery-grid.items-3 {
    grid-template-columns: repeat(3, 1fr);
    gap: 3rem;
  }
  .gallery-grid.items-4 {
    grid-template-columns: repeat(4, 1fr);
    gap: 2rem;
  }
}

.gallery-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
}

.gallery-image-wrapper {
  height: 600px;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

@media (max-width: 768px) {
  .gallery-image-wrapper {
    height: 400px;
  }
}

.gallery-image-wrapper img {
  height: 100%;
  width: auto;
  max-width: 100%;
  object-fit: contain;
  border-radius: 4px;
  box-shadow: 0 10px 40px rgba(0,0,0,0.06);
  transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
}

.gallery-item:hover .gallery-image-wrapper img {
  transform: scale(1.03);
}

.gallery-caption {
  margin-top: 1.5rem;
  font-size: 0.95rem;
  color: #555;
  font-style: italic;
  line-height: 1.6;
  text-align: center;
  max-width: 85%;
  text-wrap: balance;
}

.products-selection {
  padding: 8rem 2rem;
  background-color: #fff;
}

.container-inner {
  max-width: 1200px;
  margin: 0 auto;
}

.section-title {
  text-align: center;
  font-size: 2.5rem;
  margin-bottom: 4rem;
  text-wrap: balance;
}

.product-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 3rem;
  justify-content: center;
}

.product-card {
  text-decoration: none;
  color: inherit;
  transition: transform 0.3s ease;
  max-width: 360px;
  width: 100%;
  margin: 0 auto;
}

.product-card:hover {
  transform: translateY(-5px);
}

.image-wrapper {
  aspect-ratio: 1;
  overflow: hidden;
  margin-bottom: 1.5rem;
  background-color: #f9f9f9;
}

.image-wrapper img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.product-card:hover .image-wrapper img {
  transform: scale(1.05);
}

.product-info {
  text-align: center;
}

.product-name {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  text-wrap: balance;
}

.product-price {
  font-size: 1.125rem;
  color: #666;
}

.all-products-link {
  margin-top: 5rem;
  text-align: center;
}

.footer-cta h2 {
  font-size: 2.5rem;
  margin-bottom: 1rem;
  text-wrap: balance;
}

.footer-cta p {
  font-size: 1.25rem;
  color: #666;
  margin-bottom: 3rem;
  font-style: italic;
}

.contact-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
  font-size: 1.125rem;
  letter-spacing: 0.05em;
}

@media (min-width: 768px) {
  .contact-info {
    flex-direction: row;
    justify-content: center;
    gap: 3rem;
  }
}

.contact-info a {
  color: #111;
  text-decoration: none;
  border-bottom: 1px solid #111;
  padding-bottom: 2px;
  transition: opacity 0.3s ease;
}

.contact-info a:hover {
  opacity: 0.6;
}



.subtitle-cta {
  font-size: 1.25rem;
  color: #666;
  margin-bottom: 2rem;
  font-style: italic;
  text-wrap: balance;
}

.scarcity-box {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  background-color: #fef9c3;
  color: #854d0e;
  padding: 1rem 1.5rem;
  border-radius: 4px;
  margin: 0 auto 3rem auto;
  font-size: 0.95rem;
  max-width: 600px;
  text-align: left;
}

.contact-action {
  margin-bottom: 3rem;
}
</style>
