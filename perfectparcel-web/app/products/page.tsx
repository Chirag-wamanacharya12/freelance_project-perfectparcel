import clientPromise from "@/lib/mongodb";
import Image from "next/image";
import { Plus } from "lucide-react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import AddProductForm from "@/components/AddProductForm";
import ProductCodePicker from "@/components/ProductCodePicker";

interface Product {
  _id: string;
  name: string;
  productId: string;
  price: number;
  category: string;
  image: string;
  inStock: boolean;
  description?: string;
}

async function getProducts() {
  const client = await clientPromise;
  const db = client.db("perfectparcel");
  const products = await db.collection("products").find({}).toArray();
  // Serialize to handle ObjectId and other non-serializable fields if needed, 
  // though for server components strict serialization isn't always enforced for internal use,
  // but it's good practice especially if we pass data to client components later.
  return JSON.parse(JSON.stringify(products)) as Product[];
}

export const dynamic = 'force-dynamic';

export default async function ProductsPage() {
  const [products, session] = await Promise.all([
    getProducts(),
    getServerSession(authOptions),
  ]);
  const isAdmin = session?.user?.role === "admin";

  // Group by category
  const categories: { [key: string]: Product[] } = {};
  products.forEach((product) => {
    const cat = product.category || "Uncategorized";
    if (!categories[cat]) {
      categories[cat] = [];
    }
    categories[cat].push(product);
  });

  return (
    <div className="min-h-screen bg-white pb-20">
      {/* Header */}
      <div className="bg-[#BF2B32] text-white py-6 sticky top-0 z-50 shadow-md">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
          <h1 className="font-serif text-2xl font-bold tracking-wide">Our Collections</h1>
          <a
            href="/"
            className="px-4 py-2 bg-white text-[#D14D59] rounded-full text-sm font-bold shadow hover:bg-gray-100"
          >
            Back to Home
          </a>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {Object.keys(categories).length === 0 ? (
           <div className="text-center py-20 space-y-4">
             <p className="text-gray-500 text-lg">No products found in the collection.</p>
             <p className="text-sm text-gray-400">Please check back later.</p>
           </div>
        ) : (
          Object.entries(categories).map(([category, items]) => (
            <div key={category} className="mb-16">
              <h2 className="text-xl font-bold text-gray-800 mb-8 border-b-2 border-gray-100 pb-2 inline-block pr-10">
                {category}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10">
                {items.map((product) => (
                  <div key={product._id} className="bg-white group">
                    <div className="relative aspect-square w-full bg-gray-100 rounded-2xl overflow-hidden mb-4 shadow-sm border border-gray-100">
                      <Image
                        src={product.image || "/images/placeholder.jpg"}
                        alt={product.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      {/* Optional: Add quick view or add to cart overlay here */}
                    </div>
                    <div className="space-y-1.5 px-1">
                      <h3 className="text-sm font-bold text-gray-900 leading-tight line-clamp-2">
                        {product.name}
                      </h3>
                      <p className="text-[10px] text-gray-500 font-mono">
                        Product id : {product.productId}
                      </p>
                      <div className="flex items-center justify-between pt-1">
                        <p className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${product.inStock ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                          {product.inStock ? 'In stock' : 'Out of stock'}
                        </p>
                        <p className="text-lg font-bold text-gray-900">
                          ₹{product.price}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}

        {/* Admin: Add Product / Customer: Place Order */}
        <div className="mt-20 border-2 border-[#D14D59] rounded-xl overflow-hidden max-w-4xl mx-auto shadow-xl bg-white">
          <div className="bg-[#D14D59] text-white py-4 text-center font-bold text-xl tracking-wide">
            {isAdmin ? "Add Product" : "Place Order"}
          </div>
          <div className="p-8">
            {isAdmin ? (
              <AddProductForm />
            ) : (
              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-800">Customer name</label>
                    <input
                      type="text"
                      placeholder="Enter your name"
                      className="w-full text-sm p-3 bg-gray-100 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#D14D59] transition-all"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-800">Mobile no</label>
                    <input
                      type="tel"
                      placeholder="Enter your mobile no"
                      className="w-full text-sm p-3 bg-gray-100 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#D14D59] transition-all"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="text-xs font-bold text-gray-800">Delivery address</label>
                    <input
                      type="text"
                      placeholder="House no / Apartment"
                      className="w-full text-sm p-3 bg-gray-100 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#D14D59] transition-all"
                    />
                    <input
                      type="text"
                      placeholder="Locality / street / city"
                      className="w-full text-sm p-3 bg-gray-100 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#D14D59] transition-all"
                    />
                    <div className="grid grid-cols-[2fr_1fr] gap-3">
                      <input
                        type="text"
                        placeholder="Landmark"
                        className="w-full text-sm p-3 bg-gray-100 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#D14D59] transition-all"
                      />
                      <input
                        type="text"
                        placeholder="Pin Code"
                        className="w-full text-sm p-3 bg-gray-100 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#D14D59] transition-all"
                      />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-gray-800">Alternate Mobile no</label>
                      <input
                        type="tel"
                        placeholder="Enter your mobile no"
                        className="w-full text-sm p-3 bg-gray-100 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#D14D59] transition-all"
                      />
                    </div>
                    <div className="flex items-center gap-2 pt-2">
                      <input
                        type="checkbox"
                        id="gift-wrap"
                        className="w-4 h-4 accent-[#D14D59] rounded cursor-pointer"
                      />
                      <label htmlFor="gift-wrap" className="text-sm text-gray-500 cursor-pointer select-none">
                        Want Gift wrap ? ( charges applicable )
                      </label>
                    </div>
                    <div className="relative">
                      <textarea
                        placeholder="Additional note"
                        className="w-full text-sm p-3 bg-gray-100 rounded-lg h-24 resize-none focus:outline-none focus:ring-1 focus:ring-[#D14D59] transition-all"
                      ></textarea>
                    </div>
                  </div>
                </div>
                <ProductCodePicker products={products} />
                <button
                  type="submit"
                  className="w-full bg-[#D14D59] text-white py-3 rounded-lg text-sm font-bold hover:bg-[#b93c47] transition-all shadow-md mt-4"
                >
                  Send details
                </button>
              </form>
            )}
          </div>
        </div>

      </div>
      
      {/* Simple footer for this page */}
      <footer className="mt-20 py-8 text-center text-gray-400 text-sm border-t border-gray-100">
        <p>© 2025 Perfect Parcel. All rights reserved.</p>
      </footer>
    </div>
  );
}
