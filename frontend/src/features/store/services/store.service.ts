import { MOCK_PRODUCTS } from '../mock/products.mock';

export async function getProducts() {
  return Promise.resolve(MOCK_PRODUCTS);
}