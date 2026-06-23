export interface CartItem {
  id: string;

  productId: string;
  productName: string;

  image: string;

  price: number;

  quantity: number;

  color?: string;
  size?: string;
}