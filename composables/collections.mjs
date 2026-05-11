export async function GetCollections() {
  const bySlug = (array) => {
    const result = {};
    for (const item of array) {
      result[item.meta.url] = item;
    }
    return result;
  }
  const products = bySlug(await queryCollection('product').all());
  const collections = bySlug(await queryCollection('collection').all());

  for(const c in collections) {
    collections[c].products = [];
  }
  for(const p in products) {
    const product = products[p];
    const collection = product.meta.collection;
    if (!collections[collection]) {
      console.warn('Product without collection', products[p]);
      collections["Autre"] ||= {
        title: "Autre",
        url: "autre",
        description: "Autre",
        products: []
      };
      collections["Autre"].products.push(product);
      continue;
    }

    collections[collection].products.push(product);
  }

  return collections;
}
