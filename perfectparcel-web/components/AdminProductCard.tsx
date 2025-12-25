"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

type Product = {
  _id: string;
  name?: string;
  productId: string;
  price: number;
  category?: string;
  image?: string;
  inStock?: boolean;
  is_discontinued?: boolean;
};

export default function AdminProductCard({ product, compact = false }: { product: Product; compact?: boolean }) {
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);

  const discontinue = async () => {
    setLoading("discontinue");
    try {
      const res = await fetch(`/api/products/${product._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_discontinued: true }),
      });
      if (!res.ok) throw new Error("Failed");
      router.refresh();
    } finally {
      setLoading(null);
    }
  };

  const continueProduct = async () => {
    setLoading("continue");
    try {
      const res = await fetch(`/api/products/${product._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_discontinued: false }),
      });
      if (!res.ok) throw new Error("Failed");
      router.refresh();
    } finally {
      setLoading(null);
    }
  };

  const hardDelete = async () => {
    if (!confirm("Delete this product permanently?")) return;
    setLoading("delete");
    try {
      const res = await fetch(`/api/products/${product._id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed");
      router.refresh();
    } finally {
      setLoading(null);
    }
  };

  return (
    <div
      className={`border rounded-xl overflow-hidden bg-white ${
        product.inStock ? "" : "border-red-500"
      } ${product.is_discontinued ? "opacity-60" : ""}`}
    >
      <div className={`${compact ? "aspect-[4/5]" : "aspect-square"} relative bg-gray-100`}>
        <Image
          src={product.image || "/images/placeholder.jpg"}
          alt={product.name || product.productId}
          fill
          className="object-cover"
        />
        {product.is_discontinued && (
          <div className="absolute top-2 left-2 text-[10px] px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-800">
            Discontinued
          </div>
        )}
      </div>
      <div className={`px-3 ${compact ? "py-2" : "py-3"}`}>
        <div className="text-xs text-gray-500">Product id: {product.productId}</div>
        <div className="text-sm font-bold text-gray-900">₹{product.price}</div>
        {!compact && <div className="text-xs">{product.category}</div>}
        <div className="text-[10px] text-gray-500 font-mono mt-1">
          is_discontinued: {product.is_discontinued ? "true" : "false"}
        </div>
      </div>
      <div className="px-3 pb-3 flex items-center gap-2">
        {product.is_discontinued ? (
          <button
            onClick={continueProduct}
            disabled={loading === "continue"}
            className="flex-1 px-3 py-1.5 rounded-lg text-sm font-bold bg-green-600 text-white hover:bg-green-700 disabled:opacity-60"
          >
            {loading === "continue" ? "Updating..." : "Continue"}
          </button>
        ) : (
          <button
            onClick={discontinue}
            disabled={loading === "discontinue"}
            className="flex-1 px-3 py-1.5 rounded-lg text-sm font-bold bg-yellow-500 text-white hover:bg-yellow-600 disabled:opacity-60"
          >
            {loading === "discontinue" ? "Updating..." : "Discontinue"}
          </button>
        )}
        <button
          onClick={hardDelete}
          disabled={loading === "delete"}
          className="flex-1 px-3 py-1.5 rounded-lg text-sm font-bold bg-red-600 text-white hover:bg-red-700 disabled:opacity-60"
        >
          {loading === "delete" ? "Deleting..." : "Delete"}
        </button>
      </div>
    </div>
  );
}
