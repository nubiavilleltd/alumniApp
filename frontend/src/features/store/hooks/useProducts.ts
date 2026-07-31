import { useEffect, useState } from 'react';
import { getProducts } from '../services/store.service';
import { Product, ProductMeta } from '../types/product.types';

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [meta, setMeta] = useState<ProductMeta | null>(null);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    getProducts().then((res) => {
      setProducts(res.data);
      setMeta(res.meta);
      setLoading(false);
    });
  }, []);

  return {
    products,
    meta,
    isLoading,
  };
}