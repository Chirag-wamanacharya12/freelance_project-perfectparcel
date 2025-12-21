"use client";

import Link from "next/link";
import { useState } from "react";
import { Plus, User, Menu, X } from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import NotificationsPopover from "@/components/NotificationsPopover";
import AddProductForm from "@/components/AddProductForm";

export default function AdminHeader() {
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  return (
    <div className="flex items-center justify-between bg-white border-b border-gray-100 p-4">
      <div className="flex items-center gap-3 flex-1 max-w-xl">
        <button
          className="md:hidden p-2 rounded-lg bg-gray-100 hover:bg-gray-200"
          aria-label="Open menu"
          onClick={() => setOpen(true)}
        >
          <Menu className="w-4 h-4 text-gray-700" />
        </button>
        {/* <input
          type="text"
          placeholder="Search or type a command"
          className="w-full bg-gray-100 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#D14D59]"
        /> */}
      </div>
      <div className="flex items-center gap-3">
        <button
          onClick={() => setCreateOpen(true)}
          className="flex items-center gap-2 bg-[#D14D59] text-white px-3 py-2 rounded-lg text-sm font-bold hover:bg-[#b93c47]"
        >
          <Plus className="w-4 h-4" />
          Create
        </button>
        <NotificationsPopover />
        <div className="p-2 rounded-lg bg-gray-100">
          <User className="w-4 h-4 text-gray-700" />
        </div>
      </div>
      {open && (
        <div className="fixed inset-0 z-[60]">
          <div className="absolute inset-0 bg-black/40" onClick={() => setOpen(false)} />
          <div className="absolute top-0 left-0 w-72 h-full bg-white shadow-2xl p-4 flex flex-col">
            <div className="flex items-center justify-between">
              <div className="text-lg font-bold text-gray-800">Admin</div>
              <button
                aria-label="Close menu"
                onClick={() => setOpen(false)}
                className="p-2 rounded-lg hover:bg-gray-100"
              >
                <X className="w-5 h-5 text-gray-700" />
              </button>
            </div>
            <nav className="mt-6 space-y-2">
              <Link href="/admin" onClick={() => setOpen(false)} className="block px-3 py-2 rounded-lg bg-gray-100 text-gray-900 font-medium">
                Home
              </Link>
              <Link href="/admin/orders" onClick={() => setOpen(false)} className="block px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-50">
                Orders
              </Link>
              <Link href="/admin/products" onClick={() => setOpen(false)} className="block px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-50">
                Products
              </Link>
              <Link href="/admin/customers" onClick={() => setOpen(false)} className="block px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-50">
                Customers
              </Link>
              {/* <Link href="/admin/shop" onClick={() => setOpen(false)} className="block px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-50">
                Shop
              </Link> */}
              <Link href="/admin/income" onClick={() => setOpen(false)} className="block px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-50">
                Income
              </Link>
              {/* <Link href="/admin/promote" onClick={() => setOpen(false)} className="block px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-50">
                Promote
              </Link> */}
              <Link href="/admin/help" onClick={() => setOpen(false)} className="block px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-50">
                Help
              </Link>
            </nav>
            <div className="mt-auto">
              {session ? (
                <button
                  onClick={() => { setOpen(false); signOut(); }}
                  className="w-full px-3 py-2 rounded-lg bg-gray-100 text-gray-800 hover:bg-gray-200"
                >
                  Logout
                </button>
              ) : null}
            </div>
          </div>
        </div>
      )}
      {createOpen && (
        <div className="fixed inset-0 z-[60]">
          <div className="absolute inset-0 bg-black/40" onClick={() => setCreateOpen(false)} />
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-3xl bg-white rounded-2xl shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h3 className="text-lg font-bold text-gray-800">Add Product</h3>
              <button
                aria-label="Close create"
                onClick={() => setCreateOpen(false)}
                className="p-2 rounded-lg hover:bg-gray-100"
              >
                <X className="w-5 h-5 text-gray-700" />
              </button>
            </div>
            <div className="p-6">
              <AddProductForm />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
