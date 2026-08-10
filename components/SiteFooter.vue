<script setup lang="ts">
import { GetCollections } from '/composables/collections';

// Le menu principal vit dans un USlideover : son contenu n'existe qu'une fois
// le panneau ouvert, donc absent du HTML servi aux robots. Sans ce pied de
// page, aucun lien n'aboutit aux collections ni aux pages legales, qui
// restent orphelines et pratiquement inexplorables.
const collections = await GetCollections();

const sortedCollections = computed(() => {
  const order = ['athena', 'accessories-for-dogs', 'children', 'sur_mesure'];
  // Une collection ajoutee plus tard, absente de l'ordre, passe en fin de liste
  // plutot qu'en tete (indexOf renverrait -1).
  const rank = (c) => (order.indexOf(c.url) + 1 || order.length + 1);
  return Object.values(collections).sort((a, b) => rank(a) - rank(b));
});

const year = new Date().getFullYear();
</script>

<template>
  <footer class="site-footer">
    <div class="footer-inner">
      <nav class="footer-columns" aria-label="Plan du site">
        <div v-for="collection in sortedCollections" :key="collection.url" class="footer-column">
          <NuxtLink :to="`/collection/${collection.url}`" class="footer-heading">
            {{ collection.title }}
          </NuxtLink>
          <ul>
            <li v-for="product in collection.products" :key="product.url">
              <NuxtLink :to="`/product/${product.url}`">{{ product.title }}</NuxtLink>
            </li>
          </ul>
        </div>
      </nav>

      <div class="footer-bottom">
        <p class="footer-brand">
          <strong>Vincent Arnould</strong> — Lapidaire en pierres de couleur, bijoux
          faits main à Paris.
        </p>
        <ul class="footer-legal">
          <li><NuxtLink to="/">Accueil</NuxtLink></li>
          <li><NuxtLink to="/cgv">Conditions Générales de Vente</NuxtLink></li>
          <li><NuxtLink to="/cgu">Conditions Générales d'Utilisation</NuxtLink></li>
          <li><NuxtLink to="/mentions-legales">Mentions légales</NuxtLink></li>
          <li><NuxtLink to="/confidentialite">Politique de confidentialité</NuxtLink></li>
          <li>
            <a href="https://www.instagram.com/vincentarnould18" rel="noopener">Instagram</a>
          </li>
        </ul>
        <p class="footer-copyright">© {{ year }} Vincent Arnould</p>
      </div>
    </div>
  </footer>
</template>

<style scoped lang="scss">
.site-footer {
  border-top: 1px solid #eee;
  background-color: #fafafa;
  padding: 4rem 1.5rem 2.5rem;
}

.footer-inner {
  max-width: 72rem;
  margin: 0 auto;
}

.footer-columns {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 2.5rem;
}

.footer-heading {
  font-family: "Cinzel", serif;
  font-size: 0.8rem;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: #111;
  text-decoration: none;
  display: block;
  margin-bottom: 1rem;
}

.footer-column ul {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}

.footer-column a {
  color: #666;
  font-size: 0.9rem;
  text-decoration: none;
  transition: color 0.3s;
}

.footer-heading:hover,
.footer-column a:hover,
.footer-legal a:hover {
  color: #ca8a04;
}

.footer-bottom {
  margin-top: 3.5rem;
  padding-top: 2rem;
  border-top: 1px solid #eee;
  text-align: center;
}

.footer-brand {
  color: #666;
  font-size: 0.9rem;
  text-wrap: pretty;
  margin-bottom: 1.25rem;
}

.footer-legal {
  list-style: none;
  padding: 0;
  margin: 0 0 1.25rem;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.5rem 1.25rem;
}

.footer-legal a {
  color: #888;
  font-size: 0.8rem;
  text-decoration: none;
  transition: color 0.3s;
}

.footer-copyright {
  color: #aaa;
  font-size: 0.75rem;
}
</style>
