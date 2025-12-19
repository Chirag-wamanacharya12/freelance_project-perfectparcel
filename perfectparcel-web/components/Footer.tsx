export default function Footer() {
  return (
    <footer className="bg-[#4A1D1F] text-white py-16 relative overflow-hidden">
      {/* Pattern Overlay - simplified */}
      <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-12">
        
        {/* Left: About Owner */}
        <div className="text-left">
           <h2 className="font-serif text-2xl mb-2">About Owner.</h2>
        </div>

        {/* Center: Newsletter */}
        <div className="flex-1 w-full max-w-xl">
           <div className="bg-white p-1.5 rounded-lg flex items-center">
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="flex-1 bg-transparent px-4 py-2 text-gray-800 outline-none placeholder:text-gray-400"
              />
              <button className="bg-[#C63D4D] text-white px-8 py-2 rounded-md font-medium hover:bg-[#a52b39] transition-colors">
                Subscribe
              </button>
           </div>
        </div>

        {/* Right: Contact */}
        <div className="text-right">
           <h2 className="font-serif text-xl mb-1">Contact.</h2>
           <p className="text-gray-300 text-sm">abc@gmail.com</p>
           <p className="text-gray-300 text-sm">91-234xxxxxxx</p>
        </div>

      </div>
    </footer>
  );
}
