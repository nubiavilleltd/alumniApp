import { apiClient } from '@/lib/api/client';
import { handleApiError } from '@/lib/errors/apiErrorHandler';
import type { ApiProduct, ApiProductMeta, Product, ProductMeta, ProductVariant } from '../types/product.types';

// ─── Adapter ──────────────────────────────────────────────────────────────────


function adaptProductMeta({total_pinned, total_products, max_pinned}:ApiProductMeta) : ProductMeta {
 return {totalPinned:total_pinned, totalProducts:total_products, maxPinned:max_pinned }
}

export function adaptProduct(api: ApiProduct): Product {
  const imageMap = new Map(api.images.map((img) => [img.id, img.image_url]));

  const spotlightImage =
    api.images.find((img) => img.is_spotlight)?.image_url ??
    api.images[0]?.image_url ??
    '';

  const generalImages = api.images
    .filter((img) => !img.is_spotlight)
    .map((img) => img.image_url);

  let variants: ProductVariant[] = [];

  if (api.has_color || api.has_size) {
    const colorMap = new Map<
      string,
      { variantId: string; imageUrl: string; sizes: { size: string; stock: number }[] }
    >();

    for (const v of api.variants) {
      const color = v.color ?? 'Default';
      const size = v.size ?? 'One Size';
      const stock = parseInt(v.quantity, 10) || 0;
      const imageUrl = v.image_id
        ? (imageMap.get(v.image_id) ?? spotlightImage)
        : spotlightImage;

      if (colorMap.has(color)) {
        colorMap.get(color)!.sizes.push({ size, stock });
      } else {
        colorMap.set(color, { variantId: v.id, imageUrl, sizes: [{ size, stock }] });
      }
    }

    variants = [...colorMap.entries()].map(([color, data]) => ({
      variantId: data.variantId,
      color,
      image: data.imageUrl,
      sizes: data.sizes,
    }));
  } else {
    const firstVariantId = api.variants[0]?.id;
    variants = [
      {
        variantId: firstVariantId,
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
    isPinned:api.pin_item,
  };
}



export function adaptProductList(data:ApiProduct[], meta:ApiProductMeta):{data:Product[], meta:ProductMeta}{
  const mappedMetaData = adaptProductMeta(meta)
  const mappedData = data.map(adaptProduct)
  return {data:mappedData, meta:mappedMetaData}
}

// ─── Service ──────────────────────────────────────────────────────────────────

export async function getProducts(): Promise<{data:Product[], meta:ProductMeta}> {
  try {
    const { data } = await apiClient.get('/product/fetch_products');

    const raw: ApiProduct[] = data?.data ?? data?.products ?? [];
    const meta: ApiProductMeta = data?.meta
    return adaptProductList(raw, meta)
  } catch (error) {
    throw handleApiError(error, 'Failed to load products.', 'getProducts');
  }
}