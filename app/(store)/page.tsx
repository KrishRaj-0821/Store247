import type { Metadata } from 'next';
import Link from 'next/link';
import ProductCard from '@/components/ProductCard';
import { getProducts } from '@/lib/db';
import {
  ShoppingBag, Truck, Star, Shield, ArrowRight,
  Zap, Gift, Users, TrendingUp
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'S. K. General STORE — Quality Products, Delivered Fresh',
  description: 'Shop groceries, household essentials, beverages & more. Fast delivery to 854318 and nearby areas.',
};

const CATEGORIES = [
  { name: 'Groceries', emoji: '🌾', desc: 'Rice, Atta, Dal & more', color: 'from-amber-50 to-orange-50', border: 'border-amber-200' },
  { name: 'Beverages', emoji: '☕', desc: 'Tea, Coffee, Juices', color: 'from-brown-50 to-yellow-50', border: 'border-yellow-200' },
  { name: 'Dairy', emoji: '🥛', desc: 'Milk, Paneer, Butter', color: 'from-blue-50 to-indigo-50', border: 'border-blue-200' },
  { name: 'Personal Care', emoji: '🧴', desc: 'Soap, Shampoo & more', color: 'from-pink-50 to-rose-50', border: 'border-pink-200' },
  { name: 'Household', emoji: '🏠', desc: 'Cleaning & Essentials', color: 'from-purple-50 to-violet-50', border: 'border-purple-200' },
  { name: 'Snacks', emoji: '🍿', desc: 'Chips, Biscuits, Namkeen', color: 'from-green-50 to-emerald-50', border: 'border-green-200' },
];

