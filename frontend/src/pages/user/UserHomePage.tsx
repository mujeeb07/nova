import React, { useState } from "react";
import {
  MapPin,
  Search,
  ChevronDown,
  Star,
  ChevronRight,
  Shirt,
  Sparkles,
  Wind,
  Footprints,
  Calendar,
  Truck,
  Globe,
  Share2,
  CheckCircle2,
  ShieldCheck,
} from "lucide-react";

export const UserHomePage: React.FC = () => {
  const [selectedLocation, setSelectedLocation] = useState("Ernakulam, Kerala");
  const [searchQuery, setSearchQuery] = useState("");

  const categories = [
    { id: "wash-fold", name: "Wash & Fold", icon: Shirt },
    { id: "dry-clean", name: "Dry Cleaning", icon: Sparkles },
    { id: "ironing", name: "Ironing", icon: Wind },
    { id: "shoe-care", name: "Shoe Care", icon: Footprints },
  ];

  const partners = [
    {
      id: "1",
      name: "Sparkle Cleaners",
      distance: "1.2 km away",
      rating: 4.8,
      tags: ["Wash & Fold", "Dry Clean"],
      price: "Starts at ₹49/kg",
      image:
        "https://images.unsplash.com/photo-1545173168-9f1947eebb7f?auto=format&fit=crop&w=600&q=80",
    },
    {
      id: "2",
      name: "Luxe Fabric Care",
      distance: "2.5 km away",
      rating: 4.9,
      isPremium: true,
      tags: ["Dry Clean", "Ironing"],
      price: "Starts at ₹99/item",
      image:
        "https://images.unsplash.com/photo-1517677208171-0bc6725a3e60?auto=format&fit=crop&w=600&q=80",
    },
    {
      id: "3",
      name: "Express Wash",
      distance: "0.8 km away",
      rating: 4.5,
      tags: ["Wash & Fold"],
      price: "Starts at ₹39/kg",
      image:
        "https://images.unsplash.com/photo-1521656693074-0ef32e80a5d5?auto=format&fit=crop&w=600&q=80",
    },
  ];

  const steps = [
    {
      step: "1. Find Services",
      desc: "Browse top-rated partners near you.",
      icon: Search,
    },
    {
      step: "2. Schedule Pickup",
      desc: "Choose a convenient time for us to collect.",
      icon: Calendar,
    },
    {
      step: "3. Expert Cleaning",
      desc: "Your clothes are cleaned with premium care.",
      icon: Sparkles,
    },
    {
      step: "4. Doorstep Delivery",
      desc: "Fresh laundry delivered right back to you.",
      icon: Truck,
    },
  ];

  return (
    <div className="min-h-screen bg-[#F4F7FC] text-[#181C23] font-['Plus_Jakarta_Sans',sans-serif] antialiased">
      {/* 1. Header Navigation */}
      <header className="sticky top-0 z-50 bg-white border-b border-[#E6F2FF] px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <span className="text-2xl font-extrabold text-[#007BFF] tracking-tight">
            nova
          </span>
          <div className="hidden sm:flex items-center gap-1.5 text-xs text-[#414754] bg-[#F4F7FC] px-3 py-1.5 rounded-full border border-[#E6F2FF]">
            <MapPin className="w-3.5 h-3.5 text-[#007BFF]" />
            <span className="font-semibold">{selectedLocation}</span>
            <ChevronDown className="w-3 h-3 text-[#414754]" />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <a
            href="#home"
            className="text-xs font-semibold text-[#007BFF] underline underline-offset-4"
          >
            Home
          </a>
          <div className="flex items-center gap-2 cursor-pointer">
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80"
              alt="User Avatar"
              className="w-7 h-7 rounded-full object-cover border border-[#E6F2FF]"
            />
            <ChevronDown className="w-3 h-3 text-[#414754]" />
          </div>
        </div>
      </header>

      {/* 2. Hero Section */}
      <section className="relative min-h-[520px] bg-white overflow-hidden flex items-center">
        {/* Hero Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url('/public/user/nova_user_hero.png')",
          }}
        />
        {/* Gradient Overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#F9F9FF]/95 via-[#F9F9FF]/75 to-transparent" />

        {/* Floating UI Badges on Hero */}
        <div className="hidden lg:flex absolute top-16 right-24 bg-white/90 backdrop-blur-md border border-white/40 shadow-sm rounded-full px-4 py-2 items-center gap-2 z-10">
          <span className="w-2 h-2 rounded-full bg-[#00B66E]" />
          <span className="text-xs font-semibold text-[#181C23]">
            In Progress – Wash Cycle
          </span>
        </div>

        <div className="hidden lg:flex absolute bottom-12 right-20 bg-white/90 backdrop-blur-md border border-white/40 shadow-lg rounded-xl p-3.5 items-center gap-3 z-10 max-w-xs">
          <div className="w-10 h-10 rounded-full bg-[#E6F2FF] flex items-center justify-center">
            <ShieldCheck className="w-5 h-5 text-[#00B66E]" />
          </div>
          <div>
            <div className="flex items-center gap-1 text-xs font-bold text-[#181C23]">
              <span className="w-2 h-2 rounded-full bg-[#00B66E]" />
              Premium Care
            </div>
            <p className="text-[11px] font-semibold text-[#414754]">
              Guaranteed 24h turnaround
            </p>
          </div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-8 py-12 w-full">
          <div className="max-w-xl space-y-6">
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-[#181C23] leading-[1.15]">
              Fresh laundry, delivered to your door.
            </h1>
            <p className="text-base text-[#414754] font-medium leading-relaxed">
              Find trusted laundry services near you and schedule your pickup in
              just a few clicks.
            </p>

            {/* Search Bar Container */}
            <div className="bg-white/90 backdrop-blur-md border border-white/40 shadow-lg rounded-xl p-3.5 flex flex-col sm:flex-row items-center gap-3">
              {/* Location selector */}
              <div className="w-full sm:w-auto flex items-center gap-2 px-3 py-2 bg-white border border-[#C1C6D7] rounded-lg">
                <MapPin className="w-4 h-4 text-[#007BFF]" />
                <span className="text-xs font-semibold text-[#181C23] whitespace-nowrap">
                  {selectedLocation}
                </span>
                <ChevronDown className="w-3 h-3 text-[#6B7280]" />
              </div>

              {/* Search Input */}
              <div className="w-full flex-1 flex items-center gap-2 px-3 py-2 bg-white border border-[#C1C6D7] rounded-lg">
                <Search className="w-4 h-4 text-[#414754]" />
                <input
                  type="text"
                  placeholder="Search laundry services"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full text-xs text-[#181C23] focus:outline-none placeholder:text-[#414754]"
                />
              </div>

              {/* Action Button */}
              <button className="w-full sm:w-auto bg-[#007BFF] hover:bg-blue-600 text-white font-semibold text-xs px-6 py-3 rounded-lg shadow transition-colors whitespace-nowrap">
                Find Services
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 3. What are you looking for? (Categories) */}
      <section className="max-w-7xl mx-auto px-8 py-10">
        <h2 className="text-2xl font-bold text-[#181C23] mb-6 tracking-tight">
          What are you looking for?
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <div
                key={cat.id}
                className="bg-white border border-[#E6F2FF] hover:border-[#007BFF] rounded-xl p-4 flex flex-col items-center justify-center gap-3 shadow-xs hover:shadow-md transition-all cursor-pointer group"
              >
                <div className="w-14 h-14 rounded-full bg-[#E6F2FF] flex items-center justify-center group-hover:scale-105 transition-transform">
                  <Icon className="w-6 h-6 text-[#007BFF]" />
                </div>
                <span className="text-xs font-semibold text-[#181C23]">
                  {cat.name}
                </span>
              </div>
            );
          })}
        </div>
      </section>

      <hr className="border-[#E6F2FF] max-w-7xl mx-auto" />

      {/* 4. Nearby Laundry Partners */}
      <section className="max-w-7xl mx-auto px-8 py-10">
        <div className="flex items-end justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-[#181C23] tracking-tight">
              Nearby Laundry Partners
            </h2>
            <p className="text-xs text-[#414754] mt-1">
              Top-rated services in {selectedLocation}
            </p>
          </div>
          <button className="flex items-center text-xs font-semibold text-[#007BFF] hover:underline gap-0.5">
            View all
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {partners.map((partner) => (
            <div
              key={partner.id}
              className="bg-white border border-[#E6F2FF] rounded-xl overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col"
            >
              {/* Card Image Header */}
              <div className="relative h-40 bg-slate-100">
                <img
                  src={partner.image}
                  alt={partner.name}
                  className="w-full h-full object-cover"
                />

                {partner.isPremium && (
                  <div className="absolute top-3 left-3 bg-[#FF8A00] text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-xs">
                    <Sparkles className="w-2.5 h-2.5" /> Premium
                  </div>
                )}

                <div className="absolute top-3 right-3 bg-white text-[#181C23] text-[11px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-xs">
                  <Star className="w-3 h-3 text-[#FF8A00] fill-[#FF8A00]" />
                  {partner.rating}
                </div>
              </div>

              {/* Card Body */}
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-bold text-[#181C23]">
                    {partner.name}
                  </h3>
                  <div className="flex items-center gap-1 text-xs text-[#414754] mt-1">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>{partner.distance}</span>
                  </div>

                  {/* Tags */}
                  <div className="flex gap-2 my-3 pb-3 border-b border-[#E6F2FF]">
                    {partner.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="bg-[#F4F7FC] text-[#414754] text-[10px] font-bold px-2 py-1 rounded"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Footer / Price + Action */}
                <div className="flex items-center justify-between pt-1">
                  <span className="text-xs font-semibold text-[#181C23]">
                    {partner.price}
                  </span>
                  <button className="bg-[#E6F2FF] hover:bg-[#007BFF] text-[#007BFF] hover:text-white text-xs font-bold px-4 py-1.5 rounded-lg transition-colors">
                    Book
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. How Nova Works */}
      <section className="bg-white border-t border-[#E6F2FF] py-14 px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-[#181C23] tracking-tight mb-10">
            How Nova Works
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
            {steps.map((step, idx) => {
              const Icon = step.icon;
              return (
                <div
                  key={idx}
                  className="flex flex-col items-center text-center"
                >
                  <div className="w-12 h-12 rounded-full border-2 border-[#007BFF] text-[#007BFF] flex items-center justify-center mb-4">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h4 className="text-xs font-bold text-[#181C23] mb-1">
                    {step.step}
                  </h4>
                  <p className="text-xs text-[#414754] max-w-[180px]">
                    {step.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 6. Footer */}
      <footer className="bg-white border-t border-[#E6F2FF] pt-10 pb-6 px-8 text-xs text-[#414754]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 pb-8 border-b border-[#E6F2FF]">
          {/* Brand Info */}
          <div className="space-y-3">
            <span className="text-2xl font-extrabold text-[#007BFF] tracking-tight block">
              nova
            </span>
            <p className="text-[11px] leading-relaxed max-w-xs text-[#414754]">
              Premium laundry marketplace ensuring kinetic clarity and
              professional service.
            </p>
            <div className="flex items-center gap-3 pt-2 text-[#414754]">
              <Globe className="w-4 h-4 hover:text-[#007BFF] cursor-pointer" />
              <Share2 className="w-4 h-4 hover:text-[#007BFF] cursor-pointer" />
            </div>
          </div>

          {/* Company Links */}
          <div>
            <h5 className="font-bold uppercase tracking-wider text-[11px] text-[#181C23] mb-3">
              Company
            </h5>
            <ul className="space-y-2">
              <li>
                <a href="#about" className="hover:underline">
                  About Us
                </a>
              </li>
              <li>
                <a href="#careers" className="hover:underline">
                  Careers
                </a>
              </li>
              <li>
                <a href="#partners" className="hover:underline">
                  Partners
                </a>
              </li>
            </ul>
          </div>

          {/* Services Links */}
          <div>
            <h5 className="font-bold uppercase tracking-wider text-[11px] text-[#181C23] mb-3">
              Services
            </h5>
            <ul className="space-y-2">
              <li>
                <a href="#wash" className="hover:underline">
                  Wash & Fold
                </a>
              </li>
              <li>
                <a href="#dry" className="hover:underline">
                  Dry Cleaning
                </a>
              </li>
              <li>
                <a href="#ironing" className="hover:underline">
                  Ironing
                </a>
              </li>
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h5 className="font-bold uppercase tracking-wider text-[11px] text-[#181C23] mb-3">
              Support
            </h5>
            <ul className="space-y-2">
              <li>
                <a href="#help" className="hover:underline">
                  Help Center
                </a>
              </li>
              <li>
                <a href="#terms" className="hover:underline">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#privacy" className="hover:underline">
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright row */}
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between pt-6 text-[11px] text-[#414754]">
          <p>© 2024 Nova Laundry Marketplace. All rights reserved.</p>
          <div className="flex items-center gap-4 mt-2 sm:mt-0">
            <span>English (US)</span>
            <span>INR (₹)</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
