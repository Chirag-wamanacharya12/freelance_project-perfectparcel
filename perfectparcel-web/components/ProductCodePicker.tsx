"use client";

import { useEffect, useMemo, useState } from "react";
import { Plus, X, Minus, Package } from "lucide-react";

type Item = {
  productId: string;
  image: string;
  price: number;
  name?: string;
};

export default function ProductCodePicker({
  products,
  value,
  onChange,
}: {
  products: Item[];
  value: string;
  onChange: (val: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<Record<string, number>>({});

  // Sync internal state with input value when popup opens
  useEffect(() => {
    if (!open) return;
    
    const initial: Record<string, number> = {};
    const parts = (value || "").split(",").map(p => p.trim()).filter(Boolean);
    
    parts.forEach(part => {
      const match = part.match(/^(.+?)\((\d+)\)$/);
      if (match) {
        initial[match[1]] = parseInt(match[2], 10);
      } else {
        initial[part] = 1;
      }
    });
    setSelected(initial);
  }, [open, value]);

  const updateQuantity = (id: string, delta: number) => {
    setSelected(prev => {
      const current = prev[id] || 0;
      const next = current + delta;
      if (next <= 0) {
        const { [id]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [id]: next };
    });
  };

  const handleAdd = (id: string) => {
    if (!selected[id]) {
      updateQuantity(id, 1);
    }
  };

  const confirm = () => {
    const codes = Object.entries(selected)
      .map(([id, qty]) => (qty > 1 ? `${id}(${qty})` : id))
      .join(", ");
    onChange(codes);
    setOpen(false);
  };

  return (
    <div className="space-y-1.5">
      <label className="text-xs font-bold text-gray-800">Product code</label>
      <div className="relative group">
        <input
          type="text"
          placeholder="Enter code of selected product use comma if multiple products"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full text-sm p-3.5 pr-14 bg-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D14D59]/20 border border-transparent focus:border-[#D14D59] transition-all placeholder:text-gray-400"
        />
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-50 text-gray-600 transition-all flex items-center justify-center"
        >
          <div className="relative">
            <Package className="w-5 h-5 opacity-40" />
            <Plus className="w-3 h-3 absolute -bottom-0.5 -right-0.5 bg-white rounded-full border border-gray-200" />
          </div>
        </button>
      </div>

      {open && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
              <div>
                <h3 className="text-xl font-bold text-gray-900">Product Listing</h3>
                <p className="text-xs text-gray-500 mt-0.5">Select items to add to your order</p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 bg-gray-50/50">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {products.map((p) => {
                  const qty = selected[p.productId] || 0;
                  return (
                    <div
                      key={p.productId}
                      className={`bg-white rounded-2xl border transition-all overflow-hidden ${
                        qty > 0 ? "border-[#D14D59] ring-1 ring-[#D14D59]" : "border-gray-100 hover:border-gray-200"
                      }`}
                    >
                      <div className="flex p-3 gap-3">
                        <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-gray-100 shrink-0">
                          <img
                            src={p.image || "/images/placeholder.jpg"}
                            alt={p.name || p.productId}
                            style={{ width: '100%', height: '100%' }}
                            sizes="80px"
                            className="object-cover"
                          />
                        </div>
                        <div className="flex flex-col justify-between flex-1 py-0.5">
                          <div>
                            <div className="text-[10px] font-mono text-gray-400 uppercase tracking-wider">
                              ID: {p.productId}
                            </div>
                            <div className="text-sm font-bold text-gray-900 truncate">
                              {p.name || p.productId}
                            </div>
                            <div className="text-sm font-bold text-[#D14D59]">₹{p.price}</div>
                          </div>
                          
                          {qty === 0 ? (
                            <button
                              type="button"
                              onClick={() => handleAdd(p.productId)}
                              className="w-full mt-2 py-1.5 rounded-lg bg-gray-900 text-white text-xs font-bold hover:bg-black transition-all"
                            >
                              Add Option
                            </button>
                          ) : (
                            <div className="flex items-center justify-between mt-2 bg-gray-100 rounded-lg p-1">
                              <button
                                type="button"
                                onClick={() => updateQuantity(p.productId, -1)}
                                className="w-7 h-7 flex items-center justify-center rounded-md bg-white text-gray-600 hover:text-red-600 shadow-sm"
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="text-sm font-bold text-gray-900 w-8 text-center">
                                {qty}
                              </span>
                              <button
                                type="button"
                                onClick={() => updateQuantity(p.productId, 1)}
                                className="w-7 h-7 flex items-center justify-center rounded-md bg-white text-gray-600 hover:text-green-600 shadow-sm"
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="px-6 py-5 border-t border-gray-100 bg-white flex items-center justify-between">
              <div className="text-sm">
                <span className="text-gray-500">Selected Items:</span>
                <span className="ml-2 font-bold text-gray-900">
                  {Object.keys(selected).length}
                </span>
              </div>
              <button
                type="button"
                onClick={confirm}
                className="bg-[#D14D59] text-white px-8 py-2.5 rounded-xl text-sm font-bold hover:bg-[#b93c47] transition-all shadow-lg shadow-[#D14D59]/20"
              >
                Done Selection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
