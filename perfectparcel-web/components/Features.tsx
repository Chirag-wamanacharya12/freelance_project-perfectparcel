import { Clock, Package, CheckCircle, Award } from "lucide-react";

const features = [
  {
    icon: Clock,
    title: "Fast delivery",
    bg: "bg-yellow-100",
    color: "text-yellow-700"
  },
  {
    icon: Package,
    title: "Safe Packing",
    bg: "bg-yellow-100",
    color: "text-yellow-700"
  },
  {
    icon: CheckCircle,
    title: "Best Quality",
    bg: "bg-yellow-100",
    color: "text-yellow-700"
  },
  {
    icon: Award,
    title: "Exclusive Designs",
    bg: "bg-yellow-100",
    color: "text-yellow-700"
  }
];

export default function Features() {
  return (
    <section id="features" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-center font-serif text-4xl font-bold text-gray-800 mb-16">
          Our Charms
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div key={index} className={`flex flex-col items-center justify-center p-8 rounded-2xl ${feature.bg} hover:scale-105 transition-transform cursor-pointer`}>
              <feature.icon className={`w-12 h-12 ${feature.color} mb-4 stroke-1`} />
              <h3 className={`font-medium ${feature.color}`}>{feature.title}</h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
