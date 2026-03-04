import { AppLink } from '@/components/AppLink';
import { Layout } from '@/components/Layout';

export function NotFoundPage() {
  return (
    <Layout title="Page Not Found">
      <section className="section">
        <div className="container-custom text-center">
          <h1 className="text-5xl font-bold text-accent-900 mb-4">404</h1>
          <p className="text-accent-600 mb-8">The page you requested does not exist.</p>
          <AppLink href="/" className="btn btn-primary">
            Back to Home
          </AppLink>
        </div>
      </section>
    </Layout>
  );
}
