import { useEffect, useState } from 'react';
import { Product } from '../types/store.types';
import { getProducts } from '../services/store.service';

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