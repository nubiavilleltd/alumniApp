import { useNavigate } from 'react-router-dom';
import { SEO } from '@/shared/common/SEO';
import { Breadcrumbs } from '@/shared/components/ui/Breadcrumbs';
import { ROUTES } from '@/shared/constants/routes';
import { ADMIN_ROUTES } from '@/features/admin/routes';
import { ADMIN_STORE_ROUTES } from '../routes';
import { useCreateProduct } from '../hooks/useAdminStore';
// import { ProductFormPanel } from '../components/store/ProductFormPanel';
// import type { CreateProductFormData } from '../types/adminStore.types';
import { ProductFormPanel } from '@/features/store/components/ProductFormPanel';
import { CreateProductFormData } from '../types/adminstore.types';

export function ProductCreatePage() {
  const navigate = useNavigate();
  const createProduct = useCreateProduct();

  const breadcrumbs = [
    { label: 'Home', href: ROUTES.HOME },
    { label: 'Admin Dashboard', href: ADMIN_ROUTES.DASHBOARD },
    { label: 'Store', href: ADMIN_STORE_ROUTES.ROOT },
    { label: 'Add Item' },
  ];

  const handleSubmit = (data: any) => {
    createProduct.mutate(data as CreateProductFormData, {
      onSuccess: () => navigate(ADMIN_STORE_ROUTES.ROOT),
    });
  };

  return (
    <>
      <SEO title="Add Store Item" />
      <Breadcrumbs items={breadcrumbs} />

      <section className="section bg-[#F8F8F7]">
        <div className="container-custom">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900">Add Item</h1>
          </div>

          <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm">
            <ProductFormPanel
              mode="create"
              isSubmitting={createProduct.isPending}
              onSubmit={handleSubmit}
              onCancel={() => navigate(ADMIN_STORE_ROUTES.ROOT)}
            />
          </div>
        </div>
      </section>
    </>
  );
}