export default function HomePage() {
  const allProducts = getProducts();
  const featuredProducts = allProducts.filter((p) => p.featured).slice(0, 8);
  const popularProducts = allProducts.sort((a, b) => b.reviews - a.reviews).slice(0, 4);

  return (
    <div>
      {/* ── HERO SECTION ──────────────────────────────────────────────── */}
      <section className="gradient-hero text-white relative overflow-hidden">
        {/* Decorative blobs */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-white/5 rounded-full translate-y-1/3 -translate-x-1/4" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
          <div className="max-w-2xl animate-fade-in-up">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 text-sm font-medium mb-6">
              <Zap size={14} className="text-yellow-300" />
              Now delivering to Pincode 854318 & nearby!
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black leading-tight mb-5 tracking-tight">
              Fresh &amp; Quality<br />
              <span className="text-yellow-300">Products</span> Delivered<br />
              to Your Door 🛒
            </h1>
            <p className="text-lg sm:text-xl text-green-100 mb-8 leading-relaxed">
              Your neighborhood store — groceries, dairy, snacks &amp; more. Same-day delivery. Unbeatable prices.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/products" className="btn-accent text-base px-6 py-3">
                Shop Now <ArrowRight size={18} />
              </Link>
              <Link href="/about"
                className="bg-white/10 hover:bg-white/20 border border-white/30 text-white px-6 py-3 rounded-lg font-semibold text-base transition-all flex items-center gap-2">
                Learn More
              </Link>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap gap-6 mt-12 pt-8 border-t border-white/20">
              {[
                { value: '500+', label: 'Products' },
                { value: '2K+', label: 'Happy Customers' },
                { value: '4.8★', label: 'Rating' },
                { value: 'Same Day', label: 'Delivery' },
              ].map(({ value, label }) => (
                <div key={label}>
                  <p className="text-2xl font-black text-yellow-300">{value}</p>
                  <p className="text-sm text-green-200">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── PROMO BANNERS ─────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 -mt-6 z-10 relative">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="bg-gradient-to-r from-green-600 to-green-700 text-white rounded-2xl p-4 flex items-center gap-3 shadow-lg">
            <Truck size={28} className="shrink-0 opacity-80" />
            <div>
              <p className="font-bold text-sm">Free Delivery</p>
              <p className="text-xs opacity-80">On orders above ₹1,500</p>
            </div>
          </div>
          <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-2xl p-4 flex items-center gap-3 shadow-lg">
            <Gift size={28} className="shrink-0 opacity-80" />
            <div>
              <p className="font-bold text-sm">Festival Offers</p>
              <p className="text-xs opacity-80">Up to 40% off this week</p>
            </div>
          </div>
          <div className="bg-gradient-to-r from-violet-600 to-purple-700 text-white rounded-2xl p-4 flex items-center gap-3 shadow-lg">
            <Star size={28} className="shrink-0 opacity-80" />
            <div>
              <p className="font-bold text-sm">Prime Membership</p>
              <p className="text-xs opacity-80">5% off on every order</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── CATEGORIES ────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-14">
        <div className="flex items-center justify-between mb-7">
          <div>
            <h2 className="section-title">Shop by Category</h2>
            <p className="text-slate-500 text-sm mt-1">Explore our wide range of products</p>
          </div>
          <Link href="/products" className="text-green-600 hover:text-green-800 font-semibold text-sm flex items-center gap-1 transition-colors">
            View All <ArrowRight size={15} />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {CATEGORIES.map((cat) => (
            <Link key={cat.name} href={`/products?category=${encodeURIComponent(cat.name)}`}>
              <div className={`bg-gradient-to-br ${cat.color} border ${cat.border} rounded-2xl p-4 text-center hover:shadow-md hover:-translate-y-1 transition-all duration-200 cursor-pointer`}>
                <div className="text-3xl mb-2">{cat.emoji}</div>
                <p className="font-bold text-slate-800 text-sm">{cat.name}</p>
                <p className="text-slate-500 text-[11px] mt-0.5">{cat.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── FEATURED PRODUCTS ─────────────────────────────────────────── */}
      <section className="bg-white py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between mb-7">
            <div>
              <h2 className="section-title">🔥 Featured Products</h2>
              <p className="text-slate-500 text-sm mt-1">Hand-picked bestsellers for you</p>
            </div>
            <Link href="/products?featured=true" className="text-green-600 hover:text-green-800 font-semibold text-sm flex items-center gap-1 transition-colors">
              View All <ArrowRight size={15} />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* ── WHY US ────────────────────────────────────────────────────── */}
      <section className="py-14 bg-gradient-to-br from-green-50 to-emerald-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <h2 className="section-title text-center mb-2">Why Choose S. K. General STORE?</h2>
          <p className="text-center text-slate-500 text-sm mb-10">Trusted by thousands of families in 854318</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: ShoppingBag, title: 'Wide Selection', desc: '500+ products across 6+ categories always in stock.', color: 'bg-green-100 text-green-700' },
              { icon: Truck, title: 'Fast Delivery', desc: 'Same-day delivery to your doorstep within 854318.', color: 'bg-blue-100 text-blue-700' },
              { icon: Shield, title: 'Quality Guaranteed', desc: 'Only genuine, fresh products. No compromises ever.', color: 'bg-purple-100 text-purple-700' },
              { icon: TrendingUp, title: 'Best Prices', desc: 'AI-powered pricing ensures you always get the best deal.', color: 'bg-amber-100 text-amber-700' },
            ].map(({ icon: Icon, title, desc, color }) => (
              <div key={title} className="bg-white rounded-2xl p-6 shadow-sm border border-white hover:shadow-md transition-shadow">
                <div className={`w-12 h-12 rounded-xl ${color} flex items-center justify-center mb-4`}>
                  <Icon size={22} />
                </div>
                <h3 className="font-bold text-slate-800 mb-2">{title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── MOST POPULAR ──────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-14">
        <div className="flex items-center justify-between mb-7">
          <div>
            <h2 className="section-title">⭐ Most Popular</h2>
            <p className="text-slate-500 text-sm mt-1">Loved by our customers</p>
          </div>
          <Link href="/products" className="text-green-600 hover:text-green-800 font-semibold text-sm flex items-center gap-1 transition-colors">
            View All <ArrowRight size={15} />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {popularProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* ── MEMBERSHIP CTA ────────────────────────────────────────────── */}
      <section className="py-16 bg-slate-900 text-white overflow-hidden relative">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-green-900/40 via-slate-900 to-slate-900" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <div className="inline-flex items-center gap-2 bg-yellow-400/10 border border-yellow-400/30 rounded-full px-4 py-1.5 text-yellow-400 text-sm font-medium mb-6">
            <Star size={14} fill="#facc15" /> Prime Membership
          </div>
          <h2 className="text-3xl sm:text-4xl font-black mb-4 leading-tight">
            Unlock Exclusive <span className="text-yellow-400">Savings</span> &amp; Benefits
          </h2>
          <p className="text-slate-400 mb-8 max-w-lg mx-auto">
            Join our Prime membership for ₹499/year and enjoy 5% off every order, priority delivery, and exclusive member-only deals.
          </p>
          <div className="flex flex-wrap justify-center gap-4 mb-10">
            {['5% off every order', 'Priority delivery', 'Early access to sales', 'Loyalty points'].map((benefit) => (
              <span key={benefit} className="flex items-center gap-1.5 text-sm text-slate-300 bg-white/5 border border-white/10 rounded-full px-4 py-1.5">
                <span className="text-green-400">✓</span> {benefit}
              </span>
            ))}
          </div>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link href="/login" className="btn-accent text-base px-8 py-3">
              <Users size={18} /> Join Prime — ₹499/yr
            </Link>
            <Link href="/about"
              className="border border-slate-600 text-slate-300 hover:border-slate-400 hover:text-white px-8 py-3 rounded-lg font-semibold text-base transition-colors">
              Learn More
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
