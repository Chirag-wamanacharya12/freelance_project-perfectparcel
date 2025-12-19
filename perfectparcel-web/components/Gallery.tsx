import Image from "next/image";

const images = [
  "/images/gallery-1.jpg",
  "/images/gallery-2.jpg",
  "/images/gallery-3.jpg",
  "/images/gallery-4.jpg",
  "/images/gallery-5 - copy.jpg",
];

export default function Gallery() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6">
         <div className="grid grid-cols-2 md:grid-cols-5 gap-4 h-[400px] md:h-[500px]">
            {images.map((src, idx) => (
              <div key={idx} className={`relative rounded-2xl overflow-hidden shadow-lg ${idx === 2 ? 'md:-mt-8 md:mb-8' : ''} hover:scale-[1.02] transition-transform duration-300 bg-gray-100 group`}>
                 <Image
                    src={src}
                    alt="Gallery image"
                    fill
                    className="object-cover"
                 />
                 {/* <div className="absolute inset-0 flex items-center justify-center text-xs text-gray-500 font-mono opacity-0 group-hover:opacity-100 bg-white/80 transition-opacity">
                    {src}
                 </div> */}
              </div>
            ))}
         </div>
      </div>
    </section>
  );
}
