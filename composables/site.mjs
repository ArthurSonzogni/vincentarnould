export const SITE_URL = 'https://vincentarnould.com';

export const SITE_NAME = 'Vincent Arnould';

// Coordonnees legales de l'entreprise (EI Vincent Arnould). Elles doivent rester
// identiques ici, dans les mentions legales et sur la fiche Stripe : Google
// rapproche ces informations pour confirmer qu'il s'agit d'un vrai commerce.
export const BUSINESS = {
  legalName: 'EI Vincent Arnould',
  street: '5 rue Pajol',
  postalCode: '75018',
  city: 'Paris',
  country: 'FR',
  phone: '+33617402013',
};

// Les balises Open Graph exigent une URL absolue : Instagram, WhatsApp et
// Facebook ignorent une image declaree en chemin relatif.
export const AbsoluteUrl = (path) => (path ? new URL(path, SITE_URL).href : '');

// Forme canonique d'une page : URL absolue avec slash final, identique a ce que
// liste le sitemap et a ce que renvoie la redirection 301 de l'hebergeur. Sans
// cette unicite, Google voit deux URL pour une meme page et dilue le classement.
export const CanonicalUrl = (path) => {
  const clean = `/${String(path || '/').replace(/^\/+|\/+$/g, '')}`;
  return `${SITE_URL}${clean === '/' ? '/' : `${encodeURI(clean)}/`}`;
};

// Pages encore a l'etat d'ebauche : accessibles, mais tenues hors du sitemap et
// marquees "noindex". On les laisse explorables (pas de Disallow dans le
// robots.txt) sans quoi Google, bloque avant de lire la balise, peut tout de
// meme afficher l'URL nue dans ses resultats. Retirer la ligne une fois la
// fiche redigee.
export const NOINDEX = [
  '/product/dog-necklace', // titre "Coming soon", description vide
];

// Les prix sont saisis en texte libre depuis le CMS ("370 euros ", "Sur
// demande", "A partir de 420€"). Seul un montant ferme peut etre publie dans
// les donnees structurees : Google rejette une offre au prix approximatif.
export const ParsePrice = (price) => {
  const match = String(price ?? '').match(/^\s*(\d+(?:[.,]\d+)?)\s*(?:euros?|€)\s*$/i);
  return match ? Number(match[1].replace(',', '.')) : null;
};
