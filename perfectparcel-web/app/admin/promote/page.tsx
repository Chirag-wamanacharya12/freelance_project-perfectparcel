export default function AdminPromotePage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Promote</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 rounded-2xl border border-gray-100 shadow-sm bg-white">
          <div className="text-sm font-bold text-gray-800">Campaigns</div>
          <div className="text-xs text-gray-500 mt-2">No active campaigns</div>
        </div>
        <div className="p-6 rounded-2xl border border-gray-100 shadow-sm bg-white">
          <div className="text-sm font-bold text-gray-800">Budget</div>
          <div className="text-xs text-gray-500 mt-2">₹0</div>
        </div>
      </div>
    </div>
  );
}

