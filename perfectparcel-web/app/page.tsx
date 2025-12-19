import Hero from "@/components/Hero";
import Features from "@/components/Features";
import Charisma from "@/components/Charisma";
import Collections from "@/components/Collections";
import Gallery from "@/components/Gallery";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Hero />
      <Features />
      <Charisma />
      <Collections />
      <Gallery />
      <Footer />
    </main>
  );
}
