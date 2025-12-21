import clientPromise from "@/lib/mongodb";

export const dynamic = "force-dynamic";

async function getCustomerStats() {
  const client = await clientPromise;
  const db = client.db("perfectparcel");
  const now = new Date();
  const period = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  const total = await db.collection("customers").countDocuments({ period });
  const New = await db.collection("customers").countDocuments({ period, status: "new" });
  const returning = await db.collection("customers").countDocuments({ period, status: "returning" });
  return { total, New, returning, period };
}

export default async function AdminCustomersPage() {
  const stats = await getCustomerStats();
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Customers</h1>
      <div className="text-xs text-gray-500">Showing current month: {stats.period}</div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-2xl border border-gray-100 shadow-sm bg-white">
          <div className="text-xs text-gray-500">Total Customers</div>
          <div className="text-3xl font-bold text-gray-900">{stats.total}</div>
        </div>
        <div className="p-6 rounded-2xl border border-gray-100 shadow-sm bg-white">
          <div className="text-xs text-gray-500">New This Month</div>
          <div className="text-3xl font-bold text-gray-900">{stats.New}</div>
        </div>
        <div className="p-6 rounded-2xl border border-gray-100 shadow-sm bg-white">
          <div className="text-xs text-gray-500">Returning</div>
          <div className="text-3xl font-bold text-gray-900">{stats.returning}</div>
        </div>
      </div>
    </div>
  );
}
