'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ShoppingBag, Search, User, Menu, X, MapPin, ChevronDown,
  Home, Package, Info, Phone, Users, Settings, Star, Newspaper
} from 'lucide-react';
import { useCart } from '@/lib/CartContext';
import { useAuth } from '@/lib/AuthContext';
import CartDrawer from './CartDrawer';

export default function Navbar() {
  const { itemCount, setIsOpen: setCartOpen } = useCart();
  const { user, logout } = useAuth();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [scrolled, setScrolled] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (searchOpen) searchRef.current?.focus();
  }, [searchOpen]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  const navLinks = [
    { label: 'Home', href: '/', icon: Home },
    { label: 'Products', href: '/products', icon: Package },
    { label: 'Community', href: '/community', icon: Newspaper },
    { label: 'About', href: '/about', icon: Info },
    { label: 'Contact', href: '/contact', icon: Phone },
  ];

  return (
    <>
      {/* Top bar */}
      <div className="bg-green-700 text-white text-xs py-1.5 px-4 flex items-center justify-between">
        <div className="flex items-center gap-1">
          <MapPin size={11} />
          <span>Pincode: <strong>854318</strong></span>
          <span className="mx-2 opacity-40">|</span>
          <a href="tel:+918434103661" className="hover:text-yellow-300 transition-colors">
            📞 +91 84341 03661
          </a>
        </div>
        <div className="hidden sm:flex items-center gap-4">
          <Link href="/orders" className="hover:text-yellow-300 transition-colors">Track Order</Link>
          <Link href="/community" className="hover:text-yellow-300 transition-colors">Offers</Link>
        </div>
      </div>

      {/* Main navbar */}
      <nav className={`sticky top-0 z-50 bg-white transition-shadow duration-300 ${scrolled ? 'shadow-lg' : 'shadow-sm'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16 gap-4">

            {/* Hamburger */}
            <button
              id="nav-hamburger"
              onClick={() => setMenuOpen(true)}
              className="lg:hidden p-2 rounded-lg hover:bg-green-50 text-slate-700 transition-colors"
              aria-label="Open menu"
            >
              <Menu size={22} />
            </button>

            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 shrink-0">
              <div className="w-9 h-9 rounded-xl gradient-primary flex items-center justify-center text-white font-black text-sm shadow-md">
                SK
              </div>
              <div className="hidden sm:block">
                <div className="font-black text-green-700 text-sm leading-tight tracking-tight">S. K. General</div>
                <div className="text-[10px] text-slate-400 font-medium tracking-wider uppercase">STORE</div>
              </div>
            </Link>

            {/* Desktop nav links */}
            <div className="hidden lg:flex items-center gap-1">
              {navLinks.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className="px-3 py-2 rounded-lg text-sm font-medium text-slate-600 hover:text-green-700 hover:bg-green-50 transition-all"
                >
                  {l.label}
                </Link>
              ))}
            </div>

            {/* Search bar — desktop */}
            <form
              onSubmit={handleSearch}
              className="hidden md:flex flex-1 max-w-sm items-center bg-slate-50 border border-slate-200 rounded-xl overflow-hidden focus-within:border-green-400 focus-within:bg-white focus-within:shadow-sm transition-all"
            >
              <Search size={15} className="ml-3 text-slate-400 shrink-0" />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="flex-1 px-3 py-2.5 text-sm bg-transparent outline-none text-slate-700 placeholder:text-slate-400"
              />
            </form>

            {/* Right icons */}
            <div className="flex items-center gap-1">
              {/* Mobile search */}
              <button
                id="nav-search-mobile"
                onClick={() => setSearchOpen(true)}
                className="md:hidden p-2 rounded-lg hover:bg-green-50 text-slate-700 transition-colors"
                aria-label="Search"
              >
                <Search size={20} />
              </button>

              {/* Cart */}
              <button
                id="nav-cart"
                onClick={() => setCartOpen(true)}
                className="relative p-2 rounded-lg hover:bg-green-50 text-slate-700 transition-colors"
                aria-label="Cart"
              >
                <ShoppingBag size={20} />
                {itemCount > 0 && (
                  <span className="cart-badge absolute -top-0.5 -right-0.5 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white">
                    {itemCount > 9 ? '9+' : itemCount}
                  </span>
                )}
              </button>

              {/* Profile */}
              <div className="relative" ref={profileRef}>
                <button
                  id="nav-profile"
                  onClick={() => setProfileOpen((v) => !v)}
                  className="flex items-center gap-1.5 p-2 rounded-lg hover:bg-green-50 text-slate-700 transition-colors"
                  aria-label="Profile"
                >
                  <div className="w-7 h-7 rounded-full bg-green-100 flex items-center justify-center">
                    {user ? (
                      <span className="text-green-700 font-bold text-xs">{user.name[0]?.toUpperCase()}</span>
                    ) : (
                      <User size={14} className="text-slate-500" />
                    )}
                  </div>
                  <ChevronDown size={13} className={`hidden sm:block text-slate-400 transition-transform ${profileOpen ? 'rotate-180' : ''}`} />
                </button>

                {profileOpen && (
                  <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 animate-fade-in z-50">
                    {user ? (
                      <>
                        <div className="px-4 py-3 border-b border-slate-100">
                          <p className="font-semibold text-sm text-slate-800">{user.name}</p>
                          <p className="text-xs text-slate-500">{user.phone}</p>
                          <span className={`inline-block mt-1 text-xs px-2 py-0.5 rounded-full font-semibold membership-${user.membership.toLowerCase()}`}>
                            {user.membership}
                          </span>
                        </div>
                        <Link href="/profile" onClick={() => setProfileOpen(false)}
                          className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-green-50 hover:text-green-700 transition-colors">
                          <User size={14} /> My Profile
                        </Link>
                        <Link href="/orders" onClick={() => setProfileOpen(false)}
                          className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-green-50 hover:text-green-700 transition-colors">
                          <Package size={14} /> My Orders
                        </Link>
                        {user.role === 'admin' && (
                          <Link href="/admin" onClick={() => setProfileOpen(false)}
                            className="flex items-center gap-2 px-4 py-2 text-sm text-green-700 hover:bg-green-50 font-semibold transition-colors">
                            <Settings size={14} /> Admin Panel
                          </Link>
                        )}
                        <hr className="my-1 border-slate-100" />
                        <button
                          onClick={() => { logout(); setProfileOpen(false); }}
                          className="w-full text-left flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                        >
                          <X size={14} /> Logout
                        </button>
                      </>
                    ) : (
                      <>
                        <Link href="/login" onClick={() => setProfileOpen(false)}
                          className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-green-700 hover:bg-green-50 transition-colors">
                          Login / Sign Up
                        </Link>
                        <Link href="/admin" onClick={() => setProfileOpen(false)}
                          className="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50 transition-colors">
                          <Settings size={14} /> Admin Panel
                        </Link>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile search overlay */}
      {searchOpen && (
        <div className="fixed inset-0 bg-black/60 z-[60] flex items-start justify-center pt-20 px-4 animate-fade-in"
          onClick={() => setSearchOpen(false)}>
          <form
            onSubmit={handleSearch}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden animate-bounce-in"
          >
            <div className="flex items-center gap-3 px-4 py-3 border-b border-slate-100">
              <Search size={18} className="text-slate-400" />
              <input
                ref={searchRef}
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for products..."
                className="flex-1 text-base outline-none text-slate-800 placeholder:text-slate-400"
              />
              <button type="button" onClick={() => setSearchOpen(false)}>
                <X size={18} className="text-slate-400" />
              </button>
            </div>
            <div className="p-3">
              <button type="submit" className="btn-primary w-full justify-center">Search</button>
            </div>
          </form>
        </div>
      )}

      {/* Mobile sidebar menu */}
      {menuOpen && (
        <div className="fixed inset-0 z-[70] flex animate-fade-in">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMenuOpen(false)} />
          <div className="relative w-72 bg-white h-full shadow-2xl flex flex-col animate-slide-in-right">
            <div className="flex items-center justify-between p-5 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl gradient-primary flex items-center justify-center text-white font-black text-sm">SK</div>
                <span className="font-black text-green-700">S. K. General STORE</span>
              </div>
              <button onClick={() => setMenuOpen(false)} className="p-1.5 rounded-lg hover:bg-slate-100">
                <X size={18} />
              </button>
            </div>

            <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
              {navLinks.map((l) => (
                <Link key={l.href} href={l.href}
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-700 hover:bg-green-50 hover:text-green-700 font-medium transition-colors">
                  <l.icon size={18} />
                  {l.label}
                </Link>
              ))}
              <hr className="my-3 border-slate-100" />
              <Link href="/profile" onClick={() => setMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-700 hover:bg-green-50 hover:text-green-700 font-medium transition-colors">
                <User size={18} /> My Profile
              </Link>
              <Link href="/orders" onClick={() => setMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-700 hover:bg-green-50 hover:text-green-700 font-medium transition-colors">
                <Package size={18} /> My Orders
              </Link>
              <Link href="/admin" onClick={() => setMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-700 hover:bg-green-50 hover:text-green-700 font-medium transition-colors">
                <Settings size={18} /> Admin Panel
              </Link>
            </nav>

            <div className="p-4 border-t border-slate-100">
              {user ? (
                <div className="flex items-center gap-3 p-3 bg-green-50 rounded-xl">
                  <div className="w-9 h-9 rounded-full bg-green-200 flex items-center justify-center font-bold text-green-700">
                    {user.name[0]}
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-slate-800">{user.name}</p>
                    <p className="text-xs text-slate-500">{user.membership} Member</p>
                  </div>
                </div>
              ) : (
                <Link href="/login" onClick={() => setMenuOpen(false)} className="btn-primary w-full justify-center">
                  Login / Sign Up
                </Link>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Cart Drawer */}
      <CartDrawer />
    </>
  );
}
