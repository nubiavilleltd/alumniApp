export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  image: string;
  description?: string;
}

export interface ProductSizeStock {
  size: string;
  stock: number;
}

export interface CartItem {
  id: string;

  productId: string;

  name: string;
  image: string;
  price: number;

  colorId?: string;
  colorName?: string;

  size?: string;

  quantity: number;
}


export interface ProductImage {
  id: string;
  url: string;
}

export interface ProductVariant {
  id: string;

  color?: string;
  size?: string;

  stock: number;

  images: ProductImage[];
}

export interface StoreProduct {
  id: string;

  name: string;
  description: string;

  category: string;

  price: number;

  variants: ProductVariant[];

  createdAt: string;
}

export interface ProductSelection {
  productId: string;

  colorId?: string;

  size?: string;

  quantity: number;
}