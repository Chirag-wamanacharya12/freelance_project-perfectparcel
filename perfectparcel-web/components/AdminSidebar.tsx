"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Package, Users, Store, Wallet, Megaphone, HelpCircle, LogOut } from "lucide-react";
import { signOut, useSession } from "next-auth/react";

const items = [
  { href: "/admin", label: "Home", icon: Home },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/customers", label: "Customers", icon: Users },
  { href: "/admin/income", label: "Income", icon: Wallet },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  return (
    <aside className="w-64 shrink-0 border-r border-gray-100 bg-white min-h-screen p-4 flex flex-col">
      <div className="text-xl font-bold text-gray-800 px-2">Admin</div>
      <nav className="mt-6 space-y-1">
        {items.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg ${active ? "bg-gray-100 text-gray-900 font-semibold" : "text-gray-600 hover:bg-gray-50"}`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-sm">{label}</span>
            </Link>
          );
        })}
      </nav>
      <div className="mt-auto space-y-2">
        <Link href="/admin/help" className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-50">
          <HelpCircle className="w-5 h-5" />
          <span className="text-sm">Help</span>
        </Link>
        {session && (
          <button
            onClick={() => signOut()}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-50"
          >
            <LogOut className="w-5 h-5" />
            <span className="text-sm">Logout</span>
          </button>
        )}
      </div>
    </aside>
  );
}

