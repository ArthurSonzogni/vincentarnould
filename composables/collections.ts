export interface Product {
  title: string;
  description: string;
  path: string;
  meta: {
    url: string;
    collection: string;
    variants?: Array<{
      title: string;
      price?: string;
      payment_link?: string;
      color?: string;
      images?: Array<{ image: string }>;
    }>;
  };
}

export interface Collection {
  title: string;
  description: string;
  path: string;
  meta: {
    url: string;
  };
  products: Product[];
}

export async function GetCollections() {
  const products = await queryCollection('product').all();
  const collectionsData = await queryCollection('collection').all();

  const collections: Record<string, Collection> = {};
  
  for (const c of collectionsData) {
    collections[c.meta.url] = {
      ...c,
      products: []
    } as unknown as Collection;
  }

  for (const p of products) {
    const product = p as unknown as Product;
    const collectionUrl = product.meta.collection;

    if (!collections[collectionUrl]) {
      console.warn('Product without collection', p);
      if (!collections["autre"]) {
        collections["autre"] = {
          title: "Autre",
          description: "Autre",
          path: "/collection/autre",
          meta: { url: "autre" },
          products: []
        };
      }
      collections["autre"].products.push(product);
      continue;
    }

    collections[collectionUrl].products.push(product);
  }

  return collections;
}
