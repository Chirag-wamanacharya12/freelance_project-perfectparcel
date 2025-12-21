"use client";

import { useState, useMemo } from "react";
import { NextPage } from "next";

export default function AddProductForm() {
  const [imageUrl, setImageUrl] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>("");
  const [category, setCategory] = useState("");
  const [productId, setProductId] = useState("");
  const [priceInput, setPriceInput] = useState<string>("");
  const [discountInput, setDiscountInput] = useState<string>("0");
  const [quantityInput, setQuantityInput] = useState<string>("0");
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const price = Number(priceInput) || 0;
  const discount = Math.min(Math.max(Number(discountInput) || 0, 0), 100);
  const quantity = Math.max(0, Math.floor(Number(quantityInput) || 0));

  const finalPrice = useMemo(() => {
    const discounted = price - price * (discount / 100);
    return Math.max(0, Number(discounted.toFixed(2)));
  }, [price, discount]);

  const resizeImage = async (input: File) => {
    const url = URL.createObjectURL(input);
    const img = document.createElement("img");
    img.src = url;
    await new Promise<void>((resolve, reject) => {
      img.onload = () => resolve();
      img.onerror = () => reject(new Error("Image load failed"));
    });
    URL.revokeObjectURL(url);
    const maxSide = 1200;
    const w = img.naturalWidth || img.width;
    const h = img.naturalHeight || img.height;
    const scale = Math.min(1, maxSide / Math.max(w, h));
    const targetW = Math.max(1, Math.round(w * scale));
    const targetH = Math.max(1, Math.round(h * scale));
    const canvas = document.createElement("canvas");
    canvas.width = targetW;
    canvas.height = targetH;
    const ctx = canvas.getContext("2d");
    if (!ctx) return input;
    ctx.drawImage(img, 0, 0, targetW, targetH);
    const blob: Blob | null = await new Promise((resolve) =>
      canvas.toBlob((b) => resolve(b), "image/webp", 0.8)
    );
    if (!blob) return input;
    const base = input.name.replace(/\.[^/.]+$/, "");
    const optimized = new File([blob], `${base}.webp`, { type: "image/webp" });
    return optimized;
  };

  const uploadImage = async () => {
    if (!file) return;
    setUploading(true);
    try {
      const formData = new FormData();
      const resized = await resizeImage(file);
      formData.append("file", resized);
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Upload failed");
      }
      setImageUrl(data.url);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if ((!imageUrl && !file) || !category || !productId || price <= 0) {
      setError("Please fill all required fields");
      return;
    }

    if (!imageUrl && file) {
      try {
        await uploadImage();
      } catch {
        setError("Image upload failed");
        return;
      }
    }

    setLoading(true);
    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          image: imageUrl,
          category,
          productId,
          price: finalPrice,
          discount,
          quantity,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message || "Failed to add product");
      } else {
        setSuccess("Product added successfully");
        setImageUrl("");
        setFile(null);
        setPreview("");
        setCategory("");
        setProductId("");
        setPriceInput("");
        setDiscountInput("0");
        setQuantityInput("0");
      }
    } catch (err) {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-gray-800">Product image</label>
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              const f = e.dataTransfer.files?.[0];
              if (f) {
                setFile(f);
                setPreview(URL.createObjectURL(f));
                setImageUrl("");
              }
            }}
            className="w-full border-2 border-dashed border-gray-300 rounded-lg p-4 bg-gray-50 text-center cursor-pointer hover:border-[#D14D59]"
          >
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const f = e.target.files?.[0] || null;
                setFile(f);
                setPreview(f ? URL.createObjectURL(f) : "");
                setImageUrl("");
              }}
              className="hidden"
              id="file-input"
            />
            <label htmlFor="file-input" className="block text-sm text-gray-600">
              {preview ? "Tap to change image" : "Tap to select or drag and drop image"}
            </label>
            {preview && (
              <img
                src={preview}
                alt="preview"
                className="mt-3 mx-auto max-h-40 rounded-md object-contain"
              />
            )}
            {!preview && imageUrl && (
              <img
                src={imageUrl}
                alt="uploaded"
                className="mt-3 mx-auto max-h-40 rounded-md object-contain"
              />
            )}
            <div className="mt-2 text-xs text-gray-500">
              {uploading ? "Uploading..." : imageUrl ? "Image uploaded" : file ? "Ready to upload" : "No image selected"}
            </div>
          </div>
          {file && !imageUrl && (
            <button
              type="button"
              onClick={uploadImage}
              disabled={uploading}
              className="mt-2 w-full bg-gray-800 text-white py-2 rounded-lg text-sm font-bold hover:bg-black transition-all disabled:opacity-60"
            >
              {uploading ? "Uploading..." : "Upload image"}
            </button>
          )}
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-gray-800">Category name</label>
          <input
            type="text"
            placeholder="Bracelets / Earrings / Nails..."
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full text-sm p-3 bg-gray-100 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#D14D59] transition-all"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-gray-800">Product id</label>
          <input
            type="text"
            placeholder="PP-001"
            value={productId}
            onChange={(e) => setProductId(e.target.value)}
            className="w-full text-sm p-3 bg-gray-100 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#D14D59] transition-all"
            required
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-gray-800">Price (MRP)</label>
          <input
            type="number"
            min="0"
            step="0.01"
            placeholder="Enter price"
            value={priceInput}
            onChange={(e) => setPriceInput(e.target.value)}
            className="w-full text-sm p-3 bg-gray-100 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#D14D59] transition-all"
            required
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-gray-800">Discount (%)</label>
          <input
            type="number"
            min="0"
            max="100"
            step="1"
            placeholder="0"
            value={discountInput}
            onChange={(e) => setDiscountInput(e.target.value)}
            className="w-full text-sm p-3 bg-gray-100 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#D14D59] transition-all"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-gray-800">Quantity in stock</label>
          <input
            type="number"
            min="0"
            step="1"
            placeholder="0"
            value={quantityInput}
            onChange={(e) => setQuantityInput(e.target.value)}
            className="w-full text-sm p-3 bg-gray-100 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#D14D59] transition-all"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-gray-800">Calculated price</label>
          <input
            type="text"
            value={`₹${finalPrice}`}
            readOnly
            className="w-full text-sm p-3 bg-gray-50 rounded-lg border border-dashed border-gray-200 text-gray-700"
          />
        </div>
      </div>

      {error && <div className="text-red-500 text-sm">{error}</div>}
      {success && <div className="text-green-600 text-sm">{success}</div>}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-[#D14D59] text-white py-3 rounded-lg text-sm font-bold hover:bg-[#b93c47] transition-all shadow-md mt-2 disabled:opacity-60"
      >
        {loading ? "Adding..." : "Add product"}
      </button>
    </form>
  );
}
