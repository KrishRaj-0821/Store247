'use client';

import { useState, useEffect } from 'react';
import { useParams, notFound } from 'next/navigation';
import Link from 'next/link';
import { ShoppingBag, Star, Truck, Shield, ArrowLeft, Zap, ChevronRight, Package } from 'lucide-react';
import { useCart } from '@/lib/CartContext';
import ProductCard from '@/components/ProductCard';
import toast from 'react-hot-toast';

interface Product {
  id: string; name: string; slug: string; category: string; description: string;
  price: number; mrp: number; stock: number; unit: string; image: string;
  tags: string[]; rating: number; reviews: number; priceHistory: { price: number; date: string }[];
  featured: boolean;
}

export default function ProductDetailPage() {
  const params = useParams();
  const { id } = params as { id: string };
  const { addItem } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [related, setRelated] = useState<Product[]>([]);
  const [qty, setQty] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/products/${id}`)
      .then((r) => r.ok ? r.json() : null)
      .then((data) => {
        setProduct(data);
        setLoading(false);
        if (data) {
          fetch(`/api/products?category=${encodeURIComponent(data.category)}`)
            .then((r) => r.json())
            .then((all) => setRelated(all.filter((p: Product) => p.id !== data.id).slice(0, 4)));
        }
      });
  }, [id]);

  if (loading) return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div className="skeleton h-80 rounded-2xl" />
        <div className="space-y-4 pt-4">
          <div className="skeleton h-6 w-3/4" />
          <div className="skeleton h-4 w-1/2" />
          <div className="skeleton h-10 w-1/3" />
          <div className="skeleton h-12 w-full" />
        </div>
      </div>
    </div>
  );

  if (!product) return (
    <div className="min-h-96 flex items-center justify-center">
      <div className="text-center">
        <Package size={48} className="text-slate-300 mx-auto mb-4" />
        <h2 className="font-bold text-slate-600">Product not found</h2>
        <Link href="/products" className="btn-primary mt-4 inline-flex">Browse Products</Link>
      </div>
    </div>
  );

  const discount = Math.round(((product.mrp - product.price) / product.mrp) * 100);

  const handleAddToCart = () => {
    addItem({ id: product.id, name: product.name, price: product.price, mrp: product.mrp, unit: product.unit, image: product.image }, qty);
    toast.success(`${product.name} added to cart!`, { icon: '🛒' });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-slate-400 mb-6">
        <Link href="/" className="hover:text-green-600 transition-colors">Home</Link>
        <ChevronRight size={14} />
        <Link href="/products" className="hover:text-green-600 transition-colors">Products</Link>
        <ChevronRight size={14} />
        <Link href={`/products?category=${product.category}`} className="hover:text-green-600 transition-colors">{product.category}</Link>
        <ChevronRight size={14} />
        <span className="text-slate-600 font-medium truncate max-w-xs">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Image */}
        <div className="rounded-2xl overflow-hidden bg-gradient-to-br from-slate-50 to-slate-100 aspect-square flex items-center justify-center border border-slate-100">
          {product.image ? (
            <img src={product.image} alt={product.name} className="w-full h-full object-cover product-img-zoom" />
          ) : (
            <div className="text-8xl opacity-20">🛒</div>
          )}
        </div>

        {/* Details */}
        <div className="py-2">
          <div className="flex items-center gap-2 mb-3">
            <span className="badge-primary">{product.category}</span>
            {product.featured && (
              <span className="badge-accent flex items-center gap-1"><Zap size={11} /> HOT</span>
            )}
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight mb-2">{product.name}</h1>
          <p className="text-slate-400 text-sm mb-4">{product.unit}</p>

          {/* Rating */}
          <div className="flex items-center gap-2 mb-5">
            <div className="flex items-center gap-0.5">
              {[1,2,3,4,5].map((s) => (
                <Star key={s} size={16} fill={s <= Math.round(product.rating) ? '#f59e0b' : '#e2e8f0'} className={s <= Math.round(product.rating) ? 'star-filled' : 'star-empty'} />
              ))}
            </div>
            <span className="font-semibold text-slate-800">{product.rating}</span>
            <span className="text-slate-400 text-sm">({product.reviews} reviews)</span>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-3 mb-6">
            <span className="text-4xl font-black text-green-700">₹{product.price}</span>
            {product.mrp > product.price && (
              <>
                <span className="text-slate-400 line-through text-lg">₹{product.mrp}</span>
                <span className="badge-danger text-sm">{discount}% OFF</span>
              </>
            )}
          </div>

          {/* Description */}
          <p className="text-slate-600 text-sm leading-relaxed mb-6">{product.description}</p>

          {/* Quantity selector */}
          <div className="flex items-center gap-4 mb-6">
            <span className="text-sm font-semibold text-slate-700">Quantity:</span>
            <div className="flex items-center gap-2">
              <button onClick={() => setQty(Math.max(1, qty - 1))} className="qty-btn w-9 h-9" aria-label="Decrease">−</button>
              <span className="font-bold text-lg w-10 text-center">{qty}</span>
              <button onClick={() => setQty(Math.min(product.stock, qty + 1))} className="qty-btn w-9 h-9" aria-label="Increase">+</button>
            </div>
            <span className="text-sm text-slate-400">{product.stock} in stock</span>
          </div>

          {/* Promo badges */}
          <div className="flex flex-wrap gap-2 mb-6">
            <div className="flex items-center gap-1.5 bg-green-50 border border-green-200 text-green-700 text-xs font-medium px-3 py-1.5 rounded-full">
              <Truck size={13} /> Free delivery on orders ₹1500+
            </div>
            <div className="flex items-center gap-1.5 bg-amber-50 border border-amber-200 text-amber-700 text-xs font-medium px-3 py-1.5 rounded-full">
              <Shield size={13} /> Quality Guaranteed
            </div>
          </div>

          {/* CTA buttons */}
          <div className="flex gap-3">
            <button
              id="add-to-cart-detail"
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className="btn-primary flex-1 justify-center py-3 text-base"
            >
              <ShoppingBag size={18} />
              {product.stock === 0 ? 'Out of Stock' : `Add to Cart — ₹${(product.price * qty).toLocaleString('en-IN')}`}
            </button>
          </div>

          {/* Trust info */}
          <div className="mt-6 grid grid-cols-3 gap-3 pt-6 border-t border-slate-100">
            {[
              { icon: '🚚', label: 'Fast Delivery' },
              { icon: '✅', label: 'Genuine Product' },
              { icon: '↩️', label: '7-Day Return' },
            ].map(({ icon, label }) => (
              <div key={label} className="text-center">
                <div className="text-2xl mb-1">{icon}</div>
                <p className="text-xs text-slate-500">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Related products */}
      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="section-title mb-6">You Might Also Like</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {related.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </section>
      )}
    </div>
  );
}
