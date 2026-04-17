import type { Metadata } from 'next';
import { Suspense } from 'react';
import ProductsClient from './ProductsClient';

export const metadata: Metadata = {
  title: 'All Products — S. K. General STORE',
  description: 'Browse our complete catalog of groceries, dairy, beverages, snacks, household essentials and personal care products.',
};

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="max-w-7xl mx-auto px-4 py-12 text-center text-slate-400">Loading products…</div>}>
      <ProductsClient />
    </Suspense>
  );
}
