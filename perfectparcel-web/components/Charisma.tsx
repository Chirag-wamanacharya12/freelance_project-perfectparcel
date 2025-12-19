import Image from "next/image";

export default function Charisma() {
  return (
    <section className="py-20 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-12">
          
          {/* Left Image */}
          <div className="w-full md:w-1/3 relative h-[400px] rounded-3xl overflow-hidden shadow-xl bg-gray-100 group">
             <Image
               src="/images/charisma-1.jpg"
               alt="Hand with rings - Upload as public/images/charisma-1.jpg"
               fill
               className="object-cover transition-transform duration-500"
             />
             <div className="absolute inset-0 flex items-center justify-center text-sm text-gray-500 font-mono opacity-0 group-hover:opacity-100 bg-white/80 transition-opacity">
             <Image
               src="/images/charisma-1.jpg"
               alt="Hand with rings - Upload as public/images/charisma-1.jpg"
               fill
               className="object-cover scale-140 rotate-12 transition-transform duration-500"
             />
             </div>
          </div>

          {/* Center Text */}
          <div className="w-full md:w-1/2 text-center space-y-6">
            <h2 className="font-serif text-[5rem] md:text-6xl text-[#C69C6D] leading-tight">
              Elevate your <br />
              Charisma
            </h2>
            <p className="font-serif text-xl text-[#8B6E4E] italic">
              Unleash your inner shine with every gesture
            </p>
          </div>

          {/* Right Image */}
          <div className="w-full md:w-1/3 relative h-[400px] rounded-3xl overflow-hidden shadow-xl bg-gray-100 group">
             <Image
               src="/images/charisma-2.jpg"
               alt="Hand with jewelry - Upload as public/images/charisma-2.jpg"
               fill
               className="object-cover transition-transform duration-500"
             />
             <div className="absolute inset-0 flex items-center justify-center text-sm text-gray-500 font-mono opacity-0 group-hover:opacity-100 bg-white/80 transition-opacity">
             <Image
               src="/images/charisma-2.jpg"
               alt="Hand with jewelry - Upload as public/images/charisma-2.jpg"
               fill
               className="object-cover scale-140 rotate-12 transition-transform duration-500"
             />
             </div>
          </div>

        </div>
      </div>
    </section>
  );
}
