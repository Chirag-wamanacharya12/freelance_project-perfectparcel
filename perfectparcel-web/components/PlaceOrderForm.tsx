"use client";

import { useEffect, useMemo, useState } from "react";
import ProductCodePicker from "@/components/ProductCodePicker";
import { useSession } from "next-auth/react";

type Product = {
  productId: string;
  image: string;
  price: number;
  name?: string;
};

export default function PlaceOrderForm({ products }: { products: Product[] }) {
  const { data: session } = useSession();
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [altMobile, setAltMobile] = useState("");
  const [house, setHouse] = useState("");
  const [street, setStreet] = useState("");
  const [landmark, setLandmark] = useState("");
  const [pin, setPin] = useState("");
  const [giftWrap, setGiftWrap] = useState(false);
  const [note, setNote] = useState("");
  const [codes, setCodes] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const selectedItems = useMemo(() => {
    const arr = codes
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean)
      .map((raw) => {
        const m = raw.match(/^(.+?)\((\d+)\)$/);
        if (m) {
          return { id: m[1], qty: Math.max(1, Number(m[2])) };
        }
        return { id: raw, qty: 1 };
      });
    return arr;
  }, [codes]);
  const subtotal = useMemo(() => {
    return selectedItems.reduce((sum, it) => {
      const p = products.find((pr) => pr.productId === it.id);
      return sum + (p?.price || 0) * it.qty;
    }, 0);
  }, [selectedItems, products]);
  const delivery = useMemo(() => (subtotal > 0 ? 50 : 0), [subtotal]);
  const giftWrapCharge = useMemo(() => (subtotal > 0 && giftWrap ? 20 : 0), [subtotal, giftWrap]);
  const total = useMemo(() => subtotal + delivery + giftWrapCharge, [subtotal, delivery, giftWrapCharge]);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/api/me");
        const data = await res.json();
        const user = data.user || {};
        const last = data.lastOrder || null;
        if (!name && user.name) setName(user.name);
        if (!mobile && last?.mobile) setMobile(last.mobile);
        if (!altMobile && last?.altMobile) setAltMobile(last.altMobile);
        if (!house && last?.address?.house) setHouse(last.address.house);
        if (!street && last?.address?.street) setStreet(last.address.street);
        if (!landmark && last?.address?.landmark) setLandmark(last.address.landmark);
        if (!pin && last?.address?.pin) setPin(last.address.pin);
        if (!note && last?.note) setNote(last.note);
      } catch {}
    };
    if (session) load();
  }, [session]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (!name || !mobile || !altMobile || !house || !street || !landmark || !pin || !codes) {
      setError("Please fill all required fields");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: name,
          mobile,
          altMobile,
          address: {
            house,
            street,
            landmark,
            pin,
          },
          giftWrap,
          note,
          productIds: selectedItems.flatMap((it) => Array(it.qty).fill(it.id)),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message || "Failed to place order");
      } else {
        setSuccess("Order placed successfully");
        setName("");
        setMobile("");
        setAltMobile("");
        setHouse("");
        setStreet("");
        setLandmark("");
        setPin("");
        setGiftWrap(false);
        setNote("");
        setCodes("");
      }
    } catch {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="space-y-6" onSubmit={submit}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-gray-800">Customer name</label>
          <input
            type="text"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full text-sm p-3 bg-gray-100 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#D14D59] transition-all"
            required
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-gray-800">Mobile no</label>
          <input
            type="tel"
            placeholder="Enter your mobile no"
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
            className="w-full text-sm p-3 bg-gray-100 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#D14D59] transition-all"
            required
          />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-3">
          <label className="text-xs font-bold text-gray-800">Delivery address</label>
          <input
            type="text"
            placeholder="House no / Apartment"
            value={house}
            onChange={(e) => setHouse(e.target.value)}
            className="w-full text-sm p-3 bg-gray-100 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#D14D59] transition-all"
            required
          />
          <input
            type="text"
            placeholder="Locality / street / city"
            value={street}
            onChange={(e) => setStreet(e.target.value)}
            className="w-full text-sm p-3 bg-gray-100 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#D14D59] transition-all"
            required
          />
          <div className="grid grid-cols-[2fr_1fr] gap-3">
            <input
              type="text"
              placeholder="Landmark"
              value={landmark}
              onChange={(e) => setLandmark(e.target.value)}
              className="w-full text-sm p-3 bg-gray-100 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#D14D59] transition-all"
              required
            />
            <input
              type="text"
              placeholder="Pin Code"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              className="w-full text-sm p-3 bg-gray-100 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#D14D59] transition-all"
              required
            />
          </div>
        </div>
        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-800">Alternate Mobile no</label>
            <input
              type="tel"
              placeholder="Enter your mobile no"
              value={altMobile}
              onChange={(e) => setAltMobile(e.target.value)}
              className="w-full text-sm p-3 bg-gray-100 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#D14D59] transition-all"
              required
            />
          </div>
          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="gift-wrap"
              checked={giftWrap}
              onChange={(e) => setGiftWrap(e.target.checked)}
              className="w-4 h-4 accent-[#D14D59] rounded cursor-pointer"
            />
            <label htmlFor="gift-wrap" className="text-sm text-gray-500 cursor-pointer select-none">
              Want Gift wrap ? ( charges applicable )
            </label>
          </div>
          <div className="relative">
            <textarea
              placeholder="Additional note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full text-sm p-3 bg-gray-100 rounded-lg h-24 resize-none focus:outline-none focus:ring-1 focus:ring-[#D14D59] transition-all"
            ></textarea>
          </div>
        </div>
      </div>

      <ProductCodePicker products={products} value={codes} onChange={setCodes} />
      <div className="p-4 rounded-xl border border-gray-100 bg-white">
        <div className="flex items-center justify-between text-sm">
          <div className="text-gray-600">Subtotal</div>
          <div className="font-bold text-gray-900">₹{subtotal}</div>
        </div>
        <div className="flex items-center justify-between text-sm mt-2">
          <div className="text-gray-600">Delivery</div>
          <div className="font-bold text-gray-900">₹{delivery}</div>
        </div>
        <div className="flex items-center justify-between text-sm mt-2">
          <div className="text-gray-600">Gift wrap</div>
          <div className="font-bold text-gray-900">₹{giftWrapCharge}</div>
        </div>
        <div className="flex items-center justify-between text-sm mt-3 border-t pt-3">
          <div className="text-gray-800 font-bold">Total</div>
          <div className="text-gray-900 font-extrabold">₹{total}</div>
        </div>
      </div>

      {error && <div className="text-red-500 text-sm">{error}</div>}
      {success && <div className="text-green-600 text-sm">{success}</div>}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-[#D14D59] text-white py-3 rounded-lg text-sm font-bold hover:bg-[#b93c47] transition-all shadow-md mt-4 disabled:opacity-60"
      >
        {loading ? "Placing..." : "Send details"}
      </button>
    </form>
  );
}
