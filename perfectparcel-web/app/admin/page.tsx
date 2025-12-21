import clientPromise from "@/lib/mongodb";
import Image from "next/image";

export const dynamic = "force-dynamic";

async function getInsights() {
  const client = await clientPromise;
  const db = client.db("perfectparcel");

  const totalProducts = await db.collection("products").countDocuments({});

  const byCategory = await db
    .collection("products")
    .aggregate([
      {
        $group: {
          _id: { $ifNull: ["$category", "Uncategorized"] },
          count: { $sum: 1 },
          totalValue: { $sum: { $ifNull: ["$price", 0] } },
          inStockCount: {
            $sum: {
              $cond: [{ $eq: ["$inStock", true] }, 1, 0],
            },
          },
        },
      },
      { $sort: { count: -1 } },
    ])
    .toArray();

  const totalInStock = byCategory.reduce((acc, c: any) => acc + (c.inStockCount || 0), 0);
  const totalValue = byCategory.reduce((acc, c: any) => acc + (c.totalValue || 0), 0);
  const avgPrice = totalProducts ? Number((totalValue / totalProducts).toFixed(2)) : 0;

  const recent = await db
    .collection("products")
    .find({})
    .sort({ createdAt: -1 })
    .limit(6)
    .toArray();

  return {
    totalProducts,
    totalInStock,
    totalOutOfStock: Math.max(0, totalProducts - totalInStock),
    avgPrice,
    totalValue: Number(totalValue.toFixed(2)),
    categories: byCategory.map((c: any) => ({
      name: c._id,
      count: c.count,
      totalValue: Number((c.totalValue || 0).toFixed(2)),
      avgPrice: c.count ? Number(((c.totalValue || 0) / c.count).toFixed(2)) : 0,
      inStockCount: c.inStockCount || 0,
    })),
    recent: JSON.parse(JSON.stringify(recent)),
  };
}

export default async function AdminDashboard() {
  const insights = await getInsights();

  return (
    <div className="max-w-7xl mx-auto py-6 space-y-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="p-6 rounded-2xl border border-gray-100 shadow-sm bg-white">
            <div className="text-xs text-gray-500">Total Products</div>
            <div className="text-3xl font-bold text-gray-900">{insights.totalProducts}</div>
          </div>
          <div className="p-6 rounded-2xl border border-gray-100 shadow-sm bg-white">
            <div className="text-xs text-gray-500">In Stock</div>
            <div className="text-3xl font-bold text-green-700">{insights.totalInStock}</div>
          </div>
          <div className="p-6 rounded-2xl border border-gray-100 shadow-sm bg-white">
            <div className="text-xs text-gray-500">Out of Stock</div>
            <div className="text-3xl font-bold text-red-700">{insights.totalOutOfStock}</div>
          </div>
          <div className="p-6 rounded-2xl border border-gray-100 shadow-sm bg-white">
            <div className="text-xs text-gray-500">Average Price</div>
            <div className="text-3xl font-bold text-gray-900">₹{insights.avgPrice}</div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-800">Categories</h2>
          </div>
          <div className="p-6">
            {insights.categories.length === 0 ? (
              <div className="p-6 text-center text-gray-500 bg-white rounded-2xl border border-gray-100">No categories available</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {insights.categories.map((cat) => (
                  <div key={cat.name} className="p-4 border rounded-xl">
                    <div className="flex items-center justify-between">
                      <div className="font-bold text-gray-800">{cat.name}</div>
                      <div className="text-sm text-gray-500">{cat.count} items</div>
                    </div>
                    <div className="mt-3 h-2 bg-gray-100 rounded">
                      <div
                        className="h-2 bg-[#D14D59] rounded"
                        style={{
                          width: `${Math.min(100, Math.round((cat.inStockCount / Math.max(1, cat.count)) * 100))}%`,
                        }}
                      />
                    </div>
                    <div className="mt-2 flex items-center justify-between text-sm text-gray-600">
                      <div>In stock: {cat.inStockCount}</div>
                      <div>Total value: ₹{cat.totalValue}</div>
                      <div>Avg price: ₹{cat.avgPrice}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-800">Recent Products</h2>
          </div>
          {insights.recent.length === 0 ? (
            <div className="p-6 text-center text-gray-500">No recent products</div>
          ) : (
            <div className="p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {insights.recent.map((p: any) => (
                <div key={p._id} className="border rounded-xl overflow-hidden">
                  <div className="relative aspect-square bg-gray-100">
                    <Image
                      src={p.image || "/images/placeholder.jpg"}
                      alt={p.name || p.productId}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="px-3 py-2">
                    <div className="text-xs text-gray-500">Product id: {p.productId}</div>
                    <div className="text-sm font-bold text-gray-900">₹{p.price}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
  );
}
