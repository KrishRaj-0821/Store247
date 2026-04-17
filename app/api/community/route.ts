import { NextRequest } from 'next/server';
import { getCommunityPosts, createCommunityPost, updateCommunityPost } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  const posts = getCommunityPosts();
  return Response.json(posts);
}

export async function POST(request: Request) {
  const body = await request.json();
  const post = createCommunityPost({
    id: 'c' + Date.now(),
    likes: 0,
    comments: [],
    pinned: false,
    createdAt: new Date().toISOString(),
    ...body,
  });
  return Response.json(post, { status: 201 });
}

export async function PUT(request: NextRequest) {
  const body = await request.json();
  const { id, ...updates } = body;
  const updated = updateCommunityPost(id, updates);
  return Response.json(updated);
}
