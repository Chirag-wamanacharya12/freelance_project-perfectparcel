"use client";

import { useState, useEffect, useMemo } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { X, Trash2, Save, Power, PowerOff, AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";

type Product = {
  _id: string;
  name?: string;
  productId: string;
  price: number;
  mrp?: number;
  discount?: number;
  quantity?: number;
  category?: string;
  image?: string;
  inStock?: boolean;
  is_discontinued?: boolean;
};

interface ProductEditModalProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
}

export default function ProductEditModal({ product, isOpen, onClose }: ProductEditModalProps) {
  const router = useRouter();
  
  // Calculate initial MRP if it doesn't exist (fallback to price / (1 - discount/100))
  const initialMrp = product.mrp || (product.discount && product.discount > 0 
    ? Number((product.price / (1 - product.discount / 100)).toFixed(2))
    : product.price);

  const [formData, setFormData] = useState({
    name: product.name || "",
    productId: product.productId || "",
    mrp: String(initialMrp || ""), // This is the Original Price
    discount: String(product.discount || "0"),
    quantity: String(product.quantity || "0"),
    category: product.category || "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [categories, setCategories] = useState<string[]>([]);

  // Calculate Selling Price downwards based on MRP and Discount
  const finalPrice = useMemo(() => {
    const mrpNum = Number(formData.mrp) || 0;
    const discountNum = Math.min(Math.max(Number(formData.discount) || 0, 0), 100);
    const discounted = mrpNum - mrpNum * (discountNum / 100);
    return Math.max(0, Number(discounted.toFixed(2)));
  }, [formData.mrp, formData.discount]);

  useEffect(() => {
    if (isOpen) {
      fetchCategories();
      const currentMrp = product.mrp || (product.discount && product.discount > 0 
        ? Number((product.price / (1 - product.discount / 100)).toFixed(2))
        : product.price);

      setFormData({
        name: product.name || product.productId || "",
        productId: product.productId || "",
        mrp: String(currentMrp || ""),
        discount: String(product.discount || "0"),
        quantity: String(product.quantity || "0"),
        category: product.category || "",
      });
      setError("");
      setShowDeleteConfirm(false);
    }
  }, [isOpen, product]);

  const fetchCategories = async () => {
    try {
      const res = await fetch("/api/products/categories");
      if (res.ok) {
        const data = await res.json();
        setCategories(data);
      }
    } catch (err) {
      console.error("Failed to fetch categories:", err);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`/api/products/${product._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          productId: formData.productId,
          mrp: Number(formData.mrp),
          price: finalPrice, // Save the calculated selling price
          discount: Number(formData.discount),
          quantity: Number(formData.quantity),
          category: formData.category,
        }),
      });

      if (!res.ok) throw new Error("Failed to update product");
      
      router.refresh();
      onClose();
    } catch (err) {
      setError("Failed to update product. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const toggleStatus = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/products/${product._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_discontinued: !product.is_discontinued }),
      });
      if (!res.ok) throw new Error("Failed");
      router.refresh();
      onClose();
    } catch (err) {
      setError("Failed to update status");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/products/${product._id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed");
      router.refresh();
      onClose();
    } catch (err) {
      setError("Failed to delete product");
    } finally {
      setLoading(false);
    }
  };

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!isOpen || !mounted) return null;

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden relative animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="bg-[#D14D59] p-4 flex items-center justify-between text-white">
          <h3 className="text-lg font-bold">Edit Product</h3>
          <button onClick={onClose} className="p-1 hover:bg-white/20 rounded-full transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[80vh]">
          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg flex items-center gap-2 text-sm">
              <AlertCircle className="w-4 h-4" />
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Image Preview */}
            <div className="space-y-4">
              <div className="aspect-square relative rounded-xl overflow-hidden border-2 border-gray-100 bg-gray-50">
                <Image
                  src={product.image || "/images/placeholder.jpg"}
                  alt={product.productId}
                  fill
                  className="object-cover"
                />
              </div>
              
              <div className="flex flex-col gap-2">
                <button
                  type="button"
                  onClick={toggleStatus}
                  disabled={loading}
                  className={`w-full py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all ${
                    product.is_discontinued
                      ? "bg-green-100 text-green-700 hover:bg-green-200"
                      : "bg-orange-100 text-orange-700 hover:bg-orange-200"
                  }`}
                >
                  {product.is_discontinued ? (
                    <>
                      <Power className="w-4 h-4" /> Continue Product
                    </>
                  ) : (
                    <>
                      <PowerOff className="w-4 h-4" /> Discontinue Product
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setShowDeleteConfirm(true)}
                  disabled={loading}
                  className="w-full py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 bg-red-50 text-red-600 hover:bg-red-100 transition-all"
                >
                  <Trash2 className="w-4 h-4" /> Delete Product
                </button>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleUpdate} className="space-y-4">
              <div>
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Product Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full mt-1 p-3 bg-gray-50 rounded-xl text-sm focus:ring-2 focus:ring-[#D14D59] outline-none border-none"
                  required
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Product ID</label>
                <input
                  type="text"
                  value={formData.productId}
                  onChange={(e) => setFormData({ ...formData, productId: e.target.value })}
                  className="w-full mt-1 p-3 bg-gray-50 rounded-xl text-sm focus:ring-2 focus:ring-[#D14D59] outline-none border-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Original Price (MRP ₹)</label>
                  <input
                    type="number"
                    value={formData.mrp}
                    onChange={(e) => setFormData({ ...formData, mrp: e.target.value })}
                    className="w-full mt-1 p-3 bg-gray-50 rounded-xl text-sm focus:ring-2 focus:ring-[#D14D59] outline-none border-none"
                    required
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Discount (%)</label>
                  <input
                    type="number"
                    value={formData.discount}
                    onChange={(e) => setFormData({ ...formData, discount: e.target.value })}
                    className="w-full mt-1 p-3 bg-gray-50 rounded-xl text-sm focus:ring-2 focus:ring-[#D14D59] outline-none border-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider text-[#D14D59]">Final Selling Price (After Discount)</label>
                <div className="w-full mt-1 p-3 bg-red-50 rounded-xl text-sm font-bold text-[#D14D59] border border-red-100">
                  ₹{finalPrice}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Quantity</label>
                  <input
                    type="number"
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                    className="w-full mt-1 p-3 bg-gray-50 rounded-xl text-sm focus:ring-2 focus:ring-[#D14D59] outline-none border-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Category</label>
                  <input
                    type="text"
                    list="edit-category-suggestions"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full mt-1 p-3 bg-gray-50 rounded-xl text-sm focus:ring-2 focus:ring-[#D14D59] outline-none border-none"
                    required
                  />
                  <datalist id="edit-category-suggestions">
                    {categories.map((cat) => (
                      <option key={cat} value={cat} />
                    ))}
                  </datalist>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-6 py-4 rounded-xl bg-[#D14D59] text-white font-bold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 disabled:opacity-60 disabled:transform-none"
              >
                <Save className="w-5 h-5" />
                {loading ? "Saving Changes..." : "Save Product Details"}
              </button>
            </form>
          </div>
        </div>

        {/* Delete Confirmation Overlay */}
        {showDeleteConfirm && (
          <div className="absolute inset-0 z-50 flex items-center justify-center p-6 bg-white/95 animate-in fade-in duration-200">
            <div className="text-center space-y-4 max-w-sm">
              <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trash2 className="w-8 h-8" />
              </div>
              <h4 className="text-xl font-bold text-gray-900">Confirm Deletion</h4>
              <p className="text-sm text-gray-500">
                Are you sure you want to delete <span className="font-bold">"{product.productId}"</span>? This action cannot be undone.
              </p>
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 py-3 rounded-xl bg-gray-100 text-gray-700 font-bold hover:bg-gray-200 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  disabled={loading}
                  className="flex-1 py-3 rounded-xl bg-red-600 text-white font-bold hover:bg-red-700 shadow-lg shadow-red-200 transition-all disabled:opacity-60"
                >
                  {loading ? "Deleting..." : "Yes, Delete"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}
