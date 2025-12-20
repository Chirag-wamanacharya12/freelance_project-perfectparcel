export default function AdminCustomersPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Customers</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-2xl border border-gray-100 shadow-sm bg-white">
          <div className="text-xs text-gray-500">Total Customers</div>
          <div className="text-3xl font-bold text-gray-900">0</div>
        </div>
        <div className="p-6 rounded-2xl border border-gray-100 shadow-sm bg-white">
          <div className="text-xs text-gray-500">New This Month</div>
          <div className="text-3xl font-bold text-gray-900">0</div>
        </div>
        <div className="p-6 rounded-2xl border border-gray-100 shadow-sm bg-white">
          <div className="text-xs text-gray-500">Returning</div>
          <div className="text-3xl font-bold text-gray-900">0</div>
        </div>
      </div>
    </div>
  );
}

