// // import { MOCK_PRODUCTS } from '../mock/products.mock';

// // export async function getProducts() {
// //   return Promise.resolve(MOCK_PRODUCTS);
// // }




// import type { ApiProduct, Product, ProductVariant } from '../types/product.types';
// import { API_MOCK_PRODUCTS } from '../mock/products.mock';

// // ─── Adapter ──────────────────────────────────────────────────────────────────
// export function adaptProduct(api: ApiProduct): Product {
//   const imageMap = new Map(api.images.map((img) => [img.id, img.image_url]));

//   const spotlightImage =
//     api.images.find((img) => img.is_spotlight)?.image_url ??
//     api.images[0]?.image_url ?? '';

//   const generalImages = api.images
//     .filter((img) => !img.is_spotlight)
//     .map((img) => img.image_url);

//   let variants: ProductVariant[] = [];

//   if (api.has_color || api.has_size) {
//     const colorMap = new Map<string, { imageUrl: string; sizes: { size: string; stock: number }[] }>();

//     for (const v of api.variants) {
//       const color = v.color ?? 'Default';
//       const size = v.size ?? 'One Size';
//       const stock = parseInt(v.quantity, 10) || 0;
//       const imageUrl = v.image_id ? (imageMap.get(v.image_id) ?? spotlightImage) : spotlightImage;

//       if (colorMap.has(color)) {
//         colorMap.get(color)!.sizes.push({ size, stock });
//       } else {
//         colorMap.set(color, { imageUrl, sizes: [{ size, stock }] });
//       }
//     }

//     variants = [...colorMap.entries()].map(([color, data]) => ({
//       color,
//       image: data.imageUrl,
//       sizes: data.sizes,
//     }));
//   } else {
//     variants = [{
//       color: 'Default',
//       image: spotlightImage,
//       sizes: [{ size: 'One Size', stock: api.total_stock }],
//     }];
//   }

//   return {
//     id: api.id,
//     name: api.product_name,
//     category: api.category,
//     price: parseFloat(api.price),
//     image: spotlightImage,
//     description: api.description,
//     generalImages,
//     hasSizes: api.has_size,
//     hasColors: api.has_color,
//     variants,
//     totalStock: api.total_stock,
//     status: api.status,
//   };
// }

// export async function getProducts(): Promise<Product[]> {
//   // TODO: replace with real API call:
//   // const res = await fetch('/api/products');
//   // const json = await res.json();
//   // return json.data.filter(p => p.status === 'active').map(adaptProduct);
//   return Promise.resolve(API_MOCK_PRODUCTS.map(adaptProduct));
// }






import { apiClient } from '@/lib/api/client';
import { handleApiError } from '@/lib/errors/apiErrorHandler';
import type { ApiProduct, Product, ProductVariant } from '../types/product.types';

// ─── Adapter ──────────────────────────────────────────────────────────────────
// Transforms the raw API shape into the internal shape consumed by components.

export function adaptProduct(api: ApiProduct): Product {
  const imageMap = new Map(api.images.map((img) => [img.id, img.image_url]));

  const spotlightImage =
    api.images.find((img) => img.is_spotlight)?.image_url ??
    api.images[0]?.image_url ??
    '';

  // General images = non-spotlight images shown in carousel for all colours
  const generalImages = api.images
    .filter((img) => !img.is_spotlight)
    .map((img) => img.image_url);

  let variants: ProductVariant[] = [];

  if (api.has_color || api.has_size) {
    // Group flat variants by colour
    const colorMap = new Map<string, { imageUrl: string; sizes: { size: string; stock: number }[] }>();

    for (const v of api.variants) {
      const color = v.color ?? 'Default';
      const size = v.size ?? 'One Size';
      const stock = parseInt(v.quantity, 10) || 0;
      const imageUrl = v.image_id ? (imageMap.get(v.image_id) ?? spotlightImage) : spotlightImage;

      if (colorMap.has(color)) {
        colorMap.get(color)!.sizes.push({ size, stock });
      } else {
        colorMap.set(color, { imageUrl, sizes: [{ size, stock }] });
      }
    }

    variants = [...colorMap.entries()].map(([color, data]) => ({
      color,
      image: data.imageUrl,
      sizes: data.sizes,
    }));
  } else {
    // No variants — single default entry using total stock
    variants = [
      {
        color: 'Default',
        image: spotlightImage,
        sizes: [{ size: 'One Size', stock: api.total_stock }],
      },
    ];
  }

  return {
    id: api.id,
    name: api.product_name,
    category: api.category,
    price: parseFloat(api.price),
    image: spotlightImage,
    description: api.description,
    generalImages,
    hasSizes: api.has_size,
    hasColors: api.has_color,
    variants,
    totalStock: api.total_stock,
    status: api.status,
  };
}

// ─── Service ──────────────────────────────────────────────────────────────────

export async function getProducts(): Promise<Product[]> {
  try {
    const { data } = await apiClient.get('/product/fetch_products');
    const raw: ApiProduct[] = data?.data ?? data?.products ?? [];
    return raw
      .filter((p) => p.status === 'active')
      .map(adaptProduct);
  } catch (error) {
    throw handleApiError(error, 'Failed to load products.', 'getProducts');
  }
}