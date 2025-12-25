"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

type Status =
  | "pending"
  | "processing"
  | "dispatched"
  | "shipped"
  | "delivered"
  | "canceled";

export default function OrderStatusSelect({
  id,
  value,
}: {
  id: string;
  value: Status;
}) {
  const router = useRouter();
  const [status, setStatus] = useState<Status>(value);
  const [pending, startTransition] = useTransition();
  const [saving, setSaving] = useState(false);

  const colorFor = (s: Status) => {
    switch (s) {
      case "pending":
        return "bg-yellow-50 text-yellow-700";
      case "processing":
        return "bg-blue-50 text-blue-700";
      case "dispatched":
        return "bg-indigo-50 text-indigo-700";
      case "shipped":
        return "bg-purple-50 text-purple-700";
      case "delivered":
        return "bg-green-50 text-green-700";
      case "canceled":
        return "bg-red-50 text-red-700";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const change = async (next: Status) => {
    setStatus(next);
    setSaving(true);
    try {
      const res = await fetch(`/api/orders/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: next }),
      });
      if (!res.ok) {
        setStatus(value);
      } else {
        startTransition(() => router.refresh());
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <select
      value={status}
      onChange={(e) => change(e.target.value as Status)}
      className={`text-xs px-2 py-1 rounded-full ${colorFor(status)} border border-gray-200`}
      disabled={pending || saving || status === "delivered" || status === "canceled"}
    >
      <option value="pending">pending</option>
      <option value="processing">processing</option>
      <option value="dispatched">dispatched</option>
      <option value="shipped">shipped</option>
      <option value="delivered">delivered</option>
      <option value="canceled">canceled</option>
    </select>
  );
}
