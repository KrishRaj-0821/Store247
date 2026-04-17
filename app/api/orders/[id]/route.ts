import { getOrderById, updateOrder } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const order = getOrderById(id);
  if (!order) return Response.json({ error: 'Not found' }, { status: 404 });
  return Response.json(order);
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();
  const order = getOrderById(id);
  if (!order) return Response.json({ error: 'Not found' }, { status: 404 });

  // Append timeline event if status changes
  if (body.status && body.status !== order.status) {
    body.timeline = [...order.timeline, { status: body.status, time: new Date().toISOString() }];
  }
  const updated = updateOrder(id, body);
  return Response.json(updated);
}
