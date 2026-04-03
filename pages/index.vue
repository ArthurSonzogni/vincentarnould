<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { GetCollections } from '/composables/collections';

useSeoMeta({
  title: 'L\'Artisanat d\'Exception | Vincent Arnould',
  description: 'Découvrez le savoir-faire de Vincent Arnould, lapidaire.',
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
        <img :class="{ 'fade-out': showVideo }" src="/images/about/vincent.jpeg" alt="Atelier" class="hero-image" />
        <iframe 
          v-if="showVideo"
          class="hero-video"
          :src="`https://www.youtube.com/embed/tXxmUyMSLUA?autoplay=1&mute=${isMuted ? 1 : 0}&loop=1&playlist=tXxmUyMSLUA&controls=0&showinfo=0&rel=0`" 
          title="Vincent Arnould Lapidaire" 
          frameborder="0" 
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
          allowfullscreen
        ></iframe>
      </div>
      <div class="hero-text">
        <h1 class="font-title">L'Artisanat d'Exception</h1>
        <p class="subtitle">Vincent Arnould, Lapidaire</p>
      </div>
      <div v-if="showVideo" class="hero-controls">
        <button @click="toggleMute" class="mute-btn">
          <UIcon :name="isMuted ? 'i-lucide-volume-x' : 'i-lucide-volume-2'" class="size-6" />
        </button>
      </div>
    </div>

    <div class="content-section">
      <div class="text-block">
        <h2 class="font-title">Un Savoir-Faire Forgé par le Temps</h2>
        <div class="divider"></div>
        <p>
          Formé au sein de la prestigieuse Maison <strong>Van Cleef & Arpels</strong>, Vincent Arnould est un lapidaire dont l'expertise a été forgée durant 20 ans au sommet de la Haute Joaillerie française.
        </p>
        <p>
          En se lançant en freelance auprès d'un sertisseur rue de la Paix, il a perfectionné son art autour de gemmes rares et de clients prestigieux tels que Tiffany, Cartier et Chanel. Totalement autodidacte dans son évolution, il se nourrit des défis pour repousser les limites de son métier.
        </p>
      </div>
      <div class="image-block">
        <div class="image-with-caption">
          <img src="/images/vincent_apropos.jpeg" alt="Vincent Arnould au travail" />
          <p class="image-caption">Vincent Arnould avec Son Altesse Sérénissime la Princesse Charlène de Monaco et sa fidèle Katia</p>
        </div>
      </div>
    </div>

    <div class="content-section reverse bg-gray">
      <div class="text-block">
        <h2 class="font-title">L'Essence du Sur-Mesure</h2>
        <div class="divider"></div>
        <p>
          Désormais, Vincent déploie cette exigence d'excellence dans l'univers de la haute fantaisie et des commandes spéciales.
        </p>
        <p>
          Chaque création est le fruit d'une alliance parfaite entre technique traditionnelle, précision millimétrée, et une véritable osmose avec les désirs du client. Une promesse d'unicité, avec des matériaux nobles et un S.A.V. à vie pour les gemmes.
        </p>
        <div class="cta-wrapper">
          <UButton to="/collection/sur_mesure" color="black" variant="solid" size="xl">
            Créer votre bijou
          </UButton>
        </div>
      </div>
      <div class="image-block">
        <div class="image-with-caption">
          <img src="/images/vincent_katia_improved.jpeg" alt="Création sur mesure" />
          <p class="image-caption">Présentation d'une pièce d'exception dans le cadre prestigieux du Fouquet's à Paris</p>
        </div>
      </div>
    </div>

    <div class="products-selection">
      <div class="container-inner">
        <h2 class="font-title section-title">Sélection de Créations</h2>
        <div class="product-grid">
          <NuxtLink 
            v-for="product in featuredProducts" 
            :key="product.path" 
            :to="product.path"
            class="product-card"
          >
            <div class="image-wrapper">
              <img 
                v-if="product?.meta?.variants?.[0]?.images?.[0]"
                :src="product.meta.variants[0].images[0].image" 
                :alt="product.title" 
              />
            </div>
            <div class="product-info">
              <h3 class="product-name">{{ product.title }}</h3>
              <p class="product-price">{{ product?.meta?.variants?.[0]?.price || '' }}</p>
            </div>
          </NuxtLink>
        </div>
      </div>
    </div>

    <div class="footer-cta">
      <h2 class="font-title">Discutons de votre projet</h2>
      <p>L'opportunité de posséder un bijou entièrement conçu pour vous.</p>
      <div class="contact-info">
        <a href="mailto:vinc388@hotmail.fr">vinc388@hotmail.fr</a>
        <a href="https://www.instagram.com/vincentarnould18" target="_blank">@vincentarnould18</a>
        <span>06 17 40 20 13</span>
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
</style>
