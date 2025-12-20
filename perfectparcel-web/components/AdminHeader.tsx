"use client";

import Link from "next/link";
import { Bell, Plus, User } from "lucide-react";
import { useSession } from "next-auth/react";

export default function AdminHeader() {
  const { data: session } = useSession();
  return (
    <div className="flex items-center justify-between bg-white border-b border-gray-100 p-4">
      <div className="flex items-center gap-3 flex-1 max-w-xl">
        <input
          type="text"
          placeholder="Search or type a command"
          className="w-full bg-gray-100 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#D14D59]"
        />
      </div>
      <div className="flex items-center gap-3">
        <Link
          href="/products"
          className="flex items-center gap-2 bg-[#D14D59] text-white px-3 py-2 rounded-lg text-sm font-bold hover:bg-[#b93c47]"
        >
          <Plus className="w-4 h-4" />
          Create
        </Link>
        <button className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200">
          <Bell className="w-4 h-4 text-gray-700" />
        </button>
        <div className="p-2 rounded-lg bg-gray-100">
          <User className="w-4 h-4 text-gray-700" />
        </div>
      </div>
    </div>
  );
}

