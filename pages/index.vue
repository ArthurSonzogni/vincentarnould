<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { GetCollections } from '/composables/collections';

const { data: home } = await useAsyncData(() =>
  queryCollection('content').path('/').first()
);

const meta = computed(() => home.value?.meta || {});

useSeoMeta({
  title: home.value?.title || 'L\'Artisanat d\'Exception | Vincent Arnould',
  description: home.value?.description || 'Découvrez le savoir-faire de Vincent Arnould, lapidaire.',
})

const showVideo = ref(false);
const isMuted = ref(true);

const toggleMute = () => {
  isMuted.value = !isMuted.value;
};

onMounted(() => {
  setTimeout(() => {
    showVideo.value = true;
  }, 3500); // Transition after 3.5 seconds
});

const collections = await GetCollections();
// Flatten products from all collections and take a sample
const featuredProducts = Object.values(collections)
  .flatMap(c => (c as any).products)
  .slice(0, 3);
</script>

<template>
  <div class="storytelling">
    <div class="hero">
      <div class="hero-background">
        <img :class="{ 'fade-out': showVideo && meta.hero?.video_id }" :src="meta.hero?.image || '/images/about/vincent.jpeg'" alt="Atelier" class="hero-image" />
        <iframe 
          v-if="showVideo && meta.hero?.video_id"
          class="hero-video"
          :src="`https://www.youtube.com/embed/${meta.hero.video_id}?autoplay=1&mute=${isMuted ? 1 : 0}&loop=1&playlist=${meta.hero.video_id}&controls=0&showinfo=0&rel=0`" 
          title="Vincent Arnould Lapidaire" 
          frameborder="0" 
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
          allowfullscreen
        ></iframe>
      </div>
      <div class="hero-text">
        <h1 class="font-title">{{ meta.hero?.title || 'L\'Artisanat d\'Exception' }}</h1>
        <p class="subtitle">{{ meta.hero?.subtitle || 'Vincent Arnould, Lapidaire' }}</p>
      </div>
      <div v-if="showVideo && meta.hero?.video_id" class="hero-controls">
        <button @click="toggleMute" class="mute-btn">
          <UIcon :name="isMuted ? 'i-lucide-volume-x' : 'i-lucide-volume-2'" class="size-6" />
        </button>
      </div>
    </div>

    <div v-for="(section, index) in meta.sections" :key="index" class="content-section" :class="{ 'reverse bg-gray': index % 2 !== 0 }">
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
          <UButton :to="section.cta_link" color="black" :variant="index === 2 ? 'outline' : 'solid'" size="xl">
            {{ section.cta_text }}
          </UButton>
        </div>
      </div>
      <div class="image-block">
        <div class="image-with-caption">
          <img :src="section.image" :alt="section.title" />
          <p class="image-caption">{{ section.image_caption }}</p>
        </div>
      </div>
    </div>

    <div v-if="meta.how_it_works" class="how-it-works-section bg-gray">
      <div class="container-inner">
        <h2 class="font-title section-title">{{ meta.how_it_works.title }}</h2>
        <div class="steps-grid">
          <div v-for="(step, index) in meta.how_it_works.steps" :key="index" class="step-card">
            <h3 class="step-title font-title">{{ step.title }}</h3>
            <p class="step-description">{{ step.description }}</p>
          </div>
        </div>
      </div>
    </div>

    <div class="products-selection">
      <div class="container-inner">
        <h2 class="font-title section-title">Sélection de Créations</h2>
        <div class="product-grid">
          <NuxtLink 
            v-for="product in featuredProducts" 
            :key="product.url" 
            :to="`/product/${product.url}`"
            class="product-card"
          >
            <div class="image-wrapper">
              <img 
                v-if="product?.variants?.[0]?.images?.[0]"
                :src="product.variants[0].images[0].image" 
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

.hero-image.fade-out {
  opacity: 0;
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
  animation: fadeIn 2s ease-in-out;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
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
}

.subtitle {
  font-size: 1.25rem;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: #e5e5e5;
  margin-bottom: 2rem;
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

.footer-cta {
  text-align: center;
  padding: 8rem 2rem;
  background-color: #fff;
  border-top: 1px solid #eee;
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
}

.product-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 3rem;
}

.product-card {
  text-decoration: none;
  color: inherit;
  transition: transform 0.3s ease;
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

.how-it-works-section {
  padding: 8rem 2rem;
}

.steps-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 3rem;
  text-align: center;
  margin-top: 4rem;
}

.step-card {
  padding: 2.5rem 2rem;
  background: white;
  box-shadow: 0 10px 30px rgba(0,0,0,0.05);
  border-radius: 4px;
  transition: transform 0.3s ease;
}

.step-card:hover {
  transform: translateY(-5px);
}

.step-title {
  font-size: 1.5rem;
  color: #c5a059;
  margin-bottom: 1rem;
}

.step-description {
  font-size: 1.05rem;
  color: #555;
  line-height: 1.6;
}

.subtitle-cta {
  font-size: 1.25rem;
  color: #666;
  margin-bottom: 2rem;
  font-style: italic;
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
