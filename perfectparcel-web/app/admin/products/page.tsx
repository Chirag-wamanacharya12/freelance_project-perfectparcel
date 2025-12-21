import clientPromise from "@/lib/mongodb";
import Image from "next/image";

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
          {products.map((p: any) => (
            <div key={p._id} className="border rounded-xl overflow-hidden bg-white">
              <div className="relative aspect-square bg-gray-100">
                <Image src={p.image || "/images/placeholder.jpg"} alt={p.name || p.productId} fill className="object-cover" />
              </div>
              <div className="px-3 py-2">
                <div className="text-xs text-gray-500">Product id: {p.productId}</div>
                <div className="text-sm font-bold text-gray-900">₹{p.price}</div>
                <div className="text-xs">{p.category}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
