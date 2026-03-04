import { Layout } from '@/components/Layout';

export function AdminGenericPage() {
  return (
    <Layout title="Admin">
      <section className="section">
        <div className="container-custom">
          <h1 className="text-3xl font-bold mb-4">Admin</h1>
          <p className="text-gray-600">This is a generic module page.</p>
        </div>
      </section>
    </Layout>
  );
}
