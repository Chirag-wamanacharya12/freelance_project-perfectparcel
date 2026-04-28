"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import ProductEditModal from "./ProductEditModal";
import { Settings } from "lucide-react";

type Product = {
  _id: string;
  name?: string;
  productId: string;
  mrp: number;
  price: number;
  discount?: number;
  quantity?: number;
  category?: string;
  image?: string;
  inStock?: boolean;
  is_discontinued?: boolean;
};

export default function AdminProductCard({ product, compact = false }: { product: Product; compact?: boolean }) {
  const router = useRouter();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

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
          sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-cover"
        />
        <div className="absolute top-2 right-2 flex flex-col gap-2">
          <button
            onClick={() => setIsEditModalOpen(true)}
            className="p-2 rounded-full bg-white/90 backdrop-blur-sm text-gray-700 shadow-sm hover:bg-white hover:text-[#D14D59] transition-all"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
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
        <button
          onClick={() => setIsEditModalOpen(true)}
          className="flex-1 px-3 py-1.5 rounded-lg text-sm font-bold bg-gray-100 text-gray-700 hover:bg-gray-200 transition-all flex items-center justify-center gap-2"
        >
          <Settings className="w-4 h-4" /> Edit Details
        </button>
      </div>

      <ProductEditModal
        product={product}
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
      />
    </div>
  );
}
