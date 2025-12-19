"use client";

import Image from "next/image";
import { ShoppingBag, ChevronLeft, ChevronRight } from "lucide-react";
import { useRef } from "react";

const collections = [
  {
    id: 1,
    name: "Girly Beads Bracelet",
    price: "Starting from Jan 25.22",
    image: "/images/collection-1.jpg",
  },
  {
    id: 2,
    name: "Press - On nails",
    price: "Full set starting at 10.25",
    image: "/images/collection-2.jpg",
  },
  {
    id: 3,
    name: "Bracelet With Charm",
    price: "Starting from Jan 15.22",
    image: "/images/collection-3.jpg",
  },
  {
    id: 4,
    name: "Stylish Ear rings",
    price: "Starting from 12.00",
    image: "/images/collection-4.jpg",
  },
];

export default function Collections() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 300; // Adjust based on card width + gap
      const newScrollLeft =
        direction === "left"
          ? scrollRef.current.scrollLeft - scrollAmount
          : scrollRef.current.scrollLeft + scrollAmount;

      scrollRef.current.scrollTo({
        left: newScrollLeft,
        behavior: "smooth",
      });
    }
  };

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        
        <div className="flex flex-col md:flex-row gap-12 mb-12">
           <div className="md:w-1/3 space-y-6">
              <h2 className="font-serif text-4xl font-bold text-gray-800">Our Collections</h2>
              <p className="text-gray-600 text-sm leading-relaxed">
                Our latest collection offers a stunning variety of styles, ranging from the delicate elegance of pearls to the bold statement of chunky chains. Each piece is designed to be mixed and matched, allowing you to curate your own personal style with every detail.
              </p>
              <button className="px-8 py-3 rounded-full border border-gray-400 text-gray-700 hover:bg-gray-800 hover:text-white transition-colors uppercase text-sm tracking-wider">
                See All
              </button>
           </div>

           <div className="md:w-2/3 relative group">
              {/* Navigation Buttons */}
              <button 
                onClick={() => scroll("left")}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 bg-white/90 p-2 rounded-full shadow-lg text-gray-800 hover:bg-white hover:scale-110 transition-all opacity-0 group-hover:opacity-100 disabled:opacity-0"
                aria-label="Scroll left"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              
              <button 
                onClick={() => scroll("right")}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 bg-white/90 p-2 rounded-full shadow-lg text-gray-800 hover:bg-white hover:scale-110 transition-all opacity-0 group-hover:opacity-100 disabled:opacity-0"
                aria-label="Scroll right"
              >
                <ChevronRight className="w-6 h-6" />
              </button>

              <div 
                ref={scrollRef}
                className="overflow-x-auto pb-8 hide-scrollbar scroll-smooth snap-x snap-mandatory"
              >
                 <div className="flex gap-6 w-max pr-6">
                    {collections.map((item) => (
                       <div key={item.id} className="relative w-[280px] h-[350px] bg-white rounded-2xl p-3 shadow-md group/card snap-start">
                          <div className="relative w-full h-[75%] rounded-xl overflow-hidden mb-3 bg-gray-100">
                             <Image
                                src={item.image}
                                alt={item.name}
                                fill
                                className="object-cover group-hover/card:scale-110 transition-transform duration-500"
                             />
                              {/* <div className="absolute inset-0 flex items-center justify-center text-xs text-gray-400 font-mono opacity-0 group-hover/card:opacity-100 bg-white/80 transition-opacity z-10 pointer-events-none">
                                 {item.image}
                              </div> */}
                             <div className="absolute top-2 right-2 bg-white/80 p-1.5 rounded-full backdrop-blur-sm z-20">
                                <ShoppingBag className="w-4 h-4 text-gray-700" />
                             </div>
                          </div>
                          <div className="space-y-1">
                             <h3 className="font-serif font-bold text-gray-800 text-lg">{item.name}</h3>
                             <div className="flex items-center justify-between">
                                <p className="text-xs text-gray-500">{item.price}</p>
                                <button className="bg-[#C69C6D] text-white text-[10px] px-2 py-1 rounded-full flex items-center gap-1">
                                   Explore
                                </button>
                             </div>
                          </div>
                       </div>
                    ))}
                 </div>
              </div>
           </div>
        </div>

      </div>
    </section>
  );
}
