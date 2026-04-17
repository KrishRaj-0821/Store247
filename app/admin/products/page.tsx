'use client';

import { useState, useEffect } from 'react';
import { Package, Search, Plus, Edit2, Trash2, Zap, ArrowDownToLine, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  
  // Create/Edit modal state
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  
  const [currentProduct, setCurrentProduct] = useState({
    id: '', name: '', slug: '', category: 'Groceries', description: '',
    price: 0, mrp: 0, stock: 100, unit: '', image: '', tags: '', featured: false
  });

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/products');
      const data = await res.json();
      setProducts(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProducts(); }, []);

  const handleOpenNew = () => {
    setCurrentProduct({ id: '', name: '', slug: '', category: 'Groceries', description: '', price: 0, mrp: 0, stock: 100, unit: '1 kg', image: '', tags: '', featured: false });
    setIsEditing(false);
    setShowModal(true);
  };

  const handleOpenEdit = (p: any) => {
    setCurrentProduct({ ...p, tags: p.tags.join(', ') });
    setIsEditing(true);
    setShowModal(true);
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete ${name}?`)) return;
    try {
      await fetch(`/api/products/${id}`, { method: 'DELETE' });
      setProducts(p => p.filter(x => x.id !== id));
      toast.success('Product deleted');
    } catch {
      toast.error('Failed to delete');
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const payload = {
      ...currentProduct,
      price: Number(currentProduct.price),
      mrp: Number(currentProduct.mrp),
      stock: Number(currentProduct.stock),
      tags: currentProduct.tags.split(',').map(s => s.trim()).filter(Boolean),
      slug: currentProduct.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    };
    
    try {
      if (isEditing) {
        await fetch(`/api/products/${currentProduct.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
        toast.success('Product updated');
      } else {
        await fetch('/api/products', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
        toast.success('Product created');
      }
      setShowModal(false);
      fetchProducts();
    } catch {
      toast.error('Failed to save');
    } finally {
      setSaving(false);
    }
  };

  const filtered = products.filter(p => p.name.toLowerCase().includes(search.toLowerCase()) || p.category.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight flex items-center gap-2">
            <Package className="text-blue-600" /> Products Catalog
          </h1>
          <p className="text-slate-500 text-sm mt-1">{products.length} total products</p>
        </div>
        
        <div className="flex gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input 
              type="text" value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search products..." className="input-field pl-9 py-2 text-sm w-48 sm:w-64"
            />
          </div>
          <button onClick={handleOpenNew} className="btn-primary text-sm py-2">
            <Plus size={16} /> Add New
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-100">
              <tr>
                <th className="px-6 py-4">Product Info</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4 text-right">Pricing</th>
                <th className="px-6 py-4 text-center">Stock</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr><td colSpan={5} className="p-8 text-center text-slate-400">Loading catalog...</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={5} className="p-8 text-center text-slate-400">No products found.</td></tr>
              ) : (
                filtered.map(p => (
                  <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center shrink-0 border border-slate-200 overflow-hidden">
                          {p.image ? <img src={p.image} className="w-full h-full object-cover" /> : <Package size={16} className="text-slate-400" />}
                        </div>
                        <div>
                          <p className="font-bold text-slate-800 flex items-center gap-1.5">
                            {p.name}
                            {p.featured && <span title="Featured"><Zap size={12} className="text-amber-500 fill-amber-500" /></span>}
                          </p>
                          <p className="text-xs text-slate-400 mt-0.5">{p.unit}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="badge-primary">{p.category}</span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <p className="font-bold text-green-700">₹{p.price}</p>
                      {p.mrp > p.price && <p className="text-xs text-slate-400 line-through">₹{p.mrp}</p>}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-bold ${p.stock <= 10 ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                        {p.stock}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right space-x-1">
                       <button onClick={() => handleOpenEdit(p)} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"><Edit2 size={16} /></button>
                       <button onClick={() => handleDelete(p.id, p.name)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"><Trash2 size={16} /></button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => !saving && setShowModal(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-bounce-in">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white z-10">
              <h2 className="font-bold text-xl text-slate-800">{isEditing ? 'Edit Product' : 'Add New Product'}</h2>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-500 mb-1.5">Product Name *</label>
                  <input required value={currentProduct.name} onChange={e => setCurrentProduct({...currentProduct, name: e.target.value})} className="input-field" placeholder="e.g. Tata Salt" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1.5">Category *</label>
                  <select required value={currentProduct.category} onChange={e => setCurrentProduct({...currentProduct, category: e.target.value})} className="input-field">
                    <option>Groceries</option><option>Beverages</option><option>Dairy</option><option>Personal Care</option><option>Household</option><option>Snacks</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1.5">Unit size *</label>
                  <input required value={currentProduct.unit} onChange={e => setCurrentProduct({...currentProduct, unit: e.target.value})} className="input-field" placeholder="e.g. 1 kg, 500 ml" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1.5">Selling Price (₹) *</label>
                  <input required type="number" step="0.01" value={currentProduct.price} onChange={e => setCurrentProduct({...currentProduct, price: Number(e.target.value)})} className="input-field" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1.5">MRP (₹)</label>
                  <input type="number" step="0.01" value={currentProduct.mrp} onChange={e => setCurrentProduct({...currentProduct, mrp: Number(e.target.value)})} className="input-field" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1.5">Stock Quantity *</label>
                  <input required type="number" value={currentProduct.stock} onChange={e => setCurrentProduct({...currentProduct, stock: Number(e.target.value)})} className="input-field" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1.5">Image URL</label>
                  <input value={currentProduct.image} onChange={e => setCurrentProduct({...currentProduct, image: e.target.value})} className="input-field" placeholder="https://..." />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-500 mb-1.5">Description</label>
                  <textarea value={currentProduct.description} onChange={e => setCurrentProduct({...currentProduct, description: e.target.value})} className="input-field resize-none h-20" />
                </div>
                <div className="sm:col-span-2 flex items-center gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <input type="checkbox" id="feat" checked={currentProduct.featured} onChange={e => setCurrentProduct({...currentProduct, featured: e.target.checked})} className="w-5 h-5 accent-green-600 rounded" />
                  <label htmlFor="feat" className="font-semibold text-sm text-slate-800 flex items-center gap-1.5">
                    <Zap size={16} className="text-amber-500 fill-amber-500" /> Feature on Homepage
                  </label>
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-6 border-t border-slate-100 mt-6">
                <button type="button" onClick={() => setShowModal(false)} className="btn-outline">Cancel</button>
                <button type="submit" disabled={saving} className="btn-primary w-32 justify-center">
                  {saving ? <Loader2 size={16} className="animate-spin" /> : 'Save Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
