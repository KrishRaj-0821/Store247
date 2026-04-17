import { NextRequest } from 'next/server';
import { getOrders, createOrder, type Order } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const userId = request.nextUrl.searchParams.get('userId');
  let orders = getOrders();
  if (userId) orders = orders.filter((o) => o.userId === userId);
  return Response.json(orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
}

export async function POST(request: Request) {
  const body = await request.json() as Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'timeline'>;
  const id = 'o' + Date.now();
  const orderNumber = `SKG-${new Date().getFullYear()}-${String(getOrders().length + 1).padStart(3, '0')}`;
  const order = createOrder({
    id,
    orderNumber,
    createdAt: new Date().toISOString(),
    timeline: [{ status: 'Placed', time: new Date().toISOString() }],
    ...body,
  });
  return Response.json(order, { status: 201 });
}
