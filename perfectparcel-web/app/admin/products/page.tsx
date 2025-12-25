import clientPromise from "@/lib/mongodb";
import Image from "next/image";
import AdminProductCard from "@/components/AdminProductCard";

export const dynamic = "force-dynamic";

async function getProducts() {
  const client = await clientPromise;
  const db = client.db("perfectparcel");
  const products = await db.collection("products").find({}).sort({ createdAt: -1 }).toArray();
  return JSON.parse(JSON.stringify(products));
}

export default async function AdminProductsPage() {
  const products = await getProducts();
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Products</h1>
      {products.length === 0 ? (
        <div className="p-6 text-center text-gray-500 bg-white rounded-2xl border border-gray-100">No products found</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((p: any) => <AdminProductCard key={p._id} product={p} />)}
        </div>
      )}
    </div>
  );
}
