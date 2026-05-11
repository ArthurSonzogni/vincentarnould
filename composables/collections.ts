export interface Product {
  title: string;
  description: string;
  path: string;
  url: string;
  collection: string;
  variants?: Array<{
    title: string;
    price?: string;
    payment_link?: string;
    color?: string;
    images?: Array<{ image: string }>;
  }>;
}

export interface Collection {
  title: string;
  description: string;
  path: string;
  url: string;
  products: Product[];
}

export async function GetCollections() {
  const products = await queryCollection('product').all();
  const collectionsData = await queryCollection('collection').all();

  const collections: Record<string, Collection> = {};
  
  for (const c of collectionsData) {
    const data = c as any;
    const url = data.url || data.meta?.url; // Fallback au cas où
    if (url) {
      collections[url] = {
        ...data,
        url: url,
        products: []
      } as Collection;
    }
  }

  for (const p of products) {
    const product = p as any;
    const collectionUrl = product.collection || product.meta?.collection;

    if (!collectionUrl || !collections[collectionUrl]) {
      console.warn('Product without collection or invalid collection', p);
      if (!collections["autre"]) {
        collections["autre"] = {
          title: "Autre",
          description: "Autre",
          path: "/collection/autre",
          url: "autre",
          products: []
        };
      }
      collections["autre"].products.push({ ...product, url: product.url || product.meta?.url } as Product);
      continue;
    }

    collections[collectionUrl].products.push({ ...product, url: product.url || product.meta?.url } as Product);
  }

  return collections;
}
