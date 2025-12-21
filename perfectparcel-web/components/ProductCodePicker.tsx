"use client";

import { useEffect, useMemo, useState } from "react";
import { Plus, X } from "lucide-react";
import Image from "next/image";

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
  const [selected, setSelected] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const ids = (value || "")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    const initial: Record<string, boolean> = {};
    ids.forEach((id) => (initial[id] = true));
    setSelected(initial);
  }, [open, value]);

  const toggle = (id: string) => {
    setSelected((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const selectedIds = useMemo(
    () => Object.keys(selected).filter((id) => selected[id]),
    [selected]
  );

  const confirm = () => {
    onChange(selectedIds.join(", "));
    setOpen(false);
  };

  return (
    <div className="space-y-1.5">
      <label className="text-xs font-bold text-gray-800">Product code</label>
      <div className="relative flex items-center">
        <input
          type="text"
          placeholder="Enter code of selected product use comma if multiple products"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full text-sm p-3 pr-10 bg-gray-100 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#D14D59] transition-all"
        />
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="absolute right-2 p-1 hover:bg-gray-200 rounded transition-colors text-gray-500"
          aria-label="Select products"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {open && (
        <div className="fixed inset-0 z-50">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setOpen(false)}
          />
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-3xl bg-white rounded-2xl shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h3 className="text-lg font-bold text-gray-800">Select products</h3>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="p-2 rounded hover:bg-gray-100"
                aria-label="Close"
              >
                <X className="w-4 h-4 text-gray-600" />
              </button>
            </div>

            <div className="p-6 max-h-[60vh] overflow-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {products.map((p) => (
                  <label
                    key={p.productId}
                    className="border rounded-xl overflow-hidden shadow-sm cursor-pointer"
                  >
                    <div className="relative aspect-square bg-gray-100">
                      <Image
                        src={p.image || "/images/placeholder.jpg"}
                        alt={p.name || p.productId}
                        fill
                        className="object-cover"
                      />
                      <input
                        type="checkbox"
                        checked={!!selected[p.productId]}
                        onChange={() => toggle(p.productId)}
                        className="absolute top-2 left-2 w-4 h-4 accent-[#D14D59]"
                      />
                    </div>
                    <div className="px-3 py-2">
                      <div className="text-xs text-gray-500">Product id: {p.productId}</div>
                      <div className="text-sm font-bold text-gray-900">₹{p.price}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
              <div className="text-sm text-gray-600">
                Selected: {selectedIds.length}
              </div>
              <button
                type="button"
                onClick={confirm}
                className="bg-[#D14D59] text-white px-6 py-2 rounded-lg text-sm font-bold hover:bg-[#b93c47] transition-all"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
