import { NextRequest } from 'next/server';
import { getUsers, updateUser } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  const users = getUsers()
    .filter((u) => u.role === 'customer')
    .map((u: any) => { const { password, ...rest } = u; return rest; });
  return Response.json(users);
}

export async function PUT(request: NextRequest) {
  const body = await request.json();
  const { id, ...updates } = body;
  if (!id) return Response.json({ error: 'ID required' }, { status: 400 });
  const updated = updateUser(id, updates);
  return Response.json(updated);
}
