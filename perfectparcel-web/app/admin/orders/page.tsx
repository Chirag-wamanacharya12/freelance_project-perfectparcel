import clientPromise from "@/lib/mongodb";
import Link from "next/link";
import OrderStatusSelect from "@/components/OrderStatusSelect";

export const dynamic = "force-dynamic";

type Order = {
  _id: string;
  orderId: string;
  customerName: string;
  mobile?: string;
  altMobile?: string;
  address?: {
    house?: string;
    street?: string;
    landmark?: string;
    pin?: string;
  };
  giftWrap?: boolean;
  note?: string;
  productIds: string[];
  amount: number;
  status: "pending" | "processing" | "dispatched" | "shipped" | "delivered" | "canceled";
  createdAt: string;
};

function formatProducts(productIds: string[]) {
  if (!Array.isArray(productIds)) return "-";
  const counts: Record<string, number> = {};
  productIds.forEach((p) => {
    counts[p] = (counts[p] || 0) + 1;
  });
  return Object.entries(counts)
    .map(([name, count]) => `${name} (${count})`)
    .join(", ");
}

function badge(status: Order["status"]) {
  const map: Record<Order["status"], string> = {
    pending: "bg-yellow-50 text-yellow-700",
    processing: "bg-blue-50 text-blue-700",
    dispatched: "bg-indigo-50 text-indigo-700",
    shipped: "bg-purple-50 text-purple-700",
    delivered: "bg-green-50 text-green-700",
    canceled: "bg-red-50 text-red-700",
  };
  return map[status] || "bg-gray-50 text-gray-700";
}

async function getOrders(status?: string) {
  try {
    const client = await clientPromise;
    const db = client.db("perfectparcel");
    const query = status && status !== "all" ? { status } : {};
    const orders = await db.collection("orders").find(query).sort({ createdAt: -1 }).toArray();
    
    return orders.map((o: any) => ({
      ...o,
      _id: o._id?.toString(),
      createdAt: o.createdAt instanceof Date ? o.createdAt.toISOString() : String(o.createdAt),
    })) as Order[];
  } catch (error) {
    console.error("Failed to fetch orders:", error);
    return [];
  }
}

export default async function AdminOrdersPage({ searchParams }: { searchParams?: Promise<{ status?: string }> }) {
  const sp = (await searchParams) || {};
  const status = sp.status || "all";
  const orders = await getOrders(status);
  const allStatuses: Order["status"][] = ["pending", "processing", "dispatched", "shipped", "delivered", "canceled"];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Orders</h1>
        <div className="flex items-center gap-2">
          {(["all", ...allStatuses] as const).map((s) => (
            <Link
              key={s}
              href={`/admin/orders?status=${s}`}
              className={`px-3 py-1.5 rounded-full text-sm ${status === s ? "bg-[#D14D59] text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
            >
              {s[0].toUpperCase() + s.slice(1)}
            </Link>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-gray-100 shadow-sm bg-white hidden md:block">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="text-left px-4 py-3">Order ID</th>
                <th className="text-left px-4 py-3">Customer</th>
                <th className="text-left px-4 py-3">Contact</th>
                <th className="text-left px-4 py-3">Address</th>
                <th className="text-left px-4 py-3">Products</th>
                <th className="text-left px-4 py-3">Amount</th>
                <th className="text-left px-4 py-3">Status</th>
                <th className="text-left px-4 py-3">Created</th>
              </tr>
            </thead>
            <tbody>
              {orders.length === 0 ? (
                <tr>
                  <td className="px-4 py-8 text-center text-gray-500" colSpan={8}>
                    No orders found
                  </td>
                </tr>
              ) : (
                orders.map((o) => (
                  <tr key={o._id} className="border-t border-gray-100">
                    <td className="px-4 py-3 font-mono">{o.orderId || o._id}</td>
                    <td className="px-4 py-3">
                      <div>{o.customerName || "-"}</div>
                      {o.note && <div className="text-xs text-gray-500 italic mt-1">Note: {o.note}</div>}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <div>{o.mobile}</div>
                      {o.altMobile && <div className="text-gray-500 text-xs">{o.altMobile}</div>}
                    </td>
                    <td className="px-4 py-3">
                      {[
                        o.address?.house,
                        o.address?.street,
                        o.address?.landmark,
                        o.address?.pin,
                      ]
                        .filter(Boolean)
                        .join(", ") || "-"}
                      {o.giftWrap && (
                        <div className="mt-1 inline-block px-2 py-0.5 rounded text-[10px] bg-pink-50 text-pink-600 border border-pink-100">
                          Gift Wrap
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3">{formatProducts(o.productIds)}</td>
                    <td className="px-4 py-3 font-bold">₹{o.amount ?? 0}</td>
                    <td className="px-4 py-3">
                      <OrderStatusSelect id={o._id} value={o.status} />
                    </td>
                    <td className="px-4 py-3">{new Date(o.createdAt).toLocaleString()}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="md:hidden space-y-3">
        {orders.length === 0 ? (
          <div className="p-6 text-center text-gray-500 bg-white rounded-2xl border border-gray-100">No orders found</div>
        ) : (
          orders.map((o) => (
            <div key={o._id} className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="font-mono text-sm">{o.orderId || o._id}</div>
                <OrderStatusSelect id={o._id} value={o.status} />
              </div>
              <div className="mt-2 text-sm text-gray-700 font-medium">{o.customerName || "-"}</div>
              <div className="text-xs text-gray-500">
                {o.mobile} {o.altMobile && `• ${o.altMobile}`}
              </div>
              <div className="mt-2 text-xs text-gray-600 bg-gray-50 p-2 rounded">
                {[
                  o.address?.house,
                  o.address?.street,
                  o.address?.landmark,
                  o.address?.pin,
                ]
                  .filter(Boolean)
                  .join(", ") || "-"}
              </div>
              {o.note && <div className="mt-1 text-xs text-gray-500 italic">Note: {o.note}</div>}
              {o.giftWrap && (
                <div className="mt-1 inline-block px-2 py-0.5 rounded text-[10px] bg-pink-50 text-pink-600 border border-pink-100">
                  Gift Wrap
                </div>
              )}
              <div className="mt-2 text-xs text-gray-700">{formatProducts(o.productIds)}</div>
              <div className="mt-2 flex items-center justify-between border-t pt-2">
                <div className="text-sm font-bold">₹{o.amount ?? 0}</div>
                <div className="text-xs text-gray-500">{new Date(o.createdAt).toLocaleString()}</div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
