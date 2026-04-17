'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import ProductCard from '@/components/ProductCard';
import { Search, SlidersHorizontal, X, ChevronDown } from 'lucide-react';

const CATEGORIES = ['All', 'Groceries', 'Beverages', 'Dairy', 'Personal Care', 'Household', 'Snacks'];
const SORT_OPTIONS = [
  { value: 'popular', label: 'Most Popular' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'discount', label: 'Best Discount' },
  { value: 'rating', label: 'Highest Rated' },
];

interface Product {
  id: string; name: string; slug: string; category: string; description: string;
  price: number; mrp: number; stock: number; unit: string; image: string;
  tags: string[]; rating: number; reviews: number; priceHistory: { price: number; date: string }[];
  featured: boolean;
}

export default function ProductsClient() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [category, setCategory] = useState(searchParams.get('category') || 'All');
  const [sort, setSort] = useState('popular');
  const [filtersOpen, setFiltersOpen] = useState(false);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (category !== 'All') params.set('category', category);
    if (search) params.set('search', search);
    fetch(`/api/products?${params}`)
      .then((r) => r.json())
      .then((data) => { setProducts(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [category, search]);

  const sorted = [...products].sort((a, b) => {
    if (sort === 'price-asc') return a.price - b.price;
    if (sort === 'price-desc') return b.price - a.price;
    if (sort === 'discount') return (b.mrp - b.price) / b.mrp - (a.mrp - a.price) / a.mrp;
    if (sort === 'rating') return b.rating - a.rating;
    return b.reviews - a.reviews; // popular
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="section-title">All Products</h1>
        <p className="text-slate-500 text-sm mt-1">{loading ? '...' : `${sorted.length} products found`}</p>
      </div>

      {/* Search bar */}
      <div className="flex gap-3 mb-6">
        <div className="flex-1 flex items-center bg-white border border-slate-200 rounded-xl px-4 gap-2 focus-within:border-green-400 focus-within:shadow-sm transition-all">
          <Search size={16} className="text-slate-400 shrink-0" />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products..."
            className="flex-1 py-3 text-sm bg-transparent outline-none text-slate-700 placeholder:text-slate-400"
          />
          {search && (
            <button onClick={() => setSearch('')}><X size={14} className="text-slate-400 hover:text-slate-600" /></button>
          )}
        </div>

        {/* Sort dropdown */}
        <div className="relative">
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="appearance-none bg-white border border-slate-200 rounded-xl px-4 py-3 pr-8 text-sm font-medium text-slate-700 outline-none cursor-pointer hover:border-green-400 transition-colors"
            id="sort-select"
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
          <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
        </div>

        <button
          onClick={() => setFiltersOpen((v) => !v)}
          className="md:hidden flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium text-slate-700 hover:border-green-400 transition-colors"
          id="filter-toggle"
        >
          <SlidersHorizontal size={16} /> Filters
        </button>
      </div>

      <div className="flex gap-6">
        {/* Sidebar — categories */}
        <aside className={`shrink-0 w-48 ${filtersOpen ? 'block' : 'hidden'} md:block`}>
          <div className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm sticky top-24">
            <h3 className="font-bold text-slate-800 text-sm mb-3">Category</h3>
            <div className="space-y-1">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                    category === cat
                      ? 'bg-green-600 text-white font-semibold'
                      : 'text-slate-600 hover:bg-green-50 hover:text-green-700'
                  }`}
                  id={`cat-${cat.toLowerCase().replace(/\s/g, '-')}`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Grid */}
        <div className="flex-1">
          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="bg-white rounded-2xl overflow-hidden">
                  <div className="skeleton h-44" />
                  <div className="p-3 space-y-2">
                    <div className="skeleton h-4 w-3/4" />
                    <div className="skeleton h-3 w-1/2" />
                    <div className="skeleton h-4 w-1/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : sorted.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-5xl mb-4">🔍</div>
              <h3 className="font-bold text-slate-600 mb-2">No products found</h3>
              <p className="text-slate-400 text-sm mb-4">Try a different search or category</p>
              <button onClick={() => { setSearch(''); setCategory('All'); }} className="btn-primary">
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {sorted.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
