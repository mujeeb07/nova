import React, { useState } from 'react';
import { Users, Calendar, Truck, Quote, Bell, ChevronDown } from 'lucide-react';
import { BrandLogo } from '../../features/auth/components/BrandLogo';
import { VENDOR_HERO, LANDING_IMG1, LANDING_IMG2, LANDING_IMG3 } from './vendorBanner';
import { useAuthStore } from '../../store/authStore';

export const VendorsLandingPage: React.FC = () => {
  const vendor = useAuthStore((s) => s.session?.name) ?? "there";
  console.log("vendor data from the store:", vendor)
  const [formData, setFormData] = useState({
    fullName: '',
    shopName: '',
    email: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Thank you, ${formData.fullName}! Your application for ${formData.shopName} has been submitted.`);
  };

  return (
    <div className="min-h-screen bg-[#F6FAF8] text-[#181D1B] font-['Plus_Jakarta_Sans',sans-serif] antialiased overflow-x-hidden">
      {/* 1. Header Navigation */}
      <header className="sticky top-0 z-50 bg-white border-b border-[#BDC9C5] px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BrandLogo className='mb-2' name="nova vendor" color='#00685D'/>
        </div>
        <nav className="hidden md:flex items-center gap-8 text-xs font-semibold text-[#3E4946]">
          <a href="#how-it-works" className="hover:text-[#00685D] transition-colors">How It Works</a>
          <a href="#benefits" className="hover:text-[#00685D] transition-colors">Benefits</a>
          <a href="#features" className="hover:text-[#00685D] transition-colors">Features</a>
          <a href="#case-studies" className="hover:text-[#00685D] transition-colors">Case Studies</a>
        </nav>
        <div className="flex items-center gap-5">
          <Bell className="w-4 h-4 text-slate-500 mr-0" />
          <div className="flex items-center gap-2 cursor-pointer">
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80"
              alt="User Avatar"
              className="w-7 h-7 rounded-full object-cover border border-[#E6F2FF]"
            />
          </div>
        </div>
      </header>

      {/* 2. Hero Section */}
      <section className="relative min-h-[600px] flex items-center bg-white overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${VENDOR_HERO})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#F6FAF8] via-[#F6FAF8]/70 to-transparent" />

        <div className="relative z-10 max-w-7xl mx-auto px-8 py-16 w-full">
          <div className="max-w-2xl space-y-6">
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#181D1B] leading-tight">
              Get More Business and Simplify Your Shop. Partner with Nova Local.
            </h1>
            <p className="text-sm sm:text-base text-[#3E4946] leading-relaxed max-w-lg">
              Reach local customers, busy professionals, and families. Let Nova handle orders and delivery while you focus on service.[cite: 9]
            </p>
            <div className="pt-2">
              <button className="bg-[#00685D] hover:bg-[#00554c] text-white font-semibold text-xs px-8 py-3 rounded-lg shadow-xs transition-colors">
                Get Started
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Value Props Section */}
      <section className="bg-white py-24 px-8">
        <div className="max-w-7xl mx-auto space-y-16">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#181D1B] text-center tracking-tight">
            The Nova Advantage for Laundry Vendors
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1 */}
            <div className="bg-white border border-[#BDC9C5] shadow-[0px_4px_20px_rgba(0,0,0,0.03)] rounded-xl p-6 pb-11 space-y-3 flex flex-col justify-between">
              <div className="w-12 h-12 bg-[#F0F4F2] rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-[#00685D]" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-[#181D1B] mb-2">Reach Local Neighbors</h3>
                <p className="text-xs text-[#3E4946] leading-relaxed">
                  Connect directly with busy residents who need reliable laundry service.[cite: 9]
                </p>
              </div>
            </div>

            {/* Card 2 */}
            <div className="bg-white border border-[#BDC9C5] shadow-[0px_4px_20px_rgba(0,0,0,0.03)] rounded-xl p-6 pb-11 space-y-3 flex flex-col justify-between">
              <div className="w-12 h-12 bg-[#F0F4F2] rounded-lg flex items-center justify-center">
                <Calendar className="w-6 h-6 text-[#00685D]" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-[#181D1B] mb-2">Organized Order Scheduling</h3>
                <p className="text-xs text-[#3E4946] leading-relaxed">
                  No more messy papers or phone confusion. Get organized scheduled pickups through the platform.[cite: 9]
                </p>
              </div>
            </div>

            {/* Card 3 */}
            <div className="bg-white border border-[#BDC9C5] shadow-[0px_4px_20px_rgba(0,0,0,0.03)] rounded-xl p-6 pb-11 space-y-3 flex flex-col justify-between">
              <div className="w-12 h-12 bg-[#F0F4F2] rounded-lg flex items-center justify-center">
                <Truck className="w-6 h-6 text-[#00685D]" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-[#181D1B] mb-2">Reliable Delivery Partnerships</h3>
                <p className="text-xs text-[#3E4946] leading-relaxed">
                  Focus on quality service. Let our professional delivery partners manage customer collections and drops.[cite: 9]
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Collaboration Section (Seamless Collaboration) */}
      <section className="bg-[#F6FAF8] py-24 px-8">
        <div className="max-w-7xl mx-auto space-y-16 text-center">
          <div className="max-w-3xl mx-auto space-y-4">
            <h2 className="text-2xl sm:text-3xl font-bold text-[#181D1B] tracking-tight">
              Seamless Collaboration, Maximum Growth
            </h2>
            <p className="text-sm text-[#3E4946]">
              Achieve Operational Excellence through Integrated Automation and Real-Time Tracking.[cite: 9]
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            {/* Block 1 */}
            <div className="bg-white border border-[#BDC9C5]/40 rounded-xl overflow-hidden shadow-xs">
              <img 
                src={`${LANDING_IMG1}`}
                alt="Easy Pickup" 
                className="w-full h-48 object-cover"
              />
              <div className="p-5 space-y-2">
                <h3 className="text-base font-semibold text-[#181D1B]">Easy Pickup</h3>
                <p className="text-xs text-[#3E4946]">Collections and delivery handled by professional partners.</p>
              </div>
            </div>

            {/* Block 2 */}
            <div className="bg-white border border-[#BDC9C5]/40 rounded-xl overflow-hidden shadow-xs">
              <img 
                src={`${LANDING_IMG2}`}
                alt="Service Your Way" 
                className="w-full h-48 object-cover"
              />
              <div className="p-5 space-y-2">
                <h3 className="text-base font-semibold text-[#181D1B]">Service Your Way</h3>
                <p className="text-xs text-[#3E4946]">Focus on providing quality in-shop laundry service.</p>
              </div>
            </div>

            {/* Block 3 */}
            <div className="bg-white border border-[#BDC9C5]/40 rounded-xl overflow-hidden shadow-xs">
              <img 
                src={`${LANDING_IMG3}`}
                alt="Tidy Packaging" 
                className="w-full h-48 object-cover"
              />
              <div className="p-5 space-y-2">
                <h3 className="text-base font-semibold text-[#181D1B]">Tidy Packaging</h3>
                <p className="text-xs text-[#3E4946]">Ensure orders are prepared for efficient delivery.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Testimonial Section */}
      <section className="bg-white border-y border-[#BDC9C5] py-24 px-8">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <Quote className="w-10 h-10 text-[#00685D] opacity-50 mx-auto" />
          <blockquote className="text-lg sm:text-xl font-semibold italic text-[#181D1B] leading-relaxed">
            "Before Nova, we relied only on our immediate street traffic. Now, our order volume has doubled, connecting us to hundreds of students and busy professionals in the neighborhood. The scheduling is clear, and the deliveries are seamless."[cite: 9]
          </blockquote>
          <div className="flex items-center justify-center gap-4 pt-2">
            <img 
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80" 
              alt="Sarah Jenkins"
              className="w-12 h-12 rounded-full border-2 border-[#E5E9E7] object-cover"
            />
            <div className="text-left">
              <h4 className="text-xs font-semibold text-[#181D1B]">Sarah Jenkins</h4>
              <p className="text-[11px] text-[#3E4946]">Owner, Sparkle Cleaners</p>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Footer */}
      <footer className="bg-white border-t border-[#BDC9C5] px-8 py-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
        <BrandLogo className='mb-2' name="nova vendor" color='#00685D'/>
        <div className="flex items-center gap-6 font-bold text-[11px] text-[#3E4946]">
          <a href="#about" className="hover:underline opacity-80">About Us</a>
          <a href="#terms" className="hover:underline opacity-80">Terms of Service</a>
          <a href="#privacy" className="hover:underline opacity-80">Privacy Policy</a>
          <a href="#contact" className="hover:underline opacity-80">Contact Support</a>
        </div>
        <p className="text-[11px] text-[#3E4946]">© 2024 Nova Marketplace. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default VendorsLandingPage;