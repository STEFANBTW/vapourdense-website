import React, { useState, useRef, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, Check, X, Search } from 'lucide-react';

export interface SelectOption {
  value: string;
  label: string;
  icon?: React.ReactNode;
}

interface CustomSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: (string | SelectOption)[];
  placeholder?: string;
  className?: string;
  buttonClassName?: string;
  menuClassName?: string;
  icon?: React.ReactNode;
}

// Comprehensive contextual concept dictionary for smart semantic search
const CONTEXTUAL_KEYWORD_MAP: Record<string, string[]> = {
  // Food, Dining, Culinary, Agriculture
  food: [
    'Agro-Processing & Packaging',
    'Bakeries & Pastries',
    'Cafes & Juice Bars',
    'Catering & Cloud Kitchens',
    'Crop Farming',
    'Fish Farming',
    'Livestock & Poultry',
    'Consumer Packaged Goods',
    'General Merchandise',
  ],
  eat: ['Agro-Processing & Packaging', 'Bakeries & Pastries', 'Cafes & Juice Bars', 'Catering & Cloud Kitchens'],
  cook: ['Catering & Cloud Kitchens', 'Bakeries & Pastries', 'Cafes & Juice Bars'],
  chef: ['Catering & Cloud Kitchens', 'Bakeries & Pastries', 'Cafes & Juice Bars'],
  kitchen: ['Catering & Cloud Kitchens', 'Home & Furniture'],
  snack: ['Bakeries & Pastries', 'Agro-Processing & Packaging', 'Consumer Packaged Goods'],
  bread: ['Bakeries & Pastries', 'Agro-Processing & Packaging'],
  pastry: ['Bakeries & Pastries'],
  cake: ['Bakeries & Pastries', 'Catering & Cloud Kitchens'],
  drink: ['Cafes & Juice Bars', 'Bars & Nightclubs', 'Agro-Processing & Packaging'],
  drinks: ['Cafes & Juice Bars', 'Bars & Nightclubs', 'Agro-Processing & Packaging'],
  beverage: ['Cafes & Juice Bars', 'Bars & Nightclubs', 'Agro-Processing & Packaging'],
  coffee: ['Cafes & Juice Bars'],
  juice: ['Cafes & Juice Bars'],
  bar: ['Bars & Nightclubs', 'Cafes & Juice Bars'],
  alcohol: ['Bars & Nightclubs'],
  restaurant: ['Catering & Cloud Kitchens', 'Cafes & Juice Bars', 'Bars & Nightclubs'],
  dining: ['Catering & Cloud Kitchens', 'Cafes & Juice Bars', 'Bars & Nightclubs'],
  catering: ['Catering & Cloud Kitchens'],
  agriculture: ['Agro-Processing & Packaging', 'Crop Farming', 'Fish Farming', 'Livestock & Poultry', 'Farm Machinery & Inputs', 'Forestry & Timber'],
  agro: ['Agro-Processing & Packaging', 'Farm Machinery & Inputs', 'Crop Farming'],
  farm: ['Crop Farming', 'Fish Farming', 'Livestock & Poultry', 'Farm Machinery & Inputs', 'Agro-Processing & Packaging', 'Forestry & Timber'],
  farming: ['Crop Farming', 'Fish Farming', 'Livestock & Poultry', 'Farm Machinery & Inputs', 'Agro-Processing & Packaging'],
  crop: ['Crop Farming', 'Agro-Processing & Packaging'],
  poultry: ['Livestock & Poultry'],
  meat: ['Livestock & Poultry', 'Agro-Processing & Packaging', 'Fish Farming'],
  chicken: ['Livestock & Poultry'],
  fish: ['Fish Farming', 'Agro-Processing & Packaging'],
  animal: ['Livestock & Poultry'],

  // Fashion, Garments, Apparel, Beauty
  cloth: ['Fashion & Apparel', 'Garments & Textiles', 'Jewelry & Luxury Goods', 'Beauty & Cosmetics'],
  clothes: ['Fashion & Apparel', 'Garments & Textiles'],
  clothing: ['Fashion & Apparel', 'Garments & Textiles'],
  dress: ['Fashion & Apparel', 'Garments & Textiles'],
  wear: ['Fashion & Apparel', 'Garments & Textiles'],
  textile: ['Garments & Textiles', 'Fashion & Apparel'],
  fashion: ['Fashion & Apparel', 'Garments & Textiles', 'Jewelry & Luxury Goods', 'Beauty & Cosmetics'],
  model: ['Fashion & Apparel', 'Content Creators & Influencers'],
  beauty: ['Beauty & Cosmetics', 'Hair Salons & Barbershops'],
  cosmetics: ['Beauty & Cosmetics'],
  makeup: ['Beauty & Cosmetics'],
  skincare: ['Beauty & Cosmetics'],
  hair: ['Hair Salons & Barbershops', 'Beauty & Cosmetics'],
  salon: ['Hair Salons & Barbershops', 'Beauty & Cosmetics'],
  barber: ['Hair Salons & Barbershops'],
  jewelry: ['Jewelry & Luxury Goods', 'Fashion & Apparel'],
  luxury: ['Jewelry & Luxury Goods', 'Fashion & Apparel'],

  // Automotive, Motors, Transport & Logistics
  car: ['Auto Dealerships', 'Auto Body & Detailing', 'Auto Repair Workshops', 'Auto Spare Parts', 'Haulage & Freight', 'Last-Mile Delivery'],
  cars: ['Auto Dealerships', 'Auto Body & Detailing', 'Auto Repair Workshops', 'Auto Spare Parts'],
  auto: ['Auto Dealerships', 'Auto Body & Detailing', 'Auto Repair Workshops', 'Auto Spare Parts'],
  automobile: ['Auto Dealerships', 'Auto Body & Detailing', 'Auto Repair Workshops', 'Auto Spare Parts'],
  mechanic: ['Auto Repair Workshops', 'Auto Body & Detailing', 'Auto Spare Parts'],
  vehicle: ['Auto Dealerships', 'Auto Repair Workshops', 'Auto Spare Parts', 'Haulage & Freight'],
  drive: ['Auto Dealerships', 'Haulage & Freight', 'Last-Mile Delivery'],
  delivery: ['Last-Mile Delivery', 'Haulage & Freight', 'Marine & Rail Transport'],
  courier: ['Last-Mile Delivery', 'Haulage & Freight'],
  logistics: ['Last-Mile Delivery', 'Haulage & Freight', 'Marine & Rail Transport'],
  ship: ['Marine & Rail Transport', 'Haulage & Freight'],
  boat: ['Marine & Rail Transport'],
  truck: ['Haulage & Freight', 'Last-Mile Delivery'],
  transport: ['Haulage & Freight', 'Last-Mile Delivery', 'Marine & Rail Transport'],

  // Technology, Software, Computing & Media
  tech: ['IT & Cybersecurity', 'Data & AI Services', 'EdTech Platforms', 'Fintech & Payments', 'Crypto & Web3', 'Hardware & Telecom'],
  technology: ['IT & Cybersecurity', 'Data & AI Services', 'EdTech Platforms', 'Fintech & Payments', 'Hardware & Telecom'],
  code: ['IT & Cybersecurity', 'Data & AI Services', 'EdTech Platforms'],
  software: ['IT & Cybersecurity', 'Data & AI Services', 'EdTech Platforms', 'Fintech & Payments'],
  computer: ['IT & Cybersecurity', 'Hardware & Telecom', 'Electronics & Gadgets'],
  cyber: ['IT & Cybersecurity'],
  ai: ['Data & AI Services', 'IT & Cybersecurity'],
  data: ['Data & AI Services', 'IT & Cybersecurity'],
  app: ['IT & Cybersecurity', 'EdTech Platforms', 'Fintech & Payments'],
  web: ['IT & Cybersecurity', 'Graphic Design Studios', 'Digital Marketing & SEO'],
  website: ['Graphic Design Studios', 'IT & Cybersecurity', 'Digital Marketing & SEO'],
  design: ['Graphic Design Studios', 'Architecture & Interior Design', 'Content Creators & Influencers'],
  graphics: ['Graphic Design Studios', 'Content Creators & Influencers'],
  art: ['Graphic Design Studios', 'Content Creators & Influencers', 'Film & Broadcasting'],
  film: ['Film & Broadcasting', 'Content Creators & Influencers'],
  movie: ['Film & Broadcasting'],
  video: ['Film & Broadcasting', 'Content Creators & Influencers'],
  creator: ['Content Creators & Influencers', 'Film & Broadcasting', 'Graphic Design Studios'],
  influencer: ['Content Creators & Influencers'],
  marketing: ['Digital Marketing & SEO', 'Content Creators & Influencers'],
  seo: ['Digital Marketing & SEO'],

  // Finance, Money, Banking & Law
  money: ['Banking & Microfinance', 'Fintech & Payments', 'Lending & Credit', 'Crypto & Web3', 'Accounting & Tax', 'Insurance Services', 'Foundations & Trust Funds'],
  finance: ['Banking & Microfinance', 'Fintech & Payments', 'Lending & Credit', 'Accounting & Tax', 'Insurance Services'],
  bank: ['Banking & Microfinance', 'Fintech & Payments', 'Lending & Credit'],
  loan: ['Lending & Credit', 'Banking & Microfinance', 'Fintech & Payments'],
  credit: ['Lending & Credit', 'Banking & Microfinance'],
  crypto: ['Crypto & Web3', 'Fintech & Payments'],
  web3: ['Crypto & Web3', 'Fintech & Payments'],
  tax: ['Accounting & Tax', 'Business Consulting'],
  accounting: ['Accounting & Tax', 'Business Consulting'],
  audit: ['Accounting & Tax', 'Business Consulting'],
  insurance: ['Insurance Services'],
  law: ['Legal Services', 'Business Registration Services'],
  legal: ['Legal Services', 'Business Registration Services'],
  court: ['Legal Services'],
  lawyer: ['Legal Services'],
  attorney: ['Legal Services'],
  cac: ['Business Registration Services', 'Legal Services'],
  registration: ['Business Registration Services', 'Legal Services'],

  // Health, Medicine & Wellness
  health: ['Hospitals & Clinics', 'Dental & Optometry', 'Mental Health Counseling', 'Fitness & Gyms'],
  medical: ['Hospitals & Clinics', 'Dental & Optometry', 'Mental Health Counseling'],
  doctor: ['Hospitals & Clinics', 'Dental & Optometry'],
  hospital: ['Hospitals & Clinics'],
  clinic: ['Hospitals & Clinics', 'Dental & Optometry'],
  teeth: ['Dental & Optometry'],
  dental: ['Dental & Optometry'],
  eye: ['Dental & Optometry'],
  optometry: ['Dental & Optometry'],
  fitness: ['Fitness & Gyms', 'Hospitals & Clinics'],
  gym: ['Fitness & Gyms'],
  workout: ['Fitness & Gyms'],
  therapy: ['Mental Health Counseling', 'Hospitals & Clinics'],
  counseling: ['Mental Health Counseling'],
  mental: ['Mental Health Counseling'],

  // Building, Engineering & Property
  build: ['Architecture & Interior Design', 'Building Materials Supply', 'Civil Engineering', 'Property Development'],
  house: ['Architecture & Interior Design', 'Real Estate Agencies', 'Property Development', 'Home & Furniture'],
  home: ['Home & Furniture', 'Real Estate Agencies', 'Architecture & Interior Design'],
  estate: ['Real Estate Agencies', 'Property Development'],
  property: ['Real Estate Agencies', 'Property Development'],
  land: ['Real Estate Agencies', 'Property Development'],
  rent: ['Real Estate Agencies', 'Ride-Hailing & Car Hire'],
  interior: ['Architecture & Interior Design', 'Home & Furniture'],
  furniture: ['Home & Furniture', 'Carpentry & Roofing'],
  civil: ['Civil Engineering', 'Property Development'],
  construction: ['Civil Engineering', 'Building Materials Supply', 'Property Development', 'Carpentry & Roofing'],
  roof: ['Carpentry & Roofing', 'Building Materials Supply'],
  paint: ['Building Materials Supply', 'Auto Body & Detailing'],
  plumbing: ['Plumbing Services', 'Building Materials Supply'],
  electric: ['Electrical & Generator Repair', 'Electrical Manufacturing', 'Hardware & Telecom'],
  generator: ['Electrical & Generator Repair'],
  solar: ['Electrical Manufacturing', 'Electrical & Generator Repair'],

  // Education, Non-Profit & Services
  school: ['Primary & Secondary Schools', 'Colleges & Universities', 'EdTech Platforms'],
  teach: ['Primary & Secondary Schools', 'Colleges & Universities', 'EdTech Platforms'],
  learn: ['EdTech Platforms', 'Primary & Secondary Schools', 'Colleges & Universities'],
  university: ['Colleges & Universities', 'EdTech Platforms'],
  college: ['Colleges & Universities'],
  ngo: ['NGOs & Charities', 'Foundations & Trust Funds', 'Public Sector Initiatives'],
  charity: ['NGOs & Charities', 'Foundations & Trust Funds'],
  church: ['Religious Centers'],
  mosque: ['Religious Centers'],
  religion: ['Religious Centers'],
  ministry: ['Religious Centers', 'Public Sector Initiatives'],
  clean: ['Cleaning & Laundry', 'Facility Management'],
  laundry: ['Cleaning & Laundry'],
  event: ['Event Planning', 'Event Venues'],
  wedding: ['Event Planning', 'Event Venues', 'Photography & Videography', 'Bakeries & Pastries', 'Catering & Cloud Kitchens'],
  photo: ['Photography & Videography', 'Content Creators & Influencers'],
  video_prod: ['Photography & Videography', 'Film & Broadcasting'],
  security: ['Facility Management', 'IT & Cybersecurity'],
  hr: ['HR & Recruitment', 'Business Consulting'],
  jobs: ['HR & Recruitment', 'Business Consulting'],
  travel: ['Ride-Hailing & Car Hire', 'Haulage & Freight'],
  hotel: ['Event Venues', 'Bars & Nightclubs', 'Cafes & Juice Bars'],
  music: ['Music & Record Labels', 'Content Creators & Influencers'],
  song: ['Music & Record Labels'],
};

