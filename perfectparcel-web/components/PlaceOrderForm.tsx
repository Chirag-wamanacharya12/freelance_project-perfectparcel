"use client";

import { useEffect, useMemo, useState } from "react";
import ProductCodePicker from "@/components/ProductCodePicker";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { LogIn } from "lucide-react";

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
  const [house, setHouse] = useState("");
  const [street, setStreet] = useState("");
  const [landmark, setLandmark] = useState("");
  const [pin, setPin] = useState("");
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

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/api/me");
        const data = await res.json();
        const user = data.user || {};
        const last = data.lastOrder || null;
        if (!name && user.name) setName(user.name);
        if (!mobile && last?.mobile) setMobile(last.mobile);
        if (!house && last?.address?.house) setHouse(last.address.house);
        if (!street && last?.address?.street) setStreet(last.address.street);
        if (!landmark && last?.address?.landmark) setLandmark(last.address.landmark);
        if (!pin && last?.address?.pin) setPin(last.address.pin);
      } catch {}
    };
    if (session) load();
  }, [session]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!session) {
      setError("Please login to place an order");
      return;
    }

    if (!name || !mobile || !house || !street || !landmark || !pin || !codes) {
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
          address: {
            house,
            street,
            landmark,
            pin,
          },
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
        setHouse("");
        setStreet("");
        setLandmark("");
        setPin("");
        setCodes("");
      }
    } catch {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-[2rem] border-4 border-[#D14D59] overflow-hidden shadow-2xl">
      <div className="bg-[#D14D59] py-6 px-4">
        <h2 className="text-3xl font-extrabold text-white text-center tracking-tight">Place Order</h2>
      </div>
      
      <form className="p-6 space-y-5" onSubmit={submit}>
        <div className="space-y-1.5">
          <label className="text-sm font-bold text-gray-800 ml-1">Customer name</label>
          <input
            type="text"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full text-sm p-3.5 bg-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D14D59]/20 border border-transparent focus:border-[#D14D59] transition-all placeholder:text-gray-400"
            required
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-bold text-gray-800 ml-1">Delivery address</label>
          <div className="space-y-3">
            <input
              type="text"
              placeholder="House no / Apartment"
              value={house}
              onChange={(e) => setHouse(e.target.value)}
              className="w-full text-sm p-3.5 bg-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D14D59]/20 border border-transparent focus:border-[#D14D59] transition-all placeholder:text-gray-400"
              required
            />
            <input
              type="text"
              placeholder="Locality / street / city"
              value={street}
              onChange={(e) => setStreet(e.target.value)}
              className="w-full text-sm p-3.5 bg-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D14D59]/20 border border-transparent focus:border-[#D14D59] transition-all placeholder:text-gray-400"
              required
            />
            <div className="grid grid-cols-2 gap-3">
              <input
                type="text"
                placeholder="Landmark"
                value={landmark}
                onChange={(e) => setLandmark(e.target.value)}
                className="w-full text-sm p-3.5 bg-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D14D59]/20 border border-transparent focus:border-[#D14D59] transition-all placeholder:text-gray-400"
                required
              />
              <input
                type="text"
                placeholder="Pin Code"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                className="w-full text-sm p-3.5 bg-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D14D59]/20 border border-transparent focus:border-[#D14D59] transition-all placeholder:text-gray-400"
                required
              />
            </div>
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-bold text-gray-800 ml-1">Mobile no</label>
          <input
            type="tel"
            placeholder="Enter your mobile no"
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
            className="w-full text-sm p-3.5 bg-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D14D59]/20 border border-transparent focus:border-[#D14D59] transition-all placeholder:text-gray-400"
            required
          />
        </div>

        <ProductCodePicker products={products} value={codes} onChange={setCodes} />

        {!session && (
          <div className="bg-amber-50 text-amber-700 text-sm p-4 rounded-2xl border border-amber-100 flex flex-col items-center gap-3">
            <div className="flex items-center gap-2 font-bold">
              <LogIn className="w-4 h-4" />
              Login Required
            </div>
            <p className="text-center text-xs text-amber-600">
              You need to be logged in to place an order and track its status.
            </p>
            <Link 
              href="/login" 
              className="px-6 py-2 bg-amber-600 text-white rounded-xl text-xs font-bold hover:bg-amber-700 transition-all shadow-md shadow-amber-200"
            >
              Login Now
            </Link>
          </div>
        )}

        {error && (
          <div className="bg-red-50 text-red-500 text-xs p-3 rounded-lg border border-red-100 font-medium">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-green-50 text-green-600 text-xs p-3 rounded-lg border border-green-100 font-medium">
            {success}
          </div>
        )}

        <button
          type="submit"
          disabled={loading || !session}
          className="w-full bg-[#D14D59] text-white py-4 rounded-xl text-base font-bold hover:bg-[#b93c47] transition-all shadow-lg shadow-[#D14D59]/30 disabled:opacity-60 disabled:bg-gray-400 disabled:shadow-none active:scale-[0.98]"
        >
          {!session ? "Login to place order" : loading ? "Processing..." : "Send details"}
        </button>
      </form>
    </div>
  );
}
