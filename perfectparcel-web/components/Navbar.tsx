"use client";

import Link from "next/link";
import { useState } from "react";
import { Package, LogOut, User as UserIcon, Menu, X } from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import NotificationsPopover from "@/components/NotificationsPopover";

export default function Navbar() {
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);

  return (
    <>
    <nav className="absolute top-0 left-0 right-0 z-50 p-6 flex items-center justify-between max-w-7xl mx-auto">
      <div className="flex items-center gap-2 text-white">
        <div className="bg-white/20 p-2 rounded-full backdrop-blur-sm">
           <Package className="w-6 h-6" />
        </div>
        <span className="font-bold text-xl tracking-wide">Perfect Parcel</span>
      </div>

      <div className="hidden md:flex items-center gap-4">
        <div className="flex items-center bg-white rounded-full px-2 py-1 shadow-lg">
          <Link 
            href="/" 
            className="px-6 py-2 bg-[#D14D59] text-white rounded-full text-sm font-medium transition-colors"
          >
            Home
          </Link>
          <Link 
            href="#" 
            className="px-6 py-2 text-gray-700 hover:text-[#D14D59] rounded-full text-sm font-medium transition-colors"
          >
            About us
          </Link>
          <Link 
            href="/products" 
            className="px-6 py-2 text-gray-700 hover:text-[#D14D59] rounded-full text-sm font-medium transition-colors"
          >
            Collections
          </Link>
          <Link 
            href="#" 
            className="px-6 py-2 text-gray-700 hover:text-[#D14D59] rounded-full text-sm font-medium transition-colors"
          >
            Contact us
          </Link>
          {session?.user?.role === "admin" && (
            <Link 
              href="/admin" 
              className="px-6 py-2 text-gray-700 hover:text-[#D14D59] rounded-full text-sm font-bold transition-colors"
              title="Go to Admin Dashboard"
            >
              Admin
            </Link>
          )}
        </div>

        {session ? (
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full p-1 pl-4 border border-white/20 shadow-lg">
                <div className="flex items-center gap-2 text-white text-sm">
                    <UserIcon className="w-4 h-4" />
                    <span className="font-medium">{session.user?.name}</span>
                    {session.user?.role === 'admin' && (
                        <span className="bg-yellow-500 text-xs px-1.5 py-0.5 rounded text-white font-bold uppercase tracking-wider">Admin</span>
                    )}
                </div>
                <NotificationsPopover />
                <button 
                    onClick={() => signOut()}
                    className="p-2 bg-white/20 hover:bg-white/30 rounded-full text-white transition-colors"
                    title="Logout"
                >
                    <LogOut className="w-4 h-4" />
                </button>
            </div>
        ) : (
            <Link 
                href="/login"
                className="px-6 py-3 bg-white text-[#D14D59] rounded-full text-sm font-bold shadow-lg hover:bg-gray-100 transition-colors"
            >
                Login
            </Link>
        )}
      </div>
      
      <div className="md:hidden">
        <button
          aria-label="Open menu"
          className="p-2 rounded-full bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 transition"
          onClick={() => setOpen(true)}
        >
          <Menu className="w-5 h-5" />
        </button>
      </div>
    </nav>
    {open && (
      <div className="fixed inset-0 z-[60]">
        <div className="absolute inset-0 bg-black/40" onClick={() => setOpen(false)} />
        <div className="absolute top-0 right-0 w-72 h-full bg-white shadow-2xl p-4 flex flex-col">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-gray-800">
              <div className="bg-gray-100 p-2 rounded-full">
                <Package className="w-5 h-5" />
              </div>
              <span className="font-bold">Perfect Parcel</span>
            </div>
            <button
              aria-label="Close menu"
              onClick={() => setOpen(false)}
              className="p-2 rounded-lg hover:bg-gray-100"
            >
              <X className="w-5 h-5 text-gray-700" />
            </button>
          </div>
          <nav className="mt-6 space-y-2">
            <Link href="/" onClick={() => setOpen(false)} className="block px-3 py-2 rounded-lg bg-[#D14D59] text-white font-medium">
              Home
            </Link>
            <Link href="#" onClick={() => setOpen(false)} className="block px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-50">
              About us
            </Link>
            <Link href="/products" onClick={() => setOpen(false)} className="block px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-50">
              Collections
            </Link>
            <Link href="#" onClick={() => setOpen(false)} className="block px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-50">
              Contact us
            </Link>
            {session?.user?.role === "admin" && (
              <Link href="/admin" onClick={() => setOpen(false)} className="block px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-50 font-bold">
                Admin
              </Link>
            )}
          </nav>
          <div className="mt-auto">
            {session ? (
              <button
                onClick={() => { setOpen(false); signOut(); }}
                className="w-full px-3 py-2 rounded-lg bg-gray-100 text-gray-800 hover:bg-gray-200 flex items-center justify-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            ) : (
              <Link
                href="/login"
                onClick={() => setOpen(false)}
                className="block w-full px-3 py-2 rounded-lg bg-gray-800 text-white text-center font-bold"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    )}
    </>
  );
}
