'use client';

import { useState, useRef } from 'react';
import { Upload, FileImage, Cpu, ScanLine, ArrowRight, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function BillScannerPage() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any>(null);
  const fileInput = useRef<HTMLInputElement>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      if (!selected.type.startsWith('image/')) {
        toast.error('Please upload an image file');
        return;
      }
      setFile(selected);
      const url = URL.createObjectURL(selected);
      setPreview(url);
      setResults(null);
    }
  };

  const handleScan = async () => {
    if (!file) return;
    setLoading(true);

    const formData = new FormData();
    formData.append('image', file);

    try {
      const res = await fetch('/api/ai/bill-scan', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.error);
      
      setResults(data);
      if (data.mode === 'demo') {
        toast('Running in Demo Mode (No API Key). Using simulated extraction.', { icon: 'ℹ️' });
      } else {
        toast.success(`Scanned ${data.itemsFound} items!`);
      }
      
    } catch (err: any) {
      toast.error(err.message || 'Failed to scan bill');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-800 tracking-tight flex items-center gap-2">
          <ScanLine className="text-green-600" /> AI Bill Scanner
        </h1>
        <p className="text-slate-500 text-sm mt-1">Upload a wholesale invoice to automatically update store pricing.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Step 1: Upload */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 overflow-hidden relative">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-400 to-emerald-500" />
          <h2 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-green-100 text-green-700 font-black text-xs flex items-center justify-center">1</span>
            Upload Invoice
          </h2>

          <input type="file" accept="image/*" className="hidden" ref={fileInput} onChange={handleFile} />
          
          {!preview ? (
            <div 
              onClick={() => fileInput.current?.click()}
              className="border-2 border-dashed border-slate-200 rounded-xl p-8 text-center cursor-pointer hover:bg-slate-50 hover:border-green-300 transition-all group"
            >
              <div className="w-16 h-16 rounded-2xl bg-green-50 text-green-600 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <Upload size={32} />
              </div>
              <p className="font-semibold text-slate-700">Click to upload bill image</p>
              <p className="text-xs text-slate-400 mt-2">JPG, PNG up to 5MB</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="relative rounded-xl overflow-hidden border border-slate-200 h-64 bg-slate-50">
                <img src={preview} alt="Bill preview" className="w-full h-full object-contain" />
                <button 
                  onClick={() => { setFile(null); setPreview(null); setResults(null); }}
                  className="absolute top-2 right-2 bg-white/90 backdrop-blur text-red-500 px-3 py-1.5 rounded-lg text-xs font-bold shadow-sm hover:bg-red-50"
                >
                  Change Image
                </button>
              </div>
              <button 
                onClick={handleScan} disabled={loading}
                className="btn-primary w-full justify-center py-3.5 text-base"
              >
                {loading ? <><Loader2 size={18} className="animate-spin" /> Analyzing Document...</> : <><Cpu size={18} /> Run AI Scan</>}
              </button>
            </div>
          )}
        </div>

        {/* Step 2: Results */}
        <div className={`bg-white rounded-2xl border shadow-sm p-6 relative transition-all ${results ? 'border-green-200 ring-2 ring-green-50' : 'border-slate-100 opacity-50'}`}>
          <h2 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
            <span className={`w-5 h-5 rounded-full font-black text-xs flex items-center justify-center ${results ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-400'}`}>2</span>
            Extracted Products & Pricing
          </h2>

          {loading && (
            <div className="flex flex-col items-center justify-center h-64 text-slate-400">
              <div className="relative">
                <ScanLine size={48} className="text-green-500 animate-pulse" />
                <div className="absolute top-0 left-0 w-full h-1 bg-green-400 shadow-[0_0_10px_#4ade80] animate-[scan_2s_ease-in-out_infinite]" />
              </div>
              <p className="mt-4 font-semibold text-sm">Extracting text via Google Gemini...</p>
              <p className="text-xs mt-1">Matching items with store database...</p>
            </div>
          )}

          {!loading && !results && (
            <div className="flex items-center justify-center h-64 text-slate-400 text-sm">
              Upload and scan a bill to see results.
            </div>
          )}

          {results && (
            <div className="space-y-4 animate-fade-in">
              <div className="flex gap-4 p-4 rounded-xl bg-slate-50 border border-slate-100">
                <div className="flex-1 text-center border-r border-slate-200">
                  <p className="text-2xl font-black text-slate-800">{results.itemsFound}</p>
                  <p className="text-xs font-semibold text-slate-400 uppercase">Items Found</p>
                </div>
                <div className="flex-1 text-center">
                  <p className="text-2xl font-black text-green-600">{results.itemsUpdated}</p>
                  <p className="text-xs font-semibold text-slate-400 uppercase">Prices Updated</p>
                </div>
              </div>

              <div className="max-h-[300px] overflow-y-auto pr-2 space-y-2">
                {results.results.map((item: any, i: number) => (
                  <div key={i} className={`p-3 rounded-xl border flex items-center justify-between ${item.updated ? 'bg-green-50 border-green-200' : 'bg-white border-slate-100'}`}>
                    <div>
                      <p className="font-semibold text-sm text-slate-800">{item.productName}</p>
                      <p className="text-[10px] text-slate-500">Wholesale: ₹{item.wholesalePrice}</p>
                    </div>
                    
                    {item.productId ? (
                      <div className="text-right flex items-center gap-2">
                         {item.updated ? (
                           <>
                             <div className="text-[10px] text-slate-400 line-through">₹{item.oldPrice}</div>
                             <ArrowRight size={12} className="text-slate-300" />
                             <div className="text-sm font-bold text-green-700">₹{item.suggestedRetailPrice}</div>
                             <span className="bg-green-600 text-white p-0.5 rounded-full ml-1" title="Price Updated in DB"><CheckCircle size={10} /></span>
                           </>
                         ) : (
                           <span className="text-xs font-semibold text-slate-400 bg-slate-100 px-2 py-0.5 rounded">No Change (₹{item.suggestedRetailPrice})</span>
                         )}
                      </div>
                    ) : (
                      <span className="flex items-center gap-1 text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded-md border border-amber-200">
                        <AlertCircle size={12} /> NEW (NOT IN DB)
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes scan {
          0% { transform: translateY(0); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateY(48px); opacity: 0; }
        }
      `}} />
    </div>
  );
}
