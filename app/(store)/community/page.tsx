'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/AuthContext';
import { Heart, MessageCircle, Pin, Megaphone, User, Plus, Send } from 'lucide-react';
import toast from 'react-hot-toast';

interface Post {
  id: string; type: string; authorId: string; authorName: string; authorRole: string;
  title: string; content: string; image: string;
  likes: number; comments: { id: string; userId: string; userName: string; text: string; createdAt: string }[];
  pinned: boolean; createdAt: string;
}

function timeAgo(date: string): string {
  const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
  if (seconds < 60) return 'Just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}

export default function CommunityPage() {
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [composing, setComposing] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetch('/api/community').then((r) => r.json()).then((data) => { setPosts(data); setLoading(false); });
  }, []);

  const handleLike = async (post: Post) => {
    if (likedPosts.has(post.id)) return;
    setLikedPosts((prev) => new Set([...prev, post.id]));
    const updated = { id: post.id, likes: post.likes + 1 };
    await fetch('/api/community', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(updated) });
    setPosts((prev) => prev.map((p) => p.id === post.id ? { ...p, likes: p.likes + 1 } : p));
  };

  const handlePost = async () => {
    if (!user || !newTitle.trim() || !newContent.trim()) { toast.error('Please fill in title and content.'); return; }
    const post = await fetch('/api/community', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'post', authorId: user.id, authorName: user.name,
        authorRole: user.role, title: newTitle, content: newContent, image: '',
      }),
    }).then((r) => r.json());
    setPosts((prev) => [post, ...prev]);
    setNewTitle(''); setNewContent(''); setComposing(false);
    toast.success('Post shared!');
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex items-center justify-between mb-7">
        <div>
          <h1 className="section-title">Community</h1>
          <p className="text-slate-500 text-sm mt-1">Store updates, offers & customer stories</p>
        </div>
        {user && (
          <button onClick={() => setComposing(true)} className="btn-primary text-sm">
            <Plus size={15} /> New Post
          </button>
        )}
      </div>

      {/* Compose */}
      {composing && (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 mb-5 animate-bounce-in">
          <h3 className="font-bold text-slate-800 mb-3">Share Something</h3>
          <input
            value={newTitle} onChange={(e) => setNewTitle(e.target.value)}
            className="input-field mb-3" placeholder="Post title..."
          />
          <textarea
            value={newContent} onChange={(e) => setNewContent(e.target.value)}
            className="input-field resize-none h-24" placeholder="What's on your mind?"
          />
          <div className="flex gap-2 mt-3">
            <button onClick={handlePost} className="btn-primary text-sm"><Send size={14} /> Share</button>
            <button onClick={() => setComposing(false)} className="btn-outline text-sm">Cancel</button>
          </div>
        </div>
      )}

      {loading ? (
        <div className="space-y-4">
          {[1,2,3].map((i) => <div key={i} className="skeleton h-40 rounded-2xl" />)}
        </div>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => (
            <div key={post.id} className={`bg-white rounded-2xl border shadow-sm overflow-hidden animate-fade-in ${post.pinned ? 'border-green-300' : 'border-slate-100'}`}>
              {/* Header */}
              <div className="p-5 pb-0">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2.5">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm ${post.authorRole === 'admin' ? 'gradient-primary text-white' : 'bg-slate-100 text-slate-700'}`}>
                      {post.authorRole === 'admin' ? <Megaphone size={16} /> : post.authorName[0]}
                    </div>
                    <div>
                      <p className="font-semibold text-slate-800 text-sm">{post.authorName}</p>
                      <p className="text-xs text-slate-400">{timeAgo(post.createdAt)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    {post.pinned && (
                      <span className="flex items-center gap-1 text-[10px] font-bold text-green-700 bg-green-50 px-2 py-0.5 rounded-full border border-green-200">
                        <Pin size={9} /> PINNED
                      </span>
                    )}
                    {post.type === 'announcement' && (
                      <span className="flex items-center gap-1 text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                        <Megaphone size={9} /> ANNOUNCEMENT
                      </span>
                    )}
                  </div>
                </div>

                <h2 className="font-bold text-slate-900 mb-2">{post.title}</h2>
                <p className="text-sm text-slate-600 leading-relaxed">{post.content}</p>

                {post.image && (
                  <img src={post.image} alt={post.title} className="w-full rounded-xl mt-3 object-cover max-h-48" />
                )}
              </div>

              {/* Actions */}
              <div className="px-5 py-3 flex items-center gap-4 border-t border-slate-100 mt-4">
                <button
                  onClick={() => handleLike(post)}
                  className={`flex items-center gap-1.5 text-sm font-medium transition-colors ${likedPosts.has(post.id) ? 'text-red-500' : 'text-slate-400 hover:text-red-500'}`}
                >
                  <Heart size={16} fill={likedPosts.has(post.id) ? '#ef4444' : 'none'} />
                  {post.likes}
                </button>
                <span className="flex items-center gap-1.5 text-sm text-slate-400">
                  <MessageCircle size={16} /> {post.comments.length}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
