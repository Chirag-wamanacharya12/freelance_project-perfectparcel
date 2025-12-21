import { ArrowRight } from "lucide-react";
import Navbar from "./Navbar";
import Image from "next/image";

export default function Hero() {
  return (
    <section className="relative p-0 min-h-[100vh] w-full bg-[#BF2B32] overflow-hidden">
      {/* Background Image Placeholder */}
      <div className="absolute inset-0 w-full h-full bg-[#BF2B32]">
         {/* Placeholder for user image */}
         <Image 
            src="/images/hero-bg.png"
            alt="Hero Background - Upload image as public/images/hero-bg.png"
            fill
            className="object-contain object-right"
            priority
         />
      </div>

      <Navbar />

      <div className="relative z-10 max-w-7xl mx-auto px-6 h-full flex flex-col justify-center min-h-[90vh] pt-20">
        <div className="flex flex-col md:flex-row items-center justify-between">
          
          {/* Left Content */}
          <div className="max-w-xl text-white space-y-6">
            <h1 className="font-serif text-6xl md:text-8xl font-medium leading-tight">
              Elegance <br />
              <span className="text-white/90">That Tells a Story</span>
            </h1>
            <p className="text-lg md:text-xl text-white/90 font-light tracking-wide">
              #perfectparcel one stop accessories store
            </p>
            
            <button className="group flex items-center gap-3 bg-white text-[#D14D59] px-8 py-3 rounded-full font-medium hover:bg-gray-50 transition-all shadow-lg mt-8">
              Lets explore
              <span className="bg-[#D14D59] text-white rounded-full p-1 group-hover:bg-[#b93c47] transition-colors">
                <ArrowRight className="w-4 h-4" />
              </span>
            </button>
          </div>

          {/* Right Content - Floating Card */}
          <div className="absolute bottom-3 right-0 hidden md:block z-20">
             <div className="bg-white p-4 rounded-2xl shadow-2xl flex items-center gap-4 w-[500px] animate-fade-in-up">
                <div className="relative w-25 h-25 rounded-xl overflow-hidden bg-gray-200 shrink-0 border border-gray-100">
                  <Image 
                    src="/images/hero-card.jpg"
                    alt="Product - Upload as public/images/hero-card.jpg"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 flex items-center justify-center text-xs text-gray-400 font-mono opacity-0 hover:opacity-100 bg-white/80 transition-opacity">
                  <Image 
                    src="/images/hero-card.jpg"
                    alt="Product - Upload as public/images/hero-card.jpg"
                    fill
                    className="object-cover scale-110"
                  />
                  </div>
                </div>
                <div className="flex flex-col gap-3">
                   <h3 className="font-serif text-2xl font-bold text-gray-800 leading-tight">
                     Krishna special silver set
                   </h3>
                   <button className="text-sm pointer flex items-center gap-2 border border-gray-300 rounded-full px-4 py-2 text-gray-600 hover:bg-gray-50 transition-colors w-fit">
                     Read more
                     <ArrowRight className="w-4 h-4" />
                   </button>
                </div>
             </div>
          </div>

        </div>
      </div>
      
      {/* Decorative gradient at bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#D14D59] to-transparent"></div>
    </section>
  );
}
