'use client';

import { MessageSquare, Star, Search, CheckCircle, XCircle } from 'lucide-react';

export default function AdminReviewsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight flex items-center gap-2">
            <MessageSquare className="text-pink-600" /> Customer Reviews
          </h1>
          <p className="text-slate-500 text-sm mt-1">Moderate and respond to product reviews</p>
        </div>
        
        <div className="flex gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input 
              type="text" placeholder="Search reviews..." className="input-field pl-9 py-2 text-sm w-48"
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden p-12 text-center">
        <div className="w-20 h-20 bg-pink-50 text-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <Star size={36} className="fill-pink-200" />
        </div>
        <h2 className="font-bold text-slate-800 text-lg mb-2">Review Management Coming Soon</h2>
        <p className="text-slate-500 max-w-md mx-auto">
          Currently, the review moderation interface is under development. In future updates, you will be able to approve, reply to, and delete product reviews from this panel.
        </p>
      </div>
    </div>
  );
}
