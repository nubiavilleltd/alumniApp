import { useNavigate, useParams } from 'react-router-dom';
import { LoaderCircle } from 'lucide-react';
import { SEO } from '@/shared/common/SEO';
import { Breadcrumbs } from '@/shared/components/ui/Breadcrumbs';
import { ROUTES } from '@/shared/constants/routes';
import { ADMIN_ROUTES } from '@/features/admin/routes';
import { ADMIN_STORE_ROUTES } from '../routes';
import { useAdminProducts, useUpdateProduct } from '../hooks/useAdminStore';
import type { UpdateProductFormData } from '../types/adminStore.types';
import { ProductFormPanel } from '@/features/store/components/ProductFormPanel';

export function ProductEditPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: products = [], isLoading } = useAdminProducts();
  const updateProduct = useUpdateProduct();

  const product = products.find((p) => p.id === id);

  const breadcrumbs = [
    { label: 'Home', href: ROUTES.HOME },
    { label: 'Admin Dashboard', href: ADMIN_ROUTES.DASHBOARD },
    { label: 'Store', href: ADMIN_STORE_ROUTES.ROOT },
    { label: product ? `Edit: ${product.product_name}` : 'Edit Item' },
  ];

  const handleSubmit = (data: any) => {
    updateProduct.mutate(data as UpdateProductFormData, {
      onSuccess: () => navigate(ADMIN_STORE_ROUTES.ROOT),
    });
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[24rem] items-center justify-center text-gray-400">
        <LoaderCircle className="h-6 w-6 animate-spin mr-2" />
        Loading product...
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex min-h-[24rem] items-center justify-center flex-col gap-3">
        <p className="text-gray-500 font-medium">Product not found.</p>
        <button
          onClick={() => navigate(ADMIN_STORE_ROUTES.ROOT)}
          className="text-primary-500 text-sm font-semibold hover:underline"
        >
          Back to store
        </button>
      </div>
    );
  }

  return (
    <>
      <SEO title={`Edit: ${product.product_name}`} />
      <Breadcrumbs items={breadcrumbs} />

      <section className="section bg-[#F8F8F7]">
        <div className="container-custom">


          <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm">
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-gray-900">Edit Item</h1>
              {/* <p className="text-sm text-gray-500 mt-1">{product.product_name}</p> */}
            </div>
            <ProductFormPanel
              mode="edit"
              existingProduct={product}
              isSubmitting={updateProduct.isPending}
              onSubmit={handleSubmit}
              onCancel={() => navigate(ADMIN_STORE_ROUTES.ROOT)}
            />
          </div>
        </div>
      </section>
    </>
  );
}