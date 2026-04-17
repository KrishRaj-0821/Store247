'use client';

import Link from 'next/link';
import { ShoppingBag, Star, Zap } from 'lucide-react';
import { useCart } from '@/lib/CartContext';
import toast from 'react-hot-toast';

interface Product {
  id: string;
  name: string;
  slug: string;
  category: string;
  price: number;
  mrp: number;
  unit: string;
  image: string;
  rating: number;
  reviews: number;
  stock: number;
  featured?: boolean;
}

interface ProductCardProps {
  product: Product;
  compact?: boolean;
}

export default function ProductCard({ product, compact = false }: ProductCardProps) {
  const { addItem } = useCart();
  const discount = Math.round(((product.mrp - product.price) / product.mrp) * 100);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      mrp: product.mrp,
      unit: product.unit,
      image: product.image,
    });
    toast.success(`${product.name} added to cart!`, { icon: '🛒' });
  };

  return (
    <Link href={`/product/${product.id}`} className="block">
      <div className={`bg-white rounded-2xl overflow-hidden border border-slate-100 card-hover ${compact ? '' : 'shadow-sm'}`}>
        {/* Image */}
        <div className={`relative overflow-hidden bg-gradient-to-br from-slate-50 to-slate-100 ${compact ? 'h-28' : 'h-44'}`}>
          {product.image ? (
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover product-img-zoom"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-4xl opacity-30">🛒</div>
          )}

          {/* Badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {discount > 0 && (
              <span className="bg-green-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                {discount}% OFF
              </span>
            )}
            {product.featured && (
              <span className="bg-amber-400 text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-0.5">
                <Zap size={9} /> HOT
              </span>
            )}
          </div>

          {/* Stock indicator */}
          {product.stock < 20 && product.stock > 0 && (
            <div className="absolute bottom-2 left-2">
              <span className="bg-red-500/90 text-white text-[9px] font-bold px-2 py-0.5 rounded-full">
                Only {product.stock} left!
              </span>
            </div>
          )}
        </div>

        {/* Info */}
        <div className={`${compact ? 'p-2.5' : 'p-3.5'}`}>
          <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider mb-0.5">{product.category}</p>
          <h3 className={`font-semibold text-slate-800 leading-tight mb-1 line-clamp-2 ${compact ? 'text-xs' : 'text-sm'}`}>
            {product.name}
          </h3>
          <p className="text-[10px] text-slate-400 mb-2">{product.unit}</p>

          {/* Rating */}
          {!compact && (
            <div className="flex items-center gap-1 mb-2.5">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star
                    key={s}
                    size={10}
                    className={s <= Math.round(product.rating) ? 'star-filled' : 'star-empty'}
                    fill={s <= Math.round(product.rating) ? '#f59e0b' : '#e2e8f0'}
                  />
                ))}
              </div>
              <span className="text-[10px] text-slate-400">({product.reviews})</span>
            </div>
          )}

          {/* Price */}
          <div className="flex items-center justify-between">
            <div>
              <span className={`font-bold text-green-700 ${compact ? 'text-sm' : 'text-base'}`}>
                ₹{product.price}
              </span>
              {product.mrp > product.price && (
                <span className="text-slate-400 line-through text-[11px] ml-1.5">₹{product.mrp}</span>
              )}
            </div>

            <button
              id={`add-cart-${product.id}`}
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className={`
                flex items-center gap-1 text-xs font-semibold rounded-lg transition-all
                ${product.stock === 0
                  ? 'bg-slate-100 text-slate-400 cursor-not-allowed px-2 py-1.5'
                  : 'bg-green-600 text-white hover:bg-green-700 active:scale-95 px-2 py-1.5 shadow-sm hover:shadow-md'
                }
              `}
              aria-label={`Add ${product.name} to cart`}
            >
              {product.stock === 0 ? 'Sold Out' : (
                <>
                  <ShoppingBag size={11} />
                  {compact ? '' : 'Add'}
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}