export const CustomSelect: React.FC<CustomSelectProps> = ({
  value,
  onChange,
  options,
  placeholder = 'Select an option',
  className = '',
  buttonClassName = '',
  icon,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);

  // Normalize options into SelectOption format
  const normalizedOptions: SelectOption[] = useMemo(() => {
    return options.map(opt =>
      typeof opt === 'string' ? { value: opt, label: opt } : opt
    );
  }, [options]);

  const selectedOption = useMemo(() => {
    return normalizedOptions.find(opt => opt.value === value);
  }, [normalizedOptions, value]);

  // Enhanced semantic search algorithm
  const filteredOptions = useMemo(() => {
    if (!searchQuery.trim()) return normalizedOptions;

    const queryLower = searchQuery.toLowerCase().trim();
    const queryWords = queryLower.split(/\s+/).filter(Boolean);

    // 1. Exact or partial direct match
    const directMatches: SelectOption[] = [];
    const semanticMatches: SelectOption[] = [];

    // Find contextual mappings
    const mappedCategories = new Set<string>();
    for (const [key, categoryList] of Object.entries(CONTEXTUAL_KEYWORD_MAP)) {
      if (queryWords.some(word => word.includes(key) || key.includes(word))) {
        categoryList.forEach(cat => mappedCategories.add(cat.toLowerCase()));
      }
    }

    normalizedOptions.forEach(opt => {
      const labelLower = opt.label.toLowerCase();

      // Check direct substring match
      if (labelLower.includes(queryLower)) {
        directMatches.push(opt);
        return;
      }

      // Check all query words matching label
      if (queryWords.every(word => labelLower.includes(word))) {
        directMatches.push(opt);
        return;
      }

      // Check contextual keyword mapping match
      if (mappedCategories.has(labelLower)) {
        semanticMatches.push(opt);
      }
    });

    // Merge direct matches first, followed by contextual/semantic matches
    const seen = new Set<string>();
    const result: SelectOption[] = [];

    [...directMatches, ...semanticMatches].forEach(opt => {
      if (!seen.has(opt.value)) {
        seen.add(opt.value);
        result.push(opt);
      }
    });

    return result;
  }, [normalizedOptions, searchQuery]);

  // Handle ESC key to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  // Reset search when opening
  const handleOpen = () => {
    setSearchQuery('');
    setIsOpen(true);
  };

  return (
    <div className={`relative w-full ${className}`} ref={containerRef}>
      {/* Trigger Button with sharp corners */}
      <button
        type="button"
        onClick={handleOpen}
        className={`w-full px-5 py-4 text-left transition-all flex items-center justify-between gap-3 cursor-pointer rounded-none ${buttonClassName}`}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-3 truncate">
          {icon && <span className="text-sky-400 shrink-0">{icon}</span>}
          {selectedOption ? (
            <span className="truncate text-white font-medium">
              {selectedOption.label}
            </span>
          ) : (
            <span className="truncate text-slate-400">{placeholder}</span>
          )}
        </div>
        <ChevronDown
          className={`w-5 h-5 text-slate-400 transition-transform duration-300 shrink-0 ${
            isOpen ? 'rotate-180 text-sky-400' : ''
          }`}
        />
      </button>

      {/* PORTALED FULL-SCREEN PURE BACKDROP BLUR (NO DARK FILTER) & 95VH MODAL */}
      {typeof document !== 'undefined' &&
        createPortal(
          <AnimatePresence>
            {isOpen && (
              <div className="fixed inset-0 z-[99999] flex items-center justify-center p-2 sm:p-4 md:p-6 backdrop-blur-2xl bg-transparent overflow-hidden">
                {/* Backdrop dismiss */}
                <div
                  className="absolute inset-0 -z-10"
                  onClick={() => setIsOpen(false)}
                />

                {/* Modal Dialog: Increased height upwards (95vh), centered, overlays over navbar with sharp corners */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.97, y: 8 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.97, y: 8 }}
                  transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                  className="w-full max-w-2xl h-[95vh] max-h-[95vh] my-auto bg-[#130f30] border border-white/20 rounded-none shadow-2xl flex flex-col overflow-hidden text-white"
                  role="listbox"
                >
                  {/* Header */}
                  <div className="p-4 sm:p-5 flex items-center justify-between border-b border-white/10 shrink-0 bg-white/[0.04]">
                    <div>
                      <h3 className="font-display font-bold text-lg sm:text-xl text-white">
                        {placeholder}
                      </h3>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsOpen(false)}
                      className="p-2 text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer rounded-none"
                      aria-label="Close modal"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Contextual Search Bar */}
                  {normalizedOptions.length > 6 && (
                    <div className="p-3 sm:p-4 border-b border-white/10 bg-white/[0.02] shrink-0">
                      <div className="relative">
                        <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-white/50" />
                        <input
                          type="text"
                          autoFocus
                          value={searchQuery || ''}
                          onChange={e => setSearchQuery(e.target.value)}
                          placeholder="Type any word (e.g. food, tech, car, cloth, health, money)..."
                          className="w-full pl-10 pr-9 py-3 text-sm sm:text-base bg-white/[0.08] border border-white/20 rounded-none text-white placeholder-slate-400 focus:outline-none focus:border-[#003663] focus:ring-2 focus:ring-[#38bdf8]/40 shadow-inner"
                        />
                        {searchQuery && (
                          <button
                            type="button"
                            onClick={() => setSearchQuery('')}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-1 text-xs cursor-pointer rounded-none"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                      {/* Contextual note in normal font, white colour, without sparkles icon */}
                      {searchQuery && (
                        <div className="mt-2 text-xs text-white/70 font-unisans-regular font-normal">
                          <span>Contextual search matching closest industries for &quot;{searchQuery}&quot;</span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Scrollable Options List (No default border or background; bg applied on hover or active) */}
                  <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                    {filteredOptions.length === 0 ? (
                      <div className="py-16 px-4 text-center text-slate-300 space-y-2">
                        <p className="text-base font-semibold text-white">No direct matches for &quot;{searchQuery}&quot;</p>
                        <p className="text-xs text-slate-400 font-unisans-regular">
                          Try general terms like &quot;food&quot;, &quot;farm&quot;, &quot;car&quot;, &quot;finance&quot;, &quot;tech&quot;, or select &quot;Other / Unlisted&quot;.
                        </p>
                      </div>
                    ) : (
                      filteredOptions.map(option => {
                        const isSelected = option.value === value;
                        return (
                          <button
                            key={option.value}
                            type="button"
                            onClick={() => {
                              onChange(option.value);
                              setIsOpen(false);
                            }}
                            className={`w-full px-4 py-3 sm:py-3.5 rounded-none text-left text-sm sm:text-base font-medium transition-all flex items-center justify-between gap-3 cursor-pointer border-0 ${
                              isSelected
                                ? 'bg-[#003663] text-white font-bold'
                                : 'bg-transparent hover:bg-white/[0.08] text-slate-200 hover:text-white'
                            }`}
                            role="option"
                            aria-selected={isSelected}
                          >
                            <div className="flex items-center gap-2.5 truncate">
                              {option.icon && <span className="flex-shrink-0">{option.icon}</span>}
                              <span className="truncate">{option.label}</span>
                            </div>
                            {isSelected && <Check className="w-4 h-4 text-[#38bdf8] shrink-0" />}
                          </button>
                        );
                      })
                    )}
                  </div>

                  {/* Bottom bar showing total count */}
                  <div className="p-3.5 border-t border-white/10 bg-white/[0.04] flex items-center justify-between text-xs text-slate-400 px-5 shrink-0">
                    <span>{filteredOptions.length} of {normalizedOptions.length} options</span>
                    <span className="text-[11px] text-slate-400">Esc to close</span>
                  </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>,
          document.body
        )}
    </div>
  );
};
