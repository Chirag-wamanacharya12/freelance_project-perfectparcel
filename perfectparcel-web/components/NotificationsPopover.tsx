"use client";

import { useEffect, useState } from "react";
import { Bell, Check } from "lucide-react";

type Notification = {
  _id: string;
  type: string;
  title: string;
  message: string;
  createdAt: string;
  data?: Record<string, any>;
  isSeen: boolean;
};

export default function NotificationsPopover() {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<Notification[]>([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/notifications");
      const data = await res.json();
      setItems(data.notifications || []);
      setCount(data.unseenCount || 0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) {
      (async () => {
        try {
          await fetch("/api/notifications/seen-all", { method: "PATCH" });
          setCount(0);
        } finally {
          await load();
        }
      })();
    }
  }, [open]);

  const markSeen = async (id: string) => {
    await fetch(`/api/notifications/${id}/seen`, { method: "PATCH" });
    setItems((prev) => prev.map((n) => (n._id === id ? { ...n, isSeen: true } : n)));
    setCount((c) => Math.max(0, c - 1));
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 relative"
        aria-label="Notifications"
      >
        <Bell className="w-4 h-4 text-gray-700" />
        {count > 0 && (
          <span className="absolute -top-1 -right-1 bg-[#D14D59] text-white text-xs px-1.5 rounded-full">
            {count}
          </span>
        )}
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-80 max-h-96 overflow-auto bg-white rounded-2xl shadow-2xl border border-gray-100 z-50">
          <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
            <div className="text-sm font-bold text-gray-800">Notifications</div>
            <button
              className="text-xs text-gray-600 hover:text-[#D14D59]"
              onClick={load}
            >
              Refresh
            </button>
          </div>
          {loading ? (
            <div className="p-6 text-center text-gray-500 text-sm">Loading...</div>
          ) : items.length === 0 ? (
            <div className="p-6 text-center text-gray-500 text-sm">No notifications</div>
          ) : (
            <ul className="divide-y divide-gray-100">
              {items.map((n) => (
                <li key={n._id} className={`px-4 py-3 ${n.isSeen ? "bg-white" : "bg-yellow-50"}`}>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="text-sm font-bold text-gray-800">{n.title}</div>
                      <div className="text-xs text-gray-600">{n.message}</div>
                      <div className="text-[10px] text-gray-400 mt-1">
                        {new Date(n.createdAt).toLocaleString()}
                      </div>
                    </div>
                    {!n.isSeen && (
                      <button
                        className="text-xs px-2 py-1 rounded bg-gray-800 text-white hover:bg-black flex items-center gap-1"
                        onClick={() => markSeen(n._id)}
                      >
                        <Check className="w-3 h-3" />
                        Mark seen
                      </button>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
