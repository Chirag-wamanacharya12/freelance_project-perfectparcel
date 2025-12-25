import clientPromise from "@/lib/mongodb";

export const dynamic = "force-dynamic";

async function getIncomeForYear(year: number) {
  const client = await clientPromise;
  const db = client.db("perfectparcel");
  const docs = await db.collection("income").find({ type: "summary", period: { $regex: `^${year}-` } }).toArray();
  const byMonth: Record<number, number> = {};
  docs.forEach((d: any) => {
    const m = Number((d.period || "").split("-")[1] || 0);
    if (m >= 1 && m <= 12) {
      byMonth[m] = Number(d.total || 0);
    }
  });
  const values = Array.from({ length: 12 }, (_, i) => byMonth[i + 1] || 0);
  return values;
}

export default async function AdminIncomePage() {
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const now = new Date();
  const values = await getIncomeForYear(now.getFullYear());
  const max = Math.max(...values, 1);
  const avg = Math.round(values.reduce((a, b) => a + b, 0) / values.length || 0);
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Income</h1>
      <div className="p-6 rounded-2xl border border-gray-100 shadow-sm bg-white">
        <div className="overflow-x-auto hide-scrollbar">
          <div className="relative flex items-end gap-6 h-64 w-max pr-6 pl-16">
            <div
              className="absolute left-0 right-0 border-t border-dashed border-gray-500"
              style={{ top: `${100 - Math.round((avg / max) * 100)}%` }}
            />
            <div
              className="absolute left-0 -translate-y-[85%] z-10 text-xs text-gray-700 font-medium"
              style={{ top: `${100 - Math.round((avg / max) * 100)}%` }}
            >
              Average ₹{avg}
            </div>
            {values.map((v, i) => (
              <div key={i} className="flex flex-col items-center gap-2 min-w-14">
                <div
                  className="w-8 bg-[#93B1F2]/80 rounded-t-lg"
                  style={{ height: `${Math.round((v / max) * 100)}%` }}
                  title={`${months[i]}: ₹${v}`}
                />
                <div className="text-xs text-gray-900 font-semibold">₹{v}</div>
                <div className="text-xs text-gray-500">{months[i]}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
