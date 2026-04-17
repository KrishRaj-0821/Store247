'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/AuthContext';
import { LayoutDashboard, Package, ShoppingCart, Users, ScanLine, FileText, MessageSquare, LogOut, Menu, X, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

const NAV_ITEMS = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'Products', href: '/admin/products', icon: Package },
  { name: 'AI Bill Scanner', href: '/admin/bill-scanner', icon: ScanLine },
  { name: 'Orders', href: '/admin/orders', icon: ShoppingCart },
  { name: 'Customers', href: '/admin/customers', icon: Users },
  { name: 'Reviews', href: '/admin/reviews', icon: MessageSquare },
  { name: 'Invoices', href: '/admin/invoices', icon: FileText },
];

export default function AdminSidebar({ mobileOpen, setMobileOpen }: { mobileOpen: boolean; setMobileOpen: (v: boolean) => void }) {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-slate-900 text-slate-300">
      {/* Brand */}
      <div className="h-16 flex items-center px-6 border-b border-white/10 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-green-500 flex items-center justify-center text-white font-black text-xs">SK</div>
          <span className="font-bold text-white tracking-wide">Admin Panel</span>
        </div>
      </div>

      {/* Nav links */}
      <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                isActive ? 'bg-green-600 text-white shadow-lg shadow-green-900/20' : 'hover:bg-white/5 hover:text-white'
              }`}
            >
              <item.icon size={18} className={isActive ? 'text-white' : 'text-slate-400'} />
              <span className="font-medium text-sm">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-white/10">
        <Link href="/" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 transition-colors mb-2">
          <ArrowLeft size={18} className="text-slate-400" />
          <span className="font-medium text-sm">Back to Store</span>
        </Link>
        <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-green-900/50 flex items-center justify-center font-bold text-green-400 text-xs border border-green-500/20">
              {user?.name?.[0]?.toUpperCase() || 'A'}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-semibold text-white truncate max-w-[100px]">{user?.name || 'Admin'}</p>
              <p className="text-[10px] text-green-400 uppercase tracking-widest">{user?.role}</p>
            </div>
          </div>
          <button onClick={handleLogout} className="p-2 hover:bg-red-500/10 hover:text-red-400 rounded-lg transition-colors" title="Logout">
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop */}
      <aside className="hidden lg:block w-72 h-screen sticky top-0 shrink-0 border-r border-slate-800">
        <SidebarContent />
      </aside>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <div className="relative w-72 h-full bg-slate-900 animate-slide-in-right shadow-2xl">
            <button onClick={() => setMobileOpen(false)} className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-lg bg-white/5">
              <X size={18} />
            </button>
            <SidebarContent />
          </div>
        </div>
      )}
    </>
  );
}
