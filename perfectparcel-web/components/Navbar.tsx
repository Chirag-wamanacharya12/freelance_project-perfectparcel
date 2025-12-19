import Link from "next/link";
import { Package } from "lucide-react";

export default function Navbar() {
  return (
    <nav className="absolute top-0 left-0 right-0 z-50 p-6 flex items-center justify-between max-w-7xl mx-auto">
      <div className="flex items-center gap-2 text-white">
        <div className="bg-white/20 p-2 rounded-full backdrop-blur-sm">
           <Package className="w-6 h-6" />
        </div>
        <span className="font-bold text-xl tracking-wide">Perfect Parcel</span>
      </div>

      <div className="hidden md:flex items-center bg-white rounded-full px-2 py-1 shadow-lg">
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
          href="#" 
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
      </div>
    </nav>
  );
}
