export const SITE_URL = 'https://vincentarnould.com';

// Les balises Open Graph exigent une URL absolue : Instagram, WhatsApp et
// Facebook ignorent une image declaree en chemin relatif.
export const AbsoluteUrl = (path) => (path ? new URL(path, SITE_URL).href : '');
