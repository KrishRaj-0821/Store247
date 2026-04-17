import { NextRequest } from 'next/server';
import { getProducts, createProduct, type Product } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const category = searchParams.get('category');
  const search = searchParams.get('search');
  const featured = searchParams.get('featured');

  let products = getProducts();

  if (category) products = products.filter((p) => p.category === category);
  if (search) {
    const q = search.toLowerCase();
    products = products.filter(
      (p) => p.name.toLowerCase().includes(q) || p.tags.some((t) => t.includes(q))
    );
  }
  if (featured === 'true') products = products.filter((p) => p.featured);

  return Response.json(products);
}

export async function POST(request: Request) {
  const body = await request.json() as Omit<Product, 'id'>;
  const id = 'p' + Date.now();
  const product = createProduct({ ...body, priceHistory: [], id });
  return Response.json(product, { status: 201 });
}
