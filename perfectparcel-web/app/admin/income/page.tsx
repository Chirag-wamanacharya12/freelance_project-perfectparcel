export default function AdminIncomePage() {
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const values = [300,120,340,280,90,150,220,80,320,0,360,380];
  const max = Math.max(...values);
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Income</h1>
      <div className="p-6 rounded-2xl border border-gray-100 shadow-sm bg-white">
        <div className="flex items-end gap-3 h-48">
          {values.map((v, i) => (
            <div key={i} className="flex flex-col items-center gap-2">
              <div
                className="w-6 bg-[#3B82F6] rounded"
                style={{ height: `${Math.round((v / max) * 100)}%` }}
                title={`${months[i]}: ${v}K`}
              />
              <div className="text-xs text-gray-500">{months[i]}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

