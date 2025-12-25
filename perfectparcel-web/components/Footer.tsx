"use client";

import { useState } from "react";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !message) return;
    setStatus("loading");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, message }),
      });

      if (res.ok) {
        setStatus("success");
        setEmail("");
        setMessage("");
        setTimeout(() => setStatus("idle"), 3000);
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  return (
    <footer id="footer" className="bg-[#4A1D1F] text-white py-16 relative overflow-hidden">
      {/* Pattern Overlay - simplified */}
      <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-start justify-between gap-12">
        
        {/* Left: About Owner */}
        <div className="text-left md:w-1/4">
           <h2 className="font-serif text-2xl mb-4">About Owner.</h2>
           <p className="text-gray-300 text-sm leading-relaxed">
             We are dedicated to providing the best products with exceptional quality and care. Our mission is to make every parcel perfect for you.
           </p>
        </div>

        {/* Center: Contact Form */}
        <div className="flex-1 w-full max-w-lg mx-auto">
           <form onSubmit={handleSubmit} className="bg-white/5 backdrop-blur-sm p-6 rounded-2xl border border-white/10 space-y-4 shadow-xl">
             <h3 className="font-serif text-xl font-bold mb-2">Send us a Query</h3>
             <div>
               <input 
                  type="email" 
                  placeholder="Your Email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full bg-white/10 px-4 py-3 rounded-xl text-white outline-none border border-white/10 focus:border-[#C63D4D] focus:bg-white/20 transition-all placeholder:text-gray-400 text-sm"
                  required
               />
             </div>
             <div>
               <textarea 
                  placeholder="Your Message"
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  className="w-full bg-white/10 px-4 py-3 rounded-xl text-white outline-none border border-white/10 focus:border-[#C63D4D] focus:bg-white/20 transition-all placeholder:text-gray-400 text-sm resize-none h-24"
                  required
               />
             </div>
             <button 
               disabled={status === "loading" || status === "success"}
               className="w-full bg-[#C63D4D] text-white py-3 rounded-xl font-bold hover:bg-[#a52b39] transition-all disabled:opacity-70 disabled:cursor-not-allowed shadow-lg hover:shadow-red-900/20 active:scale-[0.98]"
             >
               {status === "loading" ? "Sending..." : status === "success" ? "Message Sent!" : "Send Message"}
             </button>
             {status === "error" && (
               <p className="text-red-300 text-xs text-center bg-red-900/20 py-2 rounded-lg">
                 Failed to send message. Please try again.
               </p>
             )}
           </form>
        </div>

        {/* Right: Contact */}
        <div className="text-right md:w-1/4">
           <h2 className="font-serif text-xl mb-4">Contact.</h2>
           <div className="space-y-2">
             <p className="text-gray-300 text-sm">perfect.parcel001@gmail.com</p>
             <p className="text-gray-300 text-sm">91-234xxxxxxx</p>
             <div className="mt-4 flex justify-end gap-4">
               {/* Social placeholders */}
               <div className="w-8 h-8 rounded-full bg-white/10 hover:bg-[#C63D4D] transition-colors cursor-pointer flex items-center justify-center text-xs">FB</div>
               <div className="w-8 h-8 rounded-full bg-white/10 hover:bg-[#C63D4D] transition-colors cursor-pointer flex items-center justify-center text-xs">IG</div>
             </div>
           </div>
        </div>

      </div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-6 mt-16 pt-8 border-t border-white/10 text-center text-gray-400 text-xs">
        © {new Date().getFullYear()} Perfect Parcel. All rights reserved.
      </div>
    </footer>
  );
}
