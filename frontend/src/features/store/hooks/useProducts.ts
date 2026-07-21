import { useEffect, useState } from 'react';
import { getProducts } from '../services/store.service';
import { Product } from '../types/product.types';

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    getProducts().then((res) => {
      setProducts(res);
      setLoading(false);
    });
  }, []);

  return {
    products,
    isLoading,
  };
}