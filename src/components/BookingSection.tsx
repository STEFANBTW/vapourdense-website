import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowLeft,
  Globe,
  Palette,
  Server,
  CheckCircle2,
  FileDown,
  Link as LinkIcon,
} from 'lucide-react';
import { generateBriefPdf, ProjectBriefData } from '../utils/generateBriefPdf';
import { CustomSelect } from './CustomSelect';
import { db } from '../lib/firebase';
import { doc, setDoc } from 'firebase/firestore';

export type StepId =
  | 'entry'
  | 'who'
  | 'service'
  | 'business'
  | 'projectType'
  | 'projectStatus'
  | 'usageFormat'
  | 'quantity'
  | 'brandAssets'
  | 'goals'
  | 'scope'
  | 'contentReadiness'
  | 'domainHosting'
  | 'feel'
  | 'existingAssets'
  | 'techPreferences'
  | 'timeline'
  | 'budget'
  | 'contact'
  | 'confirmation';

export const BUSINESS_INDUSTRIES = [
  "Accounting & Auditing",
  "Advertising & Media Agencies",
  "Aerospace & Aviation",
  "Agricultural Commodities Trading",
  "Agro-Processing & Packaging",
  "AI & Machine Learning Services",
  "Animation & VFX Studios",
  "Apparel, Fashion & Footwear",
  "Aquaculture & Fish Farming",
  "Architecture & Spatial Design",
  "Art Galleries & Curators",
  "Auto Body & Detailing",
  "Auto Dealerships (New & Used)",
  "Auto Parts & Accessories",
  "Auto Repair & Workshops",
  "Bakeries, Pastries & Confectionery",
  "Banking & Commercial Finance",
  "Bars, Lounges & Nightclubs",
  "Beauty, Cosmetics & Skincare",
  "Beverages, Breweries & Distilleries",
  "Biotech & Life Sciences",
  "Blockchain, Crypto & Web3",
  "Building Materials Supply & Hardware",
  "Business Consulting & Strategy",
  "Cafes, Juice Bars & Tea Houses",
  "Car Rentals, Leasing & Chauffeur Services",
  "Carpentry, Woodwork & Roofing",
  "Catering & Cloud Kitchens",
  "Chemicals & Industrial Materials",
  "Childcare & Early Childhood Education",
  "Civil Engineering & General Contracting",
  "Cleaning, Janitorial & Laundry Services",
  "Cloud Computing & DevOps",
  "Colleges, Polytechnics & Universities",
  "Commercial Printing & Publishing",
  "Commercial Real Estate & Leasing",
  "Commodity Trading & Export",
  "Community & Civic Organizations",
  "Consumer Electronics & Gadgets",
  "Consumer Packaged Goods (CPG)",
  "Content Creators, Streamers & Influencers",
  "Corporate Training & Certifications",
  "Coworking Spaces & Business Hubs",
  "Crop Farming & Horticulture",
  "Cybersecurity & Information Security",
  "Data Analytics & Business Intelligence",
  "Delivery, Courier & Last-Mile Logistics",
  "Dental & Orthodontic Clinics",
  "Digital Marketing & Growth SEO",
  "E-Commerce & Direct-to-Consumer (D2C)",
  "EdTech & Learning Platforms",
  "Electrical Contracting & Installations",
  "Electrical Equipment Manufacturing",
  "Energy Storage, Solar & Renewables",
  "Event Planning & Management",
  "Event Venues, Centers & Banquet Halls",
  "Executive Search & Recruitment",
  "Facilities Management & Maintenance",
  "Farm Equipment, Machinery & Inputs",
  "Fast Food & Quick Service Restaurants (QSR)",
  "Film, Cinema & Video Production",
  "Fintech, Payments & Wallets",
  "Fitness Centers, Gyms & Studios",
  "Food Processing & Manufacturing",
  "Forestry, Timber & Wood Products",
  "Foundations, Trusts & Philanthropy",
  "Freight Forwarding, Cargo & Haulage",
  "Gaming, Game Dev & eSports",
  "Garments, Fabrics & Textiles",
  "General Merchandise & Department Stores",
  "Government & Public Sector Bodies",
  "Graphic Design & Branding Studios",
  "Hair Salons & Barbershops",
  "Hardware & IoT Engineering",
  "Health & Wellness Spas",
  "Heavy Machinery & Industrial Plant",
  "Home Decor, Furniture & Living",
  "Hospitals, Clinics & Medical Centers",
  "Hospitality & Resort Management",
  "HR Tech & Talent Platforms",
  "HVAC, Refrigeration & Cold Storage",
  "Import & Export Brokerage",
  "Insurance & Reinsurance",
  "Interior Architecture & Decoration",
  "Investment Banking & Private Equity",
  "IT Infrastructure & Managed Support",
  "Jewelry, Watches & Luxury Goods",
  "Journalism, News & Digital Media",
  "Law Enforcement & Security Solutions",
  "Legal Services & Law Firms",
  "Lending, Credit & Microfinance",
  "Livestock, Poultry & Animal Husbandry",
  "Luxury Concierge & Lifestyle Services",
  "Manufacturing & Industrial Assembly",
  "Marine Transport, Shipping & Ports",
  "Market Research & Consumer Insights",
  "Mental Health, Therapy & Counseling",
  "Metal Fabrication, Welding & Machining",
  "Mining, Quarrying & Mineral Resources",
  "Mobile App Development",
  "Music Production & Record Labels",
  "NGOs, Non-Profits & Charities",
  "Nutrition, Supplements & Dietetics",
  "Oil & Gas Exploration & Production",
  "Oil & Gas Retail & Distribution",
  "Optometry & Eye Care Clinics",
  "Packaging, Boxes & Label Production",
  "Pest Control & Fumigation Services",
  "Pet Care, Veterinary & Supplies",
  "Pharmaceuticals & Chemist Stores",
  "Photography Studios & Videography",
  "Physical Therapy & Rehabilitation",
  "Plastics, Polymers & Rubber",
  "Plumbing & Water Systems",
  "Podcasting & Audio Broadcasting",
  "POS, Payment Terminals & Agency Banking",
  "Primary & Secondary Schools (K-12)",
  "Public Relations (PR) & Communications",
  "Real Estate Agencies & Brokerage",
  "Real Estate Development & Construction",
  "Religious Organizations & Faith Centers",
  "Restaurants & Fine Dining",
  "Ride-Hailing & Mobility Platforms",
  "SaaS & Enterprise Cloud Software",
  "Security Guarding & Surveillance",
  "Short-Let Apartments & Vacation Rentals",
  "Software Engineering & Development Agencies",
  "Sports, Athletics & Recreation",
  "Supermarkets, Groceries & Provisions",
  "Supply Chain & Inventory Solutions",
  "Surveying, Mapping & Geoinformatics",
  "Telecommunications & Internet Providers",
  "Think Tanks & Policy Institutes",
  "Tourism, Travel & Tour Agencies",
  "Toys, Games & Baby Products",
  "Translation & Localization Services",
  "Tutoring, Coaching & Test Prep",
  "Vehicle Inspection & Diagnostic Centers",
  "Venture Capital & Angel Networks",
  "Veterinary Medicine & Animal Clinics",
  "Video Game Publishing",
  "Vocational & Technical Trade Schools",
  "Warehousing, Fulfillment & Storage",
  "Waste Management & Recycling Services",
  "Water Treatment, Supply & Bottling",
  "Wealth Management & Personal Finance",
  "Yoga, Pilates & Mindfulness",
  "Other / Unlisted"
];

const INDUSTRIES = BUSINESS_INDUSTRIES;

export const BookingSection: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<StepId>('entry');
  const [direction, setDirection] = useState<1 | -1>(1);

  // Form State
  const [profileType, setProfileType] = useState<string>(''); // 'idea' | 'prepared'
  const [service, setService] = useState<'website' | 'graphic' | 'backend' | ''>('');

  // Business Info
  const [businessName, setBusinessName] = useState<string>('');
  const [industry, setIndustry] = useState<string>('');
  const [customIndustry, setCustomIndustry] = useState<string>('');
  const [isTypingCustomIndustry, setIsTypingCustomIndustry] = useState<boolean>(false);

  // Project Type
  const [projectType, setProjectType] = useState<string>('');
  const [customProjectType, setCustomProjectType] = useState<string>('');
  const [selectedGraphicTypes, setSelectedGraphicTypes] = useState<string[]>([]);
  const [selectedBackendTypes, setSelectedBackendTypes] = useState<string[]>([]);

  // Project Status (Prepared: New Build vs. Redesign vs. Upgrade across all 3 services)
  const [projectStatus, setProjectStatus] = useState<string>('');
  const [projectStatusDetails, setProjectStatusDetails] = useState<string>('');

  // Graphic specific: Usage & Quantity
  const [usageFormat, setUsageFormat] = useState<string>('');
  const [graphicQuantity, setGraphicQuantity] = useState<string>('');
  const [brandAssets, setBrandAssets] = useState<string>('');
  const [brandAssetsDetails, setBrandAssetsDetails] = useState<string>('');

  // Goals / Features (Website & Backend)
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);
  const [customGoal, setCustomGoal] = useState<string>('');
  const [isCustomGoalOpen, setIsCustomGoalOpen] = useState(false);

  // Scope & Readiness (Website)
  const [scopePages, setScopePages] = useState<string>('');
  const [contentReadiness, setContentReadiness] = useState<string[]>([]);
  const [contentReadinessLink, setContentReadinessLink] = useState<string>('');
  const [domainHosting, setDomainHosting] = useState<string>('');

  // Style / Feel Direction
  const [designDirectionChoice, setDesignDirectionChoice] = useState<string>('');
  const [feelMood, setFeelMood] = useState<string>('');
  const [feelDescription, setFeelDescription] = useState<string>('');
  const [referenceWebsiteLink, setReferenceWebsiteLink] = useState<string>('');

  // Idea Existing Assets (Website, Graphic, Backend)
  const [selectedExistingAssets, setSelectedExistingAssets] = useState<string[]>([]);
  const [existingAssetsSingle, setExistingAssetsSingle] = useState<string>('');
  const [existingAssetsDetails, setExistingAssetsDetails] = useState<string>('');

  // Backend Tech Preferences
  const [techStackChoice, setTechStackChoice] = useState<string>('');
  const [techStackDetails, setTechStackDetails] = useState<string>('');

  // Timeline
  const [timelineType, setTimelineType] = useState<'asap' | 'weeks' | 'flexible' | ''>('');
  const [timelineWeeks, setTimelineWeeks] = useState<number>(4);

  // Budget — Slider with comma-separated price input up to ₦10M+
  const [budgetType, setBudgetType] = useState<'exact' | 'below' | 'idea' | ''>('exact');
  const [exactBudgetAmount, setExactBudgetAmount] = useState<number>(2800000);

  // Contact
  const [fullName, setFullName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [preferredContact, setPreferredContact] = useState<string>('Email');

  // Confirmation state
  const [briefSummary, setBriefSummary] = useState<ProjectBriefData | null>(null);

  // When profileType is 'prepared', custom goal is open by default
  useEffect(() => {
    if (profileType === 'prepared') {
      setIsCustomGoalOpen(true);
    }
  }, [profileType]);

  // Compute active step list dynamically based on profileType and service
  const getSteps = (): StepId[] => {
    if (profileType === 'idea') {
      if (service === 'website') {
        return ['who', 'service', 'business', 'projectType', 'existingAssets', 'feel', 'timeline', 'budget', 'contact'];
      }
      if (service === 'graphic') {
        return ['who', 'service', 'business', 'projectType', 'existingAssets', 'feel', 'timeline', 'budget', 'contact'];
      }
      if (service === 'backend') {
        return ['who', 'service', 'business', 'projectType', 'existingAssets', 'timeline', 'budget', 'contact'];
      }
      return ['who', 'service', 'business', 'projectType', 'existingAssets', 'feel', 'timeline', 'budget', 'contact'];
    } else {
      // Prepared
      if (service === 'website') {
        return ['who', 'service', 'business', 'projectType', 'projectStatus', 'goals', 'scope', 'contentReadiness', 'domainHosting', 'feel', 'timeline', 'budget', 'contact'];
      }
      if (service === 'graphic') {
        return ['who', 'service', 'business', 'projectType', 'projectStatus', 'usageFormat', 'quantity', 'brandAssets', 'contentReadiness', 'feel', 'timeline', 'budget', 'contact'];
      }
      if (service === 'backend') {
        return ['who', 'service', 'business', 'projectType', 'projectStatus', 'goals', 'techPreferences', 'timeline', 'budget', 'contact'];
      }
      return ['who', 'service', 'business', 'projectType', 'projectStatus', 'feel', 'timeline', 'budget', 'contact'];
    }
  };

  const activeSteps = getSteps();
  const currentStepIndex = activeSteps.indexOf(currentStep);
  const progressPercent = currentStepIndex >= 0 ? ((currentStepIndex + 1) / activeSteps.length) * 100 : 0;

  // Motion Transition Variants
  const royalGracefulVariants = {
    initial: (dir: number) => ({
      opacity: 0,
      filter: 'blur(12px)',
      scale: dir > 0 ? 0.98 : 1.02,
      y: dir > 0 ? 10 : -10,
    }),
    animate: {
      opacity: 1,
      filter: 'blur(0px)',
      scale: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
      },
    },
    exit: (dir: number) => ({
      opacity: 0,
      filter: 'blur(12px)',
      scale: dir > 0 ? 1.02 : 0.98,
      y: dir > 0 ? -10 : 10,
      transition: {
        duration: 0.4,
        ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
      },
    }),
  };

  const goToStep = (next: StepId) => {
    setDirection(1);
    setCurrentStep(next);
  };

  const goBack = () => {
    setDirection(-1);
    const steps = getSteps();
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1]);
    } else if (currentStep === 'who') {
      setCurrentStep('entry');
    }
  };

  const goToNext = () => {
    const steps = getSteps();
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex >= 0 && currentIndex < steps.length - 1) {
      setDirection(1);
      setCurrentStep(steps[currentIndex + 1]);
    }
  };

  // Toggle goals (up to 3 selections)
  const toggleGoal = (tag: string) => {
    if (selectedGoals.includes(tag)) {
      setSelectedGoals(selectedGoals.filter(t => t !== tag));
    } else {
      if (selectedGoals.length < 3) {
        setSelectedGoals([...selectedGoals, tag]);
      } else {
        setSelectedGoals([...selectedGoals.slice(1), tag]);
      }
    }
  };

  // Toggle graphic deliverables
  const toggleGraphicType = (type: string) => {
    if (selectedGraphicTypes.includes(type)) {
      setSelectedGraphicTypes(selectedGraphicTypes.filter(t => t !== type));
    } else {
      setSelectedGraphicTypes([...selectedGraphicTypes, type]);
    }
  };

  // Toggle backend deliverables
  const toggleBackendType = (type: string) => {
    if (selectedBackendTypes.includes(type)) {
      setSelectedBackendTypes(selectedBackendTypes.filter(t => t !== type));
    } else {
      setSelectedBackendTypes([...selectedBackendTypes, type]);
    }
  };

  // Toggle content readiness (Website prepared)
  const toggleContentReadiness = (item: string) => {
    if (item.startsWith('None yet')) {
      setContentReadiness([item]);
      return;
    }
    const filtered = contentReadiness.filter(i => !i.startsWith('None yet'));
    if (filtered.includes(item)) {
      setContentReadiness(filtered.filter(i => i !== item));
    } else {
      setContentReadiness([...filtered, item]);
    }
  };

  // Toggle existing assets (Idea website / graphic)
  const toggleExistingAsset = (item: string) => {
    if (item.startsWith('Nothing yet')) {
      setSelectedExistingAssets([item]);
      return;
    }
    const filtered = selectedExistingAssets.filter(i => !i.startsWith('Nothing yet'));
    if (filtered.includes(item)) {
      setSelectedExistingAssets(filtered.filter(i => i !== item));
    } else {
      setSelectedExistingAssets([...filtered, item]);
    }
  };

  // Submission handler
  const handleFinalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !email.trim()) return;

    const ref = `DIVE-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
    const serviceNameMap: Record<string, string> = {
      website: 'Website / Web App',
      graphic: 'Graphic Design',
      backend: 'Backend / Custom Software',
    };

    const resolvedIndustry =
      (isTypingCustomIndustry || industry === 'Other' || industry === 'Other (Type your own)' || industry === 'Other / Unlisted') && customIndustry.trim()
        ? customIndustry.trim()
        : industry || 'Not specified';

    let effectiveProjectType: string | undefined = undefined;
    if (service === 'graphic') {
      const allSelected = [...selectedGraphicTypes, customProjectType.trim()].filter(Boolean);
      effectiveProjectType = allSelected.length > 0 ? allSelected.join(', ') : (projectType || undefined);
    } else if (service === 'backend') {
      const allSelected = [...selectedBackendTypes, customProjectType.trim()].filter(Boolean);
      effectiveProjectType = allSelected.length > 0 ? allSelected.join(', ') : (projectType || undefined);
    } else {
      effectiveProjectType = customProjectType.trim() || projectType || undefined;
    }

    const effectiveExistingAssets =
      profileType === 'idea'
        ? service === 'backend'
          ? (existingAssetsSingle ? `${existingAssetsSingle}${existingAssetsDetails.trim() ? `: ${existingAssetsDetails.trim()}` : ''}` : undefined)
          : (selectedExistingAssets.length > 0 ? `${selectedExistingAssets.join(', ')}${existingAssetsDetails.trim() ? `: ${existingAssetsDetails.trim()}` : ''}` : undefined)
        : undefined;

    const effectiveContentReadiness =
      profileType === 'prepared'
        ? service === 'website'
          ? contentReadiness.length > 0 ? [...contentReadiness, contentReadinessLink.trim() ? `Link: ${contentReadinessLink.trim()}` : ''].filter(Boolean) : undefined
          : service === 'graphic'
          ? (projectType ? [projectType] : undefined) // or single status stored in contentReadiness
          : undefined
        : undefined;

    const briefData: ProjectBriefData = {
      referenceId: ref,
      submittedAt: new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }),
      businessName: businessName.trim() || 'Undisclosed Client',
      industry: resolvedIndustry,
      profileType:
        profileType === 'idea'
          ? 'I have an idea, but need direction'
          : 'I know exactly what I want',
      service: serviceNameMap[service] || 'Creative Consulting',
      projectType: effectiveProjectType,
      projectStatus: projectStatus || undefined,
      projectStatusDetails: projectStatusDetails.trim() || undefined,
      usageFormat: usageFormat || undefined,
      goals: selectedGoals,
      customGoal: customGoal.trim() || undefined,
      scopePages: scopePages || undefined,
      contentReadiness: effectiveContentReadiness,
      domainHosting: domainHosting || undefined,
      feelMood: feelMood || designDirectionChoice || undefined,
      feelDescription: feelDescription.trim() || undefined,
      referenceWebsiteLink: referenceWebsiteLink.trim() || undefined,
      graphicQuantity: graphicQuantity || undefined,
      brandAssets: brandAssets ? `${brandAssets}${brandAssetsDetails.trim() ? `: ${brandAssetsDetails.trim()}` : ''}` : undefined,
      existingAssets: effectiveExistingAssets,
      techStackPreference: techStackChoice ? `${techStackChoice}${techStackDetails.trim() ? `: ${techStackDetails.trim()}` : ''}` : undefined,
      systemCurrentState: projectStatus || undefined,
      timelineType,
      timelineWeeks: timelineType === 'weeks' ? timelineWeeks : undefined,
      budgetType,
      exactBudgetAmount: budgetType === 'exact' ? exactBudgetAmount : undefined,
      budgetBand: budgetType === 'exact' ? `₦${exactBudgetAmount.toLocaleString('en-US')}` : undefined,
      fullName: fullName.trim(),
      email: email.trim(),
      phone: phone.trim(),
      preferredContact,
    };

    setBriefSummary(briefData);

    // 1. Save brief directly to Firestore database as source of truth
    const firestorePayload: Record<string, any> = {
      createdAt: Date.now(),
      status: 'unread',
    };
    Object.entries(briefData).forEach(([key, val]) => {
      if (val !== undefined) {
        firestorePayload[key] = val;
      }
    });

    try {
      await setDoc(doc(db, 'briefs', briefData.referenceId), firestorePayload);
      console.log('Brief successfully stored in Firestore:', briefData.referenceId);
    } catch (err) {
      console.error('Firestore brief save error:', err);
    }

    try {
      const existing = localStorage.getItem('vdvc_briefs_submitted');
      const list = existing ? JSON.parse(existing) : [];
      list.unshift({ ...briefData, createdAt: Date.now(), status: 'new' });
      localStorage.setItem('vdvc_briefs_submitted', JSON.stringify(list.slice(0, 50)));
    } catch {
      // ignore
    }

    // 2. Dispatch background automatic email to vapourdense@gmail.com without opening mailto
    try {
      const summaryText = `DIVE STUDIO PROJECT BRIEF // REF: ${briefData.referenceId}
Client: ${briefData.fullName}
Business: ${briefData.businessName} (${briefData.industry})
Email: ${briefData.email}
Phone: ${briefData.phone || 'N/A'}
Preferred Contact: ${briefData.preferredContact}

Service: ${briefData.service}
Readiness: ${briefData.profileType}
Deliverable: ${briefData.projectType || 'N/A'}
Project Stage: ${briefData.projectStatus || 'N/A'}${briefData.projectStatusDetails ? ` (${briefData.projectStatusDetails})` : ''}
Usage Format: ${briefData.usageFormat || 'N/A'}
Goals / Features: ${briefData.goals.join(', ')} ${briefData.customGoal ? `(${briefData.customGoal})` : ''}
Page Scope: ${briefData.scopePages || 'N/A'}
Content Readiness: ${briefData.contentReadiness ? briefData.contentReadiness.join(', ') : 'N/A'}
Domain & Hosting: ${briefData.domainHosting || 'N/A'}
Style Direction: ${briefData.feelMood || 'N/A'}
Style Description: ${briefData.feelDescription || 'N/A'}
Reference Link: ${briefData.referenceWebsiteLink || 'N/A'}
Graphic Quantity: ${briefData.graphicQuantity || 'N/A'}
Brand Assets: ${briefData.brandAssets || 'N/A'}
Existing Assets: ${briefData.existingAssets || 'N/A'}
Tech Preferences: ${briefData.techStackPreference || 'N/A'}
Timeline: ${briefData.timelineType === 'weeks' ? `${briefData.timelineWeeks} Weeks` : briefData.timelineType}
Budget: ${briefData.budgetBand || briefData.budgetType}`;

      fetch('https://formsubmit.co/ajax/vapourdense@gmail.com', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          _subject: `New Project Brief: ${briefData.businessName} [${briefData.service}]`,
          _template: 'table',
          _captcha: 'false',
          reference_id: briefData.referenceId,
          client_name: briefData.fullName,
          client_email: briefData.email,
          client_phone: briefData.phone || 'N/A',
          preferred_contact: briefData.preferredContact,
          business_name: briefData.businessName,
          industry: briefData.industry,
          service: briefData.service,
          readiness: briefData.profileType,
          deliverable: briefData.projectType || 'N/A',
          project_stage: briefData.projectStatus || 'N/A',
          project_stage_details: briefData.projectStatusDetails || 'N/A',
          usage_format: briefData.usageFormat || 'N/A',
          goals: briefData.goals.join(', '),
          custom_goal: briefData.customGoal || 'N/A',
          page_scope: briefData.scopePages || 'N/A',
          domain_hosting: briefData.domainHosting || 'N/A',
          style_direction: briefData.feelMood || 'N/A',
          style_description: briefData.feelDescription || 'N/A',
          reference_link: briefData.referenceWebsiteLink || 'N/A',
          timeline: briefData.timelineType === 'weeks' ? `${briefData.timelineWeeks} Weeks` : briefData.timelineType,
          budget: briefData.budgetBand || briefData.budgetType,
          full_brief_summary: summaryText,
        }),
      }).catch(err => {
        console.warn('Background email dispatch log:', err);
      });
    } catch (e) {
      console.warn('Automatic email send exception:', e);
    }

    setDirection(1);
    setCurrentStep('confirmation');
  };

  const handleDownloadPdfAgain = () => {
    if (!briefSummary) return;
    try {
      const doc = generateBriefPdf(briefSummary);
      const cleanFileName = `Dive_Studio_Brief_${(briefSummary.businessName || 'Project')
        .replace(/[^a-zA-Z0-9]/g, '_')
        .slice(0, 20)}.pdf`;
      doc.save(cleanFileName);
    } catch (err) {
      console.error('Error generating PDF:', err);
    }
  };

  return (
    <section
      id="booking"
      className="h-[100dvh] max-h-[100dvh] w-full flex flex-col justify-center items-center p-0 bg-[#130f30] overflow-hidden"
    >
      <div className="w-full h-full max-h-[100dvh] flex flex-col justify-between items-center relative z-10 overflow-hidden">
        <AnimatePresence mode="wait" custom={direction}>
          {/* ==============================================================
              ENTRY POINT (Sharp corners)
             ============================================================== */}
          {currentStep === 'entry' && (
            <motion.div
              key="entry"
              custom={direction}
              variants={royalGracefulVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="w-full flex-1 flex flex-col items-center justify-center text-center space-y-2.5 sm:space-y-7 sm:space-y-8 p-6 sm:p-10 md:p-16 my-auto"
            >
              <h2 className="font-phenomena-bold text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white leading-[1.08] max-w-4xl">
                Ready to build something great?
              </h2>

              <p className="text-base sm:text-lg md:text-xl text-slate-300 max-w-2xl font-light leading-relaxed font-body-copy">
                Whether you have a full brief or just a spark of an idea — we&apos;re ready to hear it.
              </p>

              <div className="pt-2">
                <button
                  onClick={() => {
                    goToStep('who');
                    setTimeout(() => {
                      const el = document.getElementById('booking');
                      if (el) {
                        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                      }
                    }, 50);
                  }}
                  className="px-10 sm:px-12 py-4 text-base sm:text-lg font-bold text-[#130f30] border border-black/20 rounded-none shadow-xl cursor-pointer tracking-wide"
                  style={{
                    background: 'linear-gradient(125deg, #f58338 0%, #f58338 72%, #fcd2bb 72%, #fcd2bb 80%, #ee5266 80%, #ee5266 100%)',
                  }}
                >
                  Let&apos;s Get Started →
                </button>
              </div>
            </motion.div>
          )}

          {/* ==============================================================
              FULL-VIEWPORT TRANSPARENT STEP VIEW (SHARP CORNERS)
             ============================================================== */}
          {currentStep !== 'entry' && currentStep !== 'confirmation' && (
            <motion.div
              key={currentStep}
              custom={direction}
              variants={royalGracefulVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="w-full h-full max-h-[100dvh] flex flex-col justify-between bg-transparent rounded-none relative overflow-hidden py-1 sm:py-6"
            >
              {/* VIEWPORT CONTAINER */}
              <div className="flex-1 w-[85vw] max-w-[85vw] sm:w-full sm:max-w-none max-h-[86dvh] sm:max-h-full mx-auto my-auto sm:my-0 flex flex-col justify-between items-center px-1 py-2 sm:p-8 md:p-14 lg:p-16 relative rounded-none overflow-y-auto">
                <div className="w-full max-w-4xl lg:max-w-5xl mx-auto space-y-3.5 sm:space-y-7 my-auto">
                  {/* Wide Orange Progress Bar */}
                  <div className="w-full">
                    <div className="h-1.5 w-full bg-white/10 relative rounded-none overflow-hidden">
                      <motion.div
                        className="h-full bg-[#f97316] rounded-none shadow-[0_0_12px_rgba(249,115,22,0.8)]"
                        initial={false}
                        animate={{ width: `${progressPercent}%` }}
                        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                      />
                    </div>
                  </div>

                  {/* Back Arrow Row */}
                  <div className="flex items-center justify-between">
                    <button
                      type="button"
                      onClick={goBack}
                      className="p-2 -ml-2 rounded-none text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                      aria-label="Previous question"
                    >
                      <ArrowLeft className="w-5 h-5" />
                    </button>
                  </div>

                  {/* --------------------------------------------------------
                      STEP 1: READINESS SPLIT ('who')
                     -------------------------------------------------------- */}
                  {currentStep === 'who' && (
                    <div className="space-y-2.5 sm:space-y-7">
                      <div>
                        <span className="font-unisans-thin-caps text-[10px] sm:text-[13px] uppercase tracking-widest text-white block mb-2">
                          BEFORE WE DIVE IN —
                        </span>
                        <h3 className="font-phenomena text-4xl sm:text-4xl lg:text-[54px] font-bold text-white tracking-tight leading-tight">
                          Which of these sounds like you?
                        </h3>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-1">
                        <button
                          type="button"
                          onClick={() => {
                            setProfileType('idea');
                            setIsCustomGoalOpen(false);
                            goToStep('service');
                          }}
                          className={`p-7 sm:p-8 text-left rounded-none transition-all duration-300 cursor-pointer group hover:-translate-y-1 shadow-sm border ${
                            profileType === 'idea'
                              ? 'bg-[#003663] border-2 border-[#38bdf8] text-white shadow-lg'
                              : 'bg-white/[0.05] hover:bg-white/[0.10] border-white/15 text-white backdrop-blur-md'
                          }`}
                        >
                          <h4 className="font-display text-lg sm:text-xl font-bold text-white mb-2 leading-snug">
                            I have an idea, but need direction
                          </h4>
                          <p className="text-xs sm:text-sm text-slate-300 font-light leading-relaxed">
                            You know the outcome you want, but need help figuring out the right scope, features, or visual direction.
                          </p>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setProfileType('prepared');
                            setIsCustomGoalOpen(true);
                            goToStep('service');
                          }}
                          className={`p-7 sm:p-8 text-left rounded-none transition-all duration-300 cursor-pointer group hover:-translate-y-1 shadow-sm border ${
                            profileType === 'prepared'
                              ? 'bg-[#003663] border-2 border-[#38bdf8] text-white shadow-lg'
                              : 'bg-white/[0.05] hover:bg-white/[0.10] border-white/15 text-white backdrop-blur-md'
                          }`}
                        >
                          <h4 className="font-display text-lg sm:text-xl font-bold text-white mb-2 leading-snug">
                            I know exactly what I want
                          </h4>
                          <p className="text-xs sm:text-sm text-slate-300 font-light leading-relaxed">
                            You have clear deliverables, required features, or references ready to get into the details.
                          </p>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* --------------------------------------------------------
                      STEP 2: SERVICE SELECTION ('service')
                     -------------------------------------------------------- */}
                  {currentStep === 'service' && (
                    <div className="space-y-2.5 sm:space-y-7">
                      <div>
                        <span className="font-unisans-thin-caps text-[10px] sm:text-[13px] uppercase tracking-widest text-white block mb-2">
                          STEP 1 — SERVICE
                        </span>
                        <h3 className="font-phenomena text-4xl sm:text-4xl lg:text-[54px] font-bold text-white tracking-tight leading-tight">
                          What are you looking to build?
                        </h3>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 pt-1">
                        <button
                          type="button"
                          onClick={() => {
                            setService('website');
                            goToStep('business');
                          }}
                          className={`p-6 sm:p-7 text-left rounded-none transition-all duration-300 cursor-pointer group hover:-translate-y-1 shadow-sm border ${
                            service === 'website'
                              ? 'bg-[#003663] border-2 border-[#38bdf8] text-white shadow-lg'
                              : 'bg-white/[0.05] hover:bg-white/[0.10] border-white/15 text-white backdrop-blur-md'
                          }`}
                        >
                          <div className="w-11 h-11 rounded-none bg-white/10 flex items-center justify-center text-[#38bdf8] mb-4 group-hover:scale-105 transition-transform">
                            <Globe className="w-5 h-5 text-[#38bdf8]" />
                          </div>
                          <h4 className="font-display text-base sm:text-lg font-bold text-white mb-1.5">
                            Website / Web App
                          </h4>
                          <p className="text-xs sm:text-[13px] text-slate-300 font-light leading-relaxed">
                            Business websites, landing pages, online stores, and web applications.
                          </p>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setService('graphic');
                            goToStep('business');
                          }}
                          className={`p-6 sm:p-7 text-left rounded-none transition-all duration-300 cursor-pointer group hover:-translate-y-1 shadow-sm border ${
                            service === 'graphic'
                              ? 'bg-[#003663] border-2 border-[#38bdf8] text-white shadow-lg'
                              : 'bg-white/[0.05] hover:bg-white/[0.10] border-white/15 text-white backdrop-blur-md'
                          }`}
                        >
                          <div className="w-11 h-11 rounded-none bg-white/10 flex items-center justify-center text-[#38bdf8] mb-4 group-hover:scale-105 transition-transform">
                            <Palette className="w-5 h-5 text-[#38bdf8]" />
                          </div>
                          <h4 className="font-display text-base sm:text-lg font-bold text-white mb-1.5">
                            Graphic Design
                          </h4>
                          <p className="text-xs sm:text-[13px] text-slate-300 font-light leading-relaxed">
                            Logos, brand identity kits, flyers, packaging, pitch decks, and social graphics.
                          </p>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setService('backend');
                            goToStep('business');
                          }}
                          className={`p-6 sm:p-7 text-left rounded-none transition-all duration-300 cursor-pointer group hover:-translate-y-1 shadow-sm border ${
                            service === 'backend'
                              ? 'bg-[#003663] border-2 border-[#38bdf8] text-white shadow-lg'
                              : 'bg-white/[0.05] hover:bg-white/[0.10] border-white/15 text-white backdrop-blur-md'
                          }`}
                        >
                          <div className="w-11 h-11 rounded-none bg-white/10 flex items-center justify-center text-[#38bdf8] mb-4 group-hover:scale-105 transition-transform">
                            <Server className="w-5 h-5 text-[#38bdf8]" />
                          </div>
                          <h4 className="font-display text-base sm:text-lg font-bold text-white mb-1.5">
                            Backend / Custom Software
                          </h4>
                          <p className="text-xs sm:text-[13px] text-slate-300 font-light leading-relaxed">
                            Custom software, SaaS MVPs, internal tools, automations, APIs, and integrations.
                          </p>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* --------------------------------------------------------
                      STEP 3: BUSINESS INFO ('business')
                     -------------------------------------------------------- */}
                  {currentStep === 'business' && (
                    <div className="space-y-2.5 sm:space-y-7">
                      <div>
                        <span className="font-unisans-thin-caps text-[10px] sm:text-[13px] uppercase tracking-widest text-white block mb-2">
                          STEP 2 — BUSINESS INFO
                        </span>
                        <h3 className="font-phenomena text-4xl sm:text-4xl lg:text-[54px] font-bold text-white tracking-tight leading-tight">
                          Tell us about your brand.
                        </h3>
                      </div>

                      <div className="space-y-5 pt-1 max-w-2xl mx-auto">
                        <div>
                          <label className="font-unisans-thin-caps block text-xs sm:text-[13px] uppercase tracking-wider text-slate-200 mb-2">
                            Business name
                          </label>
                          <input
                            type="text"
                            value={businessName}
                            onChange={e => setBusinessName(e.target.value)}
                            placeholder="e.g. Bright Co. Studio"
                            className="w-full px-4 py-3.5 text-sm sm:text-base text-white placeholder-slate-400 bg-white/[0.06] hover:bg-white/[0.09] border border-white/15 rounded-none focus:outline-none focus:border-[#003663] focus:ring-2 focus:ring-[#38bdf8]/50 transition-all shadow-none"
                          />
                        </div>

                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <label className="font-unisans-thin-caps block text-xs sm:text-[13px] uppercase tracking-wider text-slate-200">
                              Industry
                            </label>
                            {!isTypingCustomIndustry && industry !== 'Other / Unlisted' && industry !== 'Other (Type your own)' && (
                              <button
                                type="button"
                                onClick={() => {
                                  setIsTypingCustomIndustry(true);
                                  setIndustry('Other / Unlisted');
                                }}
                                className="text-xs text-[#38bdf8] hover:text-white font-medium underline-offset-2 hover:underline cursor-pointer rounded-none"
                              >
                                Can&apos;t find yours? Type your own
                              </button>
                            )}
                          </div>

                          <CustomSelect
                            value={industry}
                            onChange={val => {
                              setIndustry(val);
                              if (val === 'Other / Unlisted' || val === 'Other (Type your own)' || val === 'Other') {
                                setIsTypingCustomIndustry(true);
                              }
                            }}
                            options={INDUSTRIES}
                            placeholder="Select your industry"
                            buttonClassName="py-3.5 text-sm sm:text-base bg-white/[0.06] hover:bg-white/[0.09] text-white border border-white/15 rounded-none shadow-none"
                          />

                          {/* Custom industry input */}
                          {(isTypingCustomIndustry || industry === 'Other / Unlisted' || industry === 'Other (Type your own)' || industry === 'Other') && (
                            <motion.div
                              initial={{ opacity: 0, y: -4 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="mt-3 space-y-1.5"
                            >
                              <div className="flex items-center justify-between">
                                <label className="block text-xs font-semibold text-[#38bdf8]">
                                  Specify your custom industry:
                                </label>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setIsTypingCustomIndustry(false);
                                    setCustomIndustry('');
                                    if (industry === 'Other / Unlisted' || industry === 'Other (Type your own)') setIndustry('');
                                  }}
                                  className="text-[11px] text-slate-400 hover:text-slate-200 cursor-pointer rounded-none"
                                >
                                  Back to list
                                </button>
                              </div>
                              <div className="relative">
                                <input
                                  type="text"
                                  autoFocus
                                  value={customIndustry}
                                  onChange={e => setCustomIndustry(e.target.value)}
                                  placeholder="e.g. Sustainable Architecture, Artisan Bakery, Web3..."
                                  className="w-full px-4 py-3 text-sm text-white placeholder-slate-400 bg-white/[0.06] rounded-none border border-white/20 focus:outline-none focus:border-[#003663] focus:ring-2 focus:ring-[#38bdf8]/50 transition-all"
                                />
                                {customIndustry && (
                                  <button
                                    type="button"
                                    onClick={() => setCustomIndustry('')}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white bg-white/10 hover:bg-white/20 px-2 py-1 rounded-none cursor-pointer"
                                  >
                                    Clear
                                  </button>
                                )}
                              </div>
                            </motion.div>
                          )}
                        </div>
                      </div>

                      <div className="pt-5 flex justify-center">
                        <button
                          type="button"
                          disabled={!businessName.trim()}
                          onClick={goToNext}
                          className="px-10 py-3.5 text-sm sm:text-base font-bold text-white bg-[#003663] hover:bg-[#002647] border border-[#38bdf8]/40 disabled:opacity-40 disabled:pointer-events-none rounded-none shadow-lg transition-all cursor-pointer"
                        >
                          Next →
                        </button>
                      </div>
                    </div>
                  )}

                  {/* --------------------------------------------------------
                      STEP 4: DELIVERABLES & FOCUS ('projectType')
                     -------------------------------------------------------- */}
                  {currentStep === 'projectType' && (
                    <div className="space-y-2.5 sm:space-y-7">
                      <div>
                        <span className="font-unisans-thin-caps text-[10px] sm:text-[13px] uppercase tracking-widest text-white block mb-2">
                          {profileType === 'idea' ? 'STEP 3 — MAIN GOAL' : 'STEP 3 — DELIVERABLES'}
                        </span>
                        <h3 className="font-phenomena text-4xl sm:text-4xl lg:text-[54px] font-bold text-white tracking-tight leading-tight">
                          {profileType === 'idea'
                            ? service === 'website'
                              ? 'What should this website do for your business?'
                              : service === 'graphic'
                              ? 'What do you need designed?'
                              : 'What problem should this software solve?'
                            : service === 'website'
                            ? 'What type of website or web app are you building?'
                            : service === 'graphic'
                            ? 'Which deliverables do you need?'
                            : 'What type of software or system are we building?'}
                        </h3>
                      </div>

                      <div className="space-y-4 pt-1">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                          {/* IDEA: Website */}
                          {profileType === 'idea' && service === 'website' &&
                            [
                              'Explain my business and build credibility',
                              'Sell products directly online',
                              'Let clients book appointments or services',
                              'Replace or modernize an outdated website',
                              'Launch a new product, event, or campaign',
                              'Not sure yet — guide me on what fits best',
                            ].map(item => (
                              <button
                                key={item}
                                type="button"
                                onClick={() => setProjectType(item)}
                                className={`p-5 text-left rounded-none transition-all cursor-pointer border ${
                                  projectType === item
                                    ? 'bg-[#003663] border-2 border-[#38bdf8] text-white shadow-lg font-bold'
                                    : 'bg-white/[0.05] hover:bg-white/[0.10] border-white/15 text-white backdrop-blur-md'
                                }`}
                              >
                                <h4 className="text-sm sm:text-base font-bold text-white">{item}</h4>
                              </button>
                            ))}

                          {/* IDEA: Graphic (Multi-select) */}
                          {profileType === 'idea' && service === 'graphic' &&
                            [
                              'A logo for my business',
                              'Flyers, posters, or business cards',
                              'Social media graphics',
                              'A consistent look for my whole brand',
                              'Product packaging or labels',
                              'Company profile or presentation deck',
                            ].map(item => {
                              const active = selectedGraphicTypes.includes(item);
                              return (
                                <button
                                  key={item}
                                  type="button"
                                  onClick={() => toggleGraphicType(item)}
                                  className={`p-5 text-left rounded-none transition-all cursor-pointer border ${
                                    active
                                      ? 'bg-[#003663] border-2 border-[#38bdf8] text-white shadow-lg font-bold'
                                      : 'bg-white/[0.05] hover:bg-white/[0.10] border-white/15 text-white backdrop-blur-md'
                                  }`}
                                >
                                  <h4 className="text-sm sm:text-base font-bold text-white">{item}</h4>
                                </button>
                              );
                            })}

                          {/* IDEA: Backend / Custom Software */}
                          {profileType === 'idea' && service === 'backend' &&
                            [
                              'Turn a new app or software idea into a working product',
                              'Save time by automating repetitive manual work',
                              'Help my team track operations, sales, or data in one place',
                              'Connect payments, WhatsApp, or tools we already use',
                              'Fix or upgrade a system that isn\'t working well',
                            ].map(item => (
                              <button
                                key={item}
                                type="button"
                                onClick={() => setProjectType(item)}
                                className={`p-5 text-left rounded-none transition-all cursor-pointer border ${
                                  projectType === item
                                    ? 'bg-[#003663] border-2 border-[#38bdf8] text-white shadow-lg font-bold'
                                    : 'bg-white/[0.05] hover:bg-white/[0.10] border-white/15 text-white backdrop-blur-md'
                                }`}
                              >
                                <h4 className="text-sm sm:text-base font-bold text-white">{item}</h4>
                              </button>
                            ))}

                          {/* PREPARED: Website */}
                          {profileType === 'prepared' && service === 'website' &&
                            [
                              'Company / Corporate Website',
                              'Landing Page / Campaign Site',
                              'E-Commerce Store',
                              'Web Application / Client Portal',
                              'Portfolio / Showcase Site',
                            ].map(item => (
                              <button
                                key={item}
                                type="button"
                                onClick={() => setProjectType(item)}
                                className={`p-5 text-left rounded-none transition-all cursor-pointer border ${
                                  projectType === item
                                    ? 'bg-[#003663] border-2 border-[#38bdf8] text-white shadow-lg font-bold'
                                    : 'bg-white/[0.05] hover:bg-white/[0.10] border-white/15 text-white backdrop-blur-md'
                                }`}
                              >
                                <h4 className="text-sm sm:text-base font-bold text-white">{item}</h4>
                              </button>
                            ))}

                          {/* PREPARED: Graphic (Multi-select) */}
                          {profileType === 'prepared' && service === 'graphic' &&
                            [
                              'Logo Design',
                              'Full Brand Identity Kit',
                              'Flyer or Poster',
                              'Social Media Graphics Kit',
                              'Pitch Deck / Company Profile',
                              'Packaging / Label Design',
                              'Business Card / Stationery',
                            ].map(item => {
                              const active = selectedGraphicTypes.includes(item);
                              return (
                                <button
                                  key={item}
                                  type="button"
                                  onClick={() => toggleGraphicType(item)}
                                  className={`p-5 text-left rounded-none transition-all cursor-pointer border ${
                                    active
                                      ? 'bg-[#003663] border-2 border-[#38bdf8] text-white shadow-lg font-bold'
                                      : 'bg-white/[0.05] hover:bg-white/[0.10] border-white/15 text-white backdrop-blur-md'
                                  }`}
                                >
                                  <h4 className="text-sm sm:text-base font-bold text-white">{item}</h4>
                                </button>
                              );
                            })}

                          {/* PREPARED: Backend / Custom Software (Multi-select) */}
                          {profileType === 'prepared' && service === 'backend' &&
                            [
                              'Custom Web / Desktop / Mobile Software or SaaS MVP',
                              'Internal Business Tool, Portal, or Admin Dashboard',
                              'Workflow Automation & AI / Bot Integrations',
                              'APIs, Databases & Backend Architecture',
                              'Third-Party Integrations (Payments, SMS, WhatsApp, ERP/CRM)',
                            ].map(item => {
                              const active = selectedBackendTypes.includes(item);
                              return (
                                <button
                                  key={item}
                                  type="button"
                                  onClick={() => toggleBackendType(item)}
                                  className={`p-5 text-left rounded-none transition-all cursor-pointer border ${
                                    active
                                      ? 'bg-[#003663] border-2 border-[#38bdf8] text-white shadow-lg font-bold'
                                      : 'bg-white/[0.05] hover:bg-white/[0.10] border-white/15 text-white backdrop-blur-md'
                                  }`}
                                >
                                  <h4 className="text-sm sm:text-base font-bold text-white">{item}</h4>
                                </button>
                              );
                            })}
                        </div>

                        {/* Optional custom input */}
                        <div className="pt-2">
                          <label className="font-unisans-thin-caps block text-xs sm:text-[13px] uppercase tracking-wider text-slate-300 mb-1.5">
                            Specific deliverable or custom note (optional):
                          </label>
                          <input
                            type="text"
                            value={customProjectType}
                            onChange={e => setCustomProjectType(e.target.value)}
                            placeholder={
                              service === 'graphic'
                                ? 'e.g. 3D logo animation, merchandise apparel design...'
                                : service === 'backend'
                                ? 'e.g. Python FastAPI microservice, Stripe marketplace billing...'
                                : 'e.g. Multi-vendor marketplace, real estate property portal...'
                            }
                            className="w-full px-4 py-3 text-xs sm:text-sm text-white placeholder-slate-400 bg-white/[0.06] border border-white/20 rounded-none focus:outline-none focus:border-[#003663] focus:ring-2 focus:ring-[#38bdf8]/50"
                          />
                        </div>
                      </div>

                      <div className="pt-4 flex justify-center">
                        <button
                          type="button"
                          disabled={
                            service === 'graphic'
                              ? selectedGraphicTypes.length === 0 && !customProjectType.trim() && !projectType
                              : service === 'backend' && profileType === 'prepared'
                              ? selectedBackendTypes.length === 0 && !customProjectType.trim() && !projectType
                              : !projectType && !customProjectType.trim()
                          }
                          onClick={goToNext}
                          className="px-10 py-3.5 text-sm sm:text-base font-bold text-white bg-[#003663] hover:bg-[#002647] border border-[#38bdf8]/40 disabled:opacity-40 disabled:pointer-events-none rounded-none shadow-lg transition-all cursor-pointer"
                        >
                          Next →
                        </button>
                      </div>
                    </div>
                  )}

                  {/* --------------------------------------------------------
                      STEP 5: PREPARED — PROJECT STATUS (NEW / REDESIGN / UPGRADE)
                     -------------------------------------------------------- */}
                  {currentStep === 'projectStatus' && profileType === 'prepared' && (
                    <div className="space-y-2.5 sm:space-y-7">
                      <div>
                        <span className="font-unisans-thin-caps text-[10px] sm:text-[13px] uppercase tracking-widest text-white block mb-2">
                          STEP 4 — PROJECT STAGE
                        </span>
                        <h3 className="font-phenomena text-4xl sm:text-4xl lg:text-[54px] font-bold text-white tracking-tight leading-tight">
                          {service === 'website'
                            ? 'Is this a new website, a redesign, or an upgrade?'
                            : service === 'graphic'
                            ? 'Is this a new brand, a redesign, or an upgrade?'
                            : 'Is this a new build, a redesign, or an upgrade?'}
                        </h3>
                      </div>

                      <div className="space-y-4 pt-1 max-w-2xl mx-auto">
                        <div className="space-y-3.5">
                          {(service === 'website'
                            ? [
                                'Brand new website (building from scratch)',
                                'Full redesign of an existing website',
                                'Upgrade / adding new features to an existing website',
                              ]
                            : service === 'graphic'
                            ? [
                                'Brand new design (starting from scratch)',
                                'Full redesign / complete rebrand',
                                'Upgrade / expanding existing brand assets',
                              ]
                            : [
                                'Brand new system (building from scratch)',
                                'Full redesign / system overhaul of existing software',
                                'Upgrade / adding new features or integrations to existing software',
                              ]
                          ).map(item => (
                            <button
                              key={item}
                              type="button"
                              onClick={() => setProjectStatus(item)}
                              className={`w-full p-5 text-left rounded-none transition-all cursor-pointer border ${
                                projectStatus === item
                                  ? 'bg-[#003663] border-2 border-[#38bdf8] text-white shadow-lg font-bold'
                                  : 'bg-white/[0.05] hover:bg-white/[0.10] border-white/15 text-white backdrop-blur-md'
                              }`}
                            >
                              <h4 className="text-sm sm:text-base font-bold text-white">{item}</h4>
                            </button>
                          ))}
                        </div>

                        {/* Optional details input when redesigning or upgrading */}
                        {projectStatus && !projectStatus.includes('scratch') && (
                          <div className="pt-3 p-4 bg-white/[0.04] border border-white/15 rounded-none space-y-2">
                            <label className="font-unisans-thin-caps block text-xs sm:text-[13px] uppercase tracking-wider text-slate-200 mb-1 flex items-center justify-between flex-wrap gap-1">
                              <span className="flex items-center gap-1.5 text-[#38bdf8] font-bold">
                                <LinkIcon className="w-3.5 h-3.5" />
                                <span>
                                  {service === 'website'
                                    ? 'Current Website URL:'
                                    : service === 'graphic'
                                    ? 'Link to Existing Brand / Asset Folder:'
                                    : 'Codebase, Repository, or Spec Link:'}
                                </span>
                              </span>
                              <span className="text-[10px] text-slate-300 lowercase tracking-normal italic">(Optional)</span>
                            </label>
                            <input
                              type="text"
                              value={projectStatusDetails}
                              onChange={e => setProjectStatusDetails(e.target.value)}
                              placeholder={
                                service === 'website'
                                  ? 'https://yourcurrentwebsite.com'
                                  : service === 'graphic'
                                  ? 'https://drive.google.com/... or Figma link'
                                  : 'https://github.com/... or staging server URL'
                              }
                              className="w-full px-4 py-3 text-xs sm:text-sm text-white placeholder-slate-400 bg-white/[0.06] border border-white/20 rounded-none focus:outline-none focus:border-[#38bdf8] focus:ring-1 focus:ring-[#38bdf8]"
                            />
                          </div>
                        )}
                      </div>

                      <div className="pt-4 flex justify-center">
                        <button
                          type="button"
                          disabled={!projectStatus}
                          onClick={goToNext}
                          className="px-10 py-3.5 text-sm sm:text-base font-bold text-white bg-[#003663] hover:bg-[#002647] border border-[#38bdf8]/40 disabled:opacity-40 disabled:pointer-events-none rounded-none shadow-lg transition-all cursor-pointer"
                        >
                          Next →
                        </button>
                      </div>
                    </div>
                  )}

                  {/* --------------------------------------------------------
                      STEP: PREPARED GRAPHIC — USAGE FORMAT ('usageFormat')
                     -------------------------------------------------------- */}
                  {currentStep === 'usageFormat' && profileType === 'prepared' && service === 'graphic' && (
                    <div className="space-y-2.5 sm:space-y-7">
                      <div>
                        <span className="font-unisans-thin-caps text-[10px] sm:text-[13px] uppercase tracking-widest text-white block mb-2">
                          STEP 5 — USAGE FORMAT
                        </span>
                        <h3 className="font-phenomena text-4xl sm:text-4xl lg:text-[54px] font-bold text-white tracking-tight leading-tight">
                          Where will these designs be used?
                        </h3>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 pt-1">
                        {[
                          { title: 'Digital / Social Media Only', desc: 'Optimized for screens, social profiles, web, and ads.' },
                          { title: 'Print Only (Press-ready)', desc: 'CMYK press-ready vector PDFs, bleed lines, packaging specs.' },
                          { title: 'Both Print & Digital', desc: 'Full package with web formats (RGB) and print deliverables (CMYK).' },
                        ].map(opt => (
                          <button
                            key={opt.title}
                            type="button"
                            onClick={() => setUsageFormat(opt.title)}
                            className={`p-6 sm:p-7 text-left rounded-none transition-all cursor-pointer hover:-translate-y-1 shadow-sm border ${
                              usageFormat === opt.title
                                ? 'bg-[#003663] border-2 border-[#38bdf8] text-white shadow-lg font-bold'
                                : 'bg-white/[0.05] hover:bg-white/[0.10] border-white/15 text-white backdrop-blur-md'
                            }`}
                          >
                            <h4 className="font-display text-base sm:text-lg font-bold text-white mb-1.5">
                              {opt.title}
                            </h4>
                            <p className="text-xs sm:text-[13px] text-slate-300 font-light leading-relaxed">
                              {opt.desc}
                            </p>
                          </button>
                        ))}
                      </div>

                      <div className="pt-4 flex justify-center">
                        <button
                          type="button"
                          disabled={!usageFormat}
                          onClick={goToNext}
                          className="px-10 py-3.5 text-sm sm:text-base font-bold text-white bg-[#003663] hover:bg-[#002647] border border-[#38bdf8]/40 disabled:opacity-40 disabled:pointer-events-none rounded-none shadow-lg transition-all cursor-pointer"
                        >
                          Next →
                        </button>
                      </div>
                    </div>
                  )}

                  {/* --------------------------------------------------------
                      STEP: GRAPHIC — QUANTITY / VOLUME ('quantity')
                     -------------------------------------------------------- */}
                  {currentStep === 'quantity' && service === 'graphic' && (
                    <div className="space-y-2.5 sm:space-y-7">
                      <div>
                        <span className="font-unisans-thin-caps text-[10px] sm:text-[13px] uppercase tracking-widest text-white block mb-2">
                          {profileType === 'idea' ? 'STEP 4 — VOLUME' : 'STEP 6 — VOLUME'}
                        </span>
                        <h3 className="font-phenomena text-4xl sm:text-4xl lg:text-[54px] font-bold text-white tracking-tight leading-tight">
                          How many design pieces do you need?
                        </h3>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-1">
                        {[
                          'Single Piece (1 item)',
                          'Small Set (2–5 pieces)',
                          'Full Campaign / Suite (6+ pieces)',
                          'Ongoing Monthly Support',
                        ].map(opt => (
                          <button
                            key={opt}
                            type="button"
                            onClick={() => setGraphicQuantity(opt)}
                            className={`p-6 text-center rounded-none transition-all cursor-pointer border ${
                              graphicQuantity === opt
                                ? 'bg-[#003663] border-2 border-[#38bdf8] text-white shadow-lg font-bold'
                                : 'bg-white/[0.05] hover:bg-white/[0.10] border-white/15 text-white backdrop-blur-md'
                            }`}
                          >
                            <h4 className="text-base font-bold text-white">{opt}</h4>
                          </button>
                        ))}
                      </div>

                      <div className="pt-4 flex justify-center">
                        <button
                          type="button"
                          disabled={!graphicQuantity}
                          onClick={goToNext}
                          className="px-10 py-3.5 text-sm sm:text-base font-bold text-white bg-[#003663] hover:bg-[#002647] border border-[#38bdf8]/40 disabled:opacity-40 disabled:pointer-events-none rounded-none shadow-lg transition-all cursor-pointer"
                        >
                          Next →
                        </button>
                      </div>
                    </div>
                  )}

                  {/* --------------------------------------------------------
                      STEP: PREPARED GRAPHIC — EXISTING BRAND ASSETS ('brandAssets')
                     -------------------------------------------------------- */}
                  {currentStep === 'brandAssets' && profileType === 'prepared' && service === 'graphic' && (
                    <div className="space-y-2.5 sm:space-y-7">
                      <div>
                        <span className="font-unisans-thin-caps text-[10px] sm:text-[13px] uppercase tracking-widest text-white block mb-2">
                          STEP 7 — EXISTING BRAND ASSETS
                        </span>
                        <h3 className="font-phenomena text-4xl sm:text-4xl lg:text-[54px] font-bold text-white tracking-tight leading-tight">
                          What brand assets do you have on ground?
                        </h3>
                      </div>

                      <div className="space-y-4 pt-1 max-w-2xl mx-auto">
                        <div className="space-y-3">
                          {[
                            'I have a logo, colours, and brand guidelines',
                            'I have old designs that need a refresh',
                            'Starting completely from scratch',
                          ].map(opt => (
                            <button
                              key={opt}
                              type="button"
                              onClick={() => setBrandAssets(opt)}
                              className={`w-full p-5 text-left rounded-none transition-all cursor-pointer border ${
                                brandAssets === opt
                                  ? 'bg-[#003663] border-2 border-[#38bdf8] text-white shadow-lg font-bold'
                                  : 'bg-white/[0.05] hover:bg-white/[0.10] border-white/15 text-white backdrop-blur-md'
                              }`}
                            >
                              <h4 className="text-sm sm:text-base font-bold text-white">{opt}</h4>
                            </button>
                          ))}
                        </div>

                        {brandAssets && !brandAssets.startsWith('Starting') && (
                          <div className="pt-3 p-4 bg-white/[0.04] border border-white/15 rounded-none space-y-2">
                            <label className="font-unisans-thin-caps block text-xs sm:text-[13px] uppercase tracking-wider text-slate-200 mb-1 flex items-center justify-between flex-wrap gap-1">
                              <span className="flex items-center gap-1.5 text-[#38bdf8] font-bold">
                                <LinkIcon className="w-3.5 h-3.5" />
                                <span>Drop Brand Asset Link:</span>
                              </span>
                              <span className="text-[10px] text-slate-300 lowercase tracking-normal italic">(Optional — Google Drive, Figma, Canva, Dropbox, etc.)</span>
                            </label>
                            <input
                              type="url"
                              value={brandAssetsDetails}
                              onChange={e => setBrandAssetsDetails(e.target.value)}
                              placeholder="Paste URL to your logo, brand guidelines, or asset folder..."
                              className="w-full px-4 py-3 text-xs sm:text-sm text-white placeholder-slate-400 bg-white/[0.06] border border-white/20 rounded-none focus:outline-none focus:border-[#38bdf8] focus:ring-1 focus:ring-[#38bdf8]"
                            />
                          </div>
                        )}
                      </div>

                      <div className="pt-4 flex justify-center">
                        <button
                          type="button"
                          disabled={!brandAssets}
                          onClick={goToNext}
                          className="px-10 py-3.5 text-sm sm:text-base font-bold text-white bg-[#003663] hover:bg-[#002647] border border-[#38bdf8]/40 disabled:opacity-40 disabled:pointer-events-none rounded-none shadow-lg transition-all cursor-pointer"
                        >
                          Next →
                        </button>
                      </div>
                    </div>
                  )}

                  {/* --------------------------------------------------------
                      STEP: GOALS & CORE CAPABILITIES ('goals')
                     -------------------------------------------------------- */}
                  {currentStep === 'goals' && (
                    <div className="space-y-2.5 sm:space-y-7">
                      <div>
                        <span className="font-unisans-thin-caps text-[10px] sm:text-[13px] uppercase tracking-widest text-white block mb-2">
                          {service === 'backend' ? 'CORE CAPABILITIES (UP TO 3)' : 'REQUIRED FEATURES (UP TO 3)'}
                        </span>

                        <h3 className="font-phenomena text-4xl sm:text-4xl lg:text-[54px] font-bold text-white tracking-tight leading-tight">
                          {service === 'backend'
                            ? 'Which core capabilities does this system require?'
                            : 'Which features do you need built in?'}
                        </h3>
                      </div>

                      <div className="space-y-4 pt-1">
                        <div className="flex flex-wrap gap-2.5">
                          {(service === 'backend'
                            ? [
                                'User Auth & Role-Based Permissions',
                                'Payment Gateway / Billing Logic',
                                'Admin Dashboard & Reporting',
                                'Automated Alerts (Email, SMS, WhatsApp)',
                                'Database Design & Cloud Storage',
                                'External API / Webhook Integrations',
                              ]
                            : [
                                'Payments / E-Commerce Checkout',
                                'Booking / Appointment Scheduling',
                                'Blog / Self-Editable CMS',
                                'User Login / Client Dashboard',
                                'WhatsApp / CRM / Lead Capture',
                                'Custom Animations / Interactive 3D',
                              ]
                          ).map(tag => {
                            const active = selectedGoals.includes(tag);
                            return (
                              <button
                                key={tag}
                                type="button"
                                onClick={() => toggleGoal(tag)}
                                className={`px-4 py-2.5 rounded-none text-xs sm:text-sm font-medium transition-all duration-200 cursor-pointer border ${
                                  active
                                    ? 'bg-[#003663] border-2 border-[#38bdf8] text-white shadow-md font-semibold'
                                    : 'bg-white/[0.05] hover:bg-white/[0.12] border-white/15 text-slate-200 hover:text-white'
                                }`}
                              >
                                {tag}
                              </button>
                            );
                          })}

                          {!isCustomGoalOpen && (
                            <button
                              type="button"
                              onClick={() => setIsCustomGoalOpen(true)}
                              className="px-4 py-2.5 rounded-none text-xs sm:text-sm font-medium text-[#38bdf8] hover:text-white hover:bg-white/[0.12] bg-white/[0.05] border border-white/15 cursor-pointer transition-colors"
                            >
                              + Other custom capability
                            </button>
                          )}
                        </div>

                        {isCustomGoalOpen && (
                          <div className="w-full pt-1">
                            <input
                              type="text"
                              value={customGoal}
                              onChange={e => setCustomGoal(e.target.value)}
                              placeholder="Any other specific feature, workflow, or integration? (optional)"
                              className="w-full px-4 py-3 text-xs sm:text-sm text-white placeholder-slate-400 bg-white/[0.06] border border-white/20 rounded-none focus:outline-none focus:border-[#003663] focus:ring-2 focus:ring-[#38bdf8]/50"
                            />
                          </div>
                        )}
                      </div>

                      <div className="pt-5 flex justify-center">
                        <button
                          type="button"
                          disabled={selectedGoals.length === 0 && !customGoal.trim()}
                          onClick={goToNext}
                          className="px-10 py-3.5 text-sm sm:text-base font-bold text-white bg-[#003663] hover:bg-[#002647] border border-[#38bdf8]/40 disabled:opacity-40 disabled:pointer-events-none rounded-none shadow-lg transition-all cursor-pointer"
                        >
                          Next →
                        </button>
                      </div>
                    </div>
                  )}

                  {/* --------------------------------------------------------
                      STEP: PREPARED WEBSITE — SCOPE ('scope')
                     -------------------------------------------------------- */}
                  {currentStep === 'scope' && profileType === 'prepared' && service === 'website' && (
                    <div className="space-y-2.5 sm:space-y-7">
                      <div>
                        <span className="font-unisans-thin-caps text-[10px] sm:text-[13px] uppercase tracking-widest text-white block mb-2">
                          PAGES / ESTIMATED SIZE
                        </span>
                        <h3 className="font-phenomena text-4xl sm:text-4xl lg:text-[54px] font-bold text-white tracking-tight leading-tight">
                          Roughly how many pages or screens?
                        </h3>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 pt-1">
                        {[
                          '1-Page Landing Page',
                          '2–5 Pages',
                          '6–10+ Pages',
                          'Multi-Screen Web App',
                          'Not sure yet',
                        ].map(opt => (
                          <button
                            key={opt}
                            type="button"
                            onClick={() => setScopePages(opt)}
                            className={`p-6 text-center rounded-none transition-all cursor-pointer border ${
                              scopePages === opt
                                ? 'bg-[#003663] border-2 border-[#38bdf8] text-white shadow-lg font-bold'
                                : 'bg-white/[0.05] hover:bg-white/[0.10] border-white/15 text-white backdrop-blur-md'
                            }`}
                          >
                            <h4 className="text-sm sm:text-base font-bold text-white">{opt}</h4>
                          </button>
                        ))}
                      </div>

                      <div className="pt-4 flex justify-center">
                        <button
                          type="button"
                          disabled={!scopePages}
                          onClick={goToNext}
                          className="px-10 py-3.5 text-sm sm:text-base font-bold text-white bg-[#003663] hover:bg-[#002647] border border-[#38bdf8]/40 disabled:opacity-40 disabled:pointer-events-none rounded-none shadow-lg transition-all cursor-pointer"
                        >
                          Next →
                        </button>
                      </div>
                    </div>
                  )}

                  {/* --------------------------------------------------------
                      STEP: PREPARED — CONTENT READINESS ('contentReadiness')
                     -------------------------------------------------------- */}
                  {currentStep === 'contentReadiness' && profileType === 'prepared' && (
                    <div className="space-y-2.5 sm:space-y-7">
                      <div>
                        <span className="font-unisans-thin-caps text-[10px] sm:text-[13px] uppercase tracking-widest text-white block mb-2">
                          {service === 'graphic' ? 'TEXT & PHOTO READINESS' : 'CONTENT & ASSETS'}
                        </span>
                        <h3 className="font-phenomena text-4xl sm:text-4xl lg:text-[54px] font-bold text-white tracking-tight leading-tight">
                          {service === 'graphic'
                            ? 'Are the exact wording and photos ready?'
                            : 'Which materials do you already have ready?'}
                        </h3>
                      </div>

                      {service === 'graphic' ? (
                        <div className="space-y-3.5 pt-1 max-w-2xl mx-auto">
                          {[
                            'Yes — final text/wording and photos are ready',
                            'I have rough text/ideas, need help polishing them',
                            'No — I need VDVC to come up with the copy and imagery',
                          ].map(opt => (
                            <button
                              key={opt}
                              type="button"
                              onClick={() => setProjectType(opt)}
                              className={`w-full p-5 text-left rounded-none transition-all cursor-pointer border ${
                                projectType === opt
                                  ? 'bg-[#003663] border-2 border-[#38bdf8] text-white shadow-lg font-bold'
                                  : 'bg-white/[0.05] hover:bg-white/[0.10] border-white/15 text-white backdrop-blur-md'
                              }`}
                            >
                              <h4 className="text-sm sm:text-base font-bold text-white">{opt}</h4>
                            </button>
                          ))}
                        </div>
                      ) : (
                        <div className="space-y-4 pt-1 max-w-2xl mx-auto">
                          <div className="space-y-3">
                            {[
                              'Logo & Brand Guidelines',
                              'Written Text / Page Copy',
                              'Product or Business Photos',
                              'UI Wireframes / Figma Design',
                              'None yet — need VDVC to create copy & assets',
                            ].map(opt => {
                              const active = contentReadiness.includes(opt);
                              return (
                                <button
                                  key={opt}
                                  type="button"
                                  onClick={() => toggleContentReadiness(opt)}
                                  className={`w-full p-5 text-left rounded-none transition-all cursor-pointer border ${
                                    active
                                      ? 'bg-[#003663] border-2 border-[#38bdf8] text-white shadow-lg font-bold'
                                      : 'bg-white/[0.05] hover:bg-white/[0.10] border-white/15 text-white backdrop-blur-md'
                                  }`}
                                >
                                  <h4 className="text-sm sm:text-base font-bold text-white">{opt}</h4>
                                </button>
                              );
                            })}
                          </div>

                          {contentReadiness.length > 0 && !contentReadiness[0]?.startsWith('None yet') && (
                            <div className="pt-3 p-4 bg-white/[0.04] border border-white/15 rounded-none space-y-2">
                              <label className="font-unisans-thin-caps block text-xs sm:text-[13px] uppercase tracking-wider text-slate-200 mb-1 flex items-center justify-between flex-wrap gap-1">
                                <span className="flex items-center gap-1.5 text-[#38bdf8] font-bold">
                                  <LinkIcon className="w-3.5 h-3.5" />
                                  <span>Drop Asset / Drive / Figma Link:</span>
                                </span>
                                <span className="text-[10px] text-slate-300 lowercase tracking-normal italic">(Optional)</span>
                              </label>
                              <input
                                type="url"
                                value={contentReadinessLink}
                                onChange={e => setContentReadinessLink(e.target.value)}
                                placeholder="Paste Google Drive, Dropbox, or Figma link..."
                                className="w-full px-4 py-3 text-xs sm:text-sm text-white placeholder-slate-400 bg-white/[0.06] border border-white/20 rounded-none focus:outline-none focus:border-[#38bdf8] focus:ring-1 focus:ring-[#38bdf8]"
                              />
                            </div>
                          )}
                        </div>
                      )}

                      <div className="pt-4 flex justify-center">
                        <button
                          type="button"
                          disabled={service === 'graphic' ? !projectType : contentReadiness.length === 0}
                          onClick={goToNext}
                          className="px-10 py-3.5 text-sm sm:text-base font-bold text-white bg-[#003663] hover:bg-[#002647] border border-[#38bdf8]/40 disabled:opacity-40 disabled:pointer-events-none rounded-none shadow-lg transition-all cursor-pointer"
                        >
                          Next →
                        </button>
                      </div>
                    </div>
                  )}

                  {/* --------------------------------------------------------
                      STEP: PREPARED WEBSITE — DOMAIN & HOSTING ('domainHosting')
                     -------------------------------------------------------- */}
                  {currentStep === 'domainHosting' && profileType === 'prepared' && service === 'website' && (
                    <div className="space-y-2.5 sm:space-y-7">
                      <div>
                        <span className="font-unisans-thin-caps text-[10px] sm:text-[13px] uppercase tracking-widest text-white block mb-2">
                          DOMAIN & HOSTING
                        </span>
                        <h3 className="font-phenomena text-4xl sm:text-4xl lg:text-[54px] font-bold text-white tracking-tight leading-tight">
                          Do you have a domain name and hosting set up?
                        </h3>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1 max-w-2xl mx-auto">
                        {[
                          { title: 'Yes — I have both domain and hosting', desc: 'Ready for DNS connection and live deployment.' },
                          { title: 'I only have a domain name', desc: 'Need VDVC to handle cloud hosting and server configuration.' },
                          { title: 'No — I need VDVC to handle both', desc: 'We will register domain and provision cloud infrastructure.' },
                          { title: 'Not sure — advise me', desc: 'We will recommend the most reliable, cost-effective setup.' },
                        ].map(opt => (
                          <button
                            key={opt.title}
                            type="button"
                            onClick={() => setDomainHosting(opt.title)}
                            className={`p-6 text-left rounded-none transition-all cursor-pointer border ${
                              domainHosting === opt.title
                                ? 'bg-[#003663] border-2 border-[#38bdf8] text-white shadow-lg font-bold'
                                : 'bg-white/[0.05] hover:bg-white/[0.10] border-white/15 text-white backdrop-blur-md'
                            }`}
                          >
                            <h4 className="text-sm sm:text-base font-bold text-white mb-1.5">{opt.title}</h4>
                            <p className="text-xs text-slate-300 font-light leading-relaxed">{opt.desc}</p>
                          </button>
                        ))}
                      </div>

                      <div className="pt-4 flex justify-center">
                        <button
                          type="button"
                          disabled={!domainHosting}
                          onClick={goToNext}
                          className="px-10 py-3.5 text-sm sm:text-base font-bold text-white bg-[#003663] hover:bg-[#002647] border border-[#38bdf8]/40 disabled:opacity-40 disabled:pointer-events-none rounded-none shadow-lg transition-all cursor-pointer"
                        >
                          Next →
                        </button>
                      </div>
                    </div>
                  )}

                  {/* --------------------------------------------------------
                      STEP: DESIGN DIRECTION & REFS ('feel')
                     -------------------------------------------------------- */}
                  {currentStep === 'feel' && (
                    <div className="space-y-2.5 sm:space-y-7">
                      <div>
                        <span className="font-unisans-thin-caps text-[10px] sm:text-[13px] uppercase tracking-widest text-white block mb-2">
                          DESIGN DIRECTION & MOOD
                        </span>
                        <h3 className="font-phenomena text-4xl sm:text-4xl lg:text-[54px] font-bold text-white tracking-tight leading-tight">
                          {profileType === 'idea'
                            ? service === 'graphic'
                              ? 'What impression should your design give?'
                              : 'How should your website feel to visitors?'
                            : 'Do you have visual references or a specific style in mind?'}
                        </h3>
                      </div>

                      {/* IDEA: Website feel options */}
                      {profileType === 'idea' && service === 'website' && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 pt-1">
                          {[
                            'Clean & Professional',
                            'Bold & Energetic',
                            'Warm & Friendly',
                            'Minimal & Elegant',
                            'Dark & High-Craft',
                            'Surprise me — recommend what fits best',
                          ].map(item => (
                            <button
                              key={item}
                              type="button"
                              onClick={() => setFeelMood(item)}
                              className={`p-5 text-left rounded-none transition-all cursor-pointer border ${
                                feelMood === item
                                  ? 'bg-[#003663] border-2 border-[#38bdf8] text-white shadow-lg font-bold'
                                  : 'bg-white/[0.05] hover:bg-white/[0.10] border-white/15 text-white backdrop-blur-md'
                              }`}
                            >
                              <h4 className="text-sm sm:text-base font-bold text-white">{item}</h4>
                            </button>
                          ))}
                        </div>
                      )}

                      {/* IDEA: Graphic feel options */}
                      {profileType === 'idea' && service === 'graphic' && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 pt-1">
                          {[
                            'Serious & Trustworthy',
                            'Bold & Exciting',
                            'Premium & High-End',
                            'Warm & Approachable',
                            'Minimal & Modern',
                            'Not sure — just make it look great',
                          ].map(item => (
                            <button
                              key={item}
                              type="button"
                              onClick={() => setFeelMood(item)}
                              className={`p-5 text-left rounded-none transition-all cursor-pointer border ${
                                feelMood === item
                                  ? 'bg-[#003663] border-2 border-[#38bdf8] text-white shadow-lg font-bold'
                                  : 'bg-white/[0.05] hover:bg-white/[0.10] border-white/15 text-white backdrop-blur-md'
                              }`}
                            >
                              <h4 className="text-sm sm:text-base font-bold text-white">{item}</h4>
                            </button>
                          ))}
                        </div>
                      )}

                      {/* PREPARED: Design direction selection */}
                      {profileType === 'prepared' && (
                        <div className="space-y-4 pt-1 max-w-3xl mx-auto">
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <button
                              type="button"
                              onClick={() => setDesignDirectionChoice('references')}
                              className={`p-5 text-left rounded-none transition-all cursor-pointer border ${
                                designDirectionChoice === 'references'
                                  ? 'bg-[#003663] border-2 border-[#38bdf8] text-white shadow-lg font-bold'
                                  : 'bg-white/[0.05] hover:bg-white/[0.10] border-white/15 text-white backdrop-blur-md'
                              }`}
                            >
                              <h4 className="text-sm sm:text-base font-bold text-white mb-1.5">
                                I have references or a style guide
                              </h4>
                              <p className="text-xs text-slate-300 font-light">
                                Links to websites, Figma, Pinterest, or Drive.
                              </p>
                            </button>

                            <button
                              type="button"
                              onClick={() => setDesignDirectionChoice('idea')}
                              className={`p-5 text-left rounded-none transition-all cursor-pointer border ${
                                designDirectionChoice === 'idea'
                                  ? 'bg-[#003663] border-2 border-[#38bdf8] text-white shadow-lg font-bold'
                                  : 'bg-white/[0.05] hover:bg-white/[0.10] border-white/15 text-white backdrop-blur-md'
                              }`}
                            >
                              <h4 className="text-sm sm:text-base font-bold text-white mb-1.5">
                                I have a specific aesthetic in mind
                              </h4>
                              <p className="text-xs text-slate-300 font-light">
                                Describe colors, typography, mood, or vibes.
                              </p>
                            </button>

                            <button
                              type="button"
                              onClick={() => setDesignDirectionChoice('surprise')}
                              className={`p-5 text-left rounded-none transition-all cursor-pointer border ${
                                designDirectionChoice === 'surprise'
                                  ? 'bg-[#003663] border-2 border-[#38bdf8] text-white shadow-lg font-bold'
                                  : 'bg-white/[0.05] hover:bg-white/[0.10] border-white/15 text-white backdrop-blur-md'
                              }`}
                            >
                              <h4 className="text-sm sm:text-base font-bold text-white mb-1.5">
                                Start from scratch — surprise me
                              </h4>
                              <p className="text-xs text-slate-300 font-light">
                                Full creative direction left to VDVC.
                              </p>
                            </button>
                          </div>

                          {designDirectionChoice === 'references' && (
                            <div className="pt-2">
                              <label className="font-unisans-thin-caps block text-xs sm:text-[13px] uppercase tracking-wider text-slate-300 mb-1.5 flex items-center gap-1.5">
                                <LinkIcon className="w-3.5 h-3.5 text-[#38bdf8]" />
                                <span>Paste reference link or file URL:</span>
                              </label>
                              <input
                                type="url"
                                value={referenceWebsiteLink}
                                onChange={e => setReferenceWebsiteLink(e.target.value)}
                                placeholder="https://example.com, Figma, or Google Drive link..."
                                className="w-full px-4 py-3 text-xs sm:text-sm text-white placeholder-slate-400 bg-white/[0.06] border border-white/20 rounded-none focus:outline-none focus:border-[#003663] focus:ring-2 focus:ring-[#38bdf8]/50"
                              />
                            </div>
                          )}

                          {designDirectionChoice === 'idea' && (
                            <div className="pt-2">
                              <label className="font-unisans-thin-caps block text-xs sm:text-[13px] uppercase tracking-wider text-slate-300 mb-1.5">
                                Describe your aesthetic & mood:
                              </label>
                              <textarea
                                rows={2}
                                value={feelDescription}
                                onChange={e => setFeelDescription(e.target.value)}
                                placeholder="Describe the aesthetic, colors, typography, or feeling..."
                                className="w-full p-3.5 text-xs sm:text-sm text-white placeholder-slate-400 bg-white/[0.06] border border-white/20 rounded-none focus:outline-none focus:border-[#003663] focus:ring-2 focus:ring-[#38bdf8]/50"
                              />
                            </div>
                          )}
                        </div>
                      )}

                      <div className="pt-4 flex justify-center">
                        <button
                          type="button"
                          disabled={profileType === 'prepared' ? !designDirectionChoice : !feelMood}
                          onClick={goToNext}
                          className="px-10 py-3.5 text-sm sm:text-base font-bold text-white bg-[#003663] hover:bg-[#002647] border border-[#38bdf8]/40 disabled:opacity-40 disabled:pointer-events-none rounded-none shadow-lg transition-all cursor-pointer"
                        >
                          Next →
                        </button>
                      </div>
                    </div>
                  )}

                  {/* --------------------------------------------------------
                      STEP: IDEA — WHAT'S READY ('existingAssets')
                     -------------------------------------------------------- */}
                  {currentStep === 'existingAssets' && profileType === 'idea' && (
                    <div className="space-y-2.5 sm:space-y-7">
                      <div>
                        <span className="font-unisans-thin-caps text-[10px] sm:text-[13px] uppercase tracking-widest text-white block mb-2">
                          WHAT YOU HAVE READY
                        </span>
                        <h3 className="font-phenomena text-4xl sm:text-4xl lg:text-[54px] font-bold text-white tracking-tight leading-tight">
                          {service === 'backend'
                            ? 'What do you have in place right now?'
                            : service === 'graphic'
                            ? 'What do you already have for this design?'
                            : 'What do you already have in place?'}
                        </h3>
                      </div>

                      <div className="space-y-3.5 pt-1 max-w-2xl mx-auto">
                        {service === 'backend' ? (
                          <div className="space-y-3">
                            {[
                              'Just the idea — we need to map it out from scratch',
                              'Written notes, sketches, or a rough document',
                              'Spreadsheets or manual workflows we currently use',
                              'An existing website or app that needs this built in',
                            ].map(item => (
                              <button
                                key={item}
                                type="button"
                                onClick={() => setExistingAssetsSingle(item)}
                                className={`w-full p-5 text-left rounded-none transition-all cursor-pointer border ${
                                  existingAssetsSingle === item
                                    ? 'bg-[#003663] border-2 border-[#38bdf8] text-white shadow-lg font-bold'
                                    : 'bg-white/[0.05] hover:bg-white/[0.10] border-white/15 text-white backdrop-blur-md'
                                }`}
                              >
                                <h4 className="text-sm sm:text-base font-bold text-white">{item}</h4>
                              </button>
                            ))}
                          </div>
                        ) : (
                          <div className="space-y-3">
                            {(service === 'graphic'
                              ? [
                                  'I already have a logo and brand colours',
                                  'I have the exact text / wording ready',
                                  'I have photos or product images to include',
                                  'I have old designs that need a refresh',
                                  'Nothing yet — starting completely from scratch',
                                ]
                              : [
                                  'Logo or brand colours',
                                  'Written text about my business / services',
                                  'Photos of my products, work, or team',
                                  'An old website we are replacing',
                                  'Nothing yet — we\'re starting from scratch',
                                ]
                            ).map(item => {
                              const active = selectedExistingAssets.includes(item);
                              return (
                                <button
                                  key={item}
                                  type="button"
                                  onClick={() => toggleExistingAsset(item)}
                                  className={`w-full p-5 text-left rounded-none transition-all cursor-pointer border ${
                                    active
                                      ? 'bg-[#003663] border-2 border-[#38bdf8] text-white shadow-lg font-bold'
                                      : 'bg-white/[0.05] hover:bg-white/[0.10] border-white/15 text-white backdrop-blur-md'
                                  }`}
                                >
                                  <h4 className="text-sm sm:text-base font-bold text-white">{item}</h4>
                                </button>
                              );
                            })}
                          </div>
                        )}

                        <div className="pt-3 p-4 bg-white/[0.04] border border-white/15 rounded-none space-y-2">
                          <label className="font-unisans-thin-caps block text-xs sm:text-[13px] uppercase tracking-wider text-slate-200 mb-1 flex items-center justify-between flex-wrap gap-1">
                            <span className="flex items-center gap-1.5 text-[#38bdf8] font-bold">
                              <LinkIcon className="w-3.5 h-3.5" />
                              <span>Drop Link or Folder:</span>
                            </span>
                            <span className="text-[10px] text-slate-300 lowercase tracking-normal italic">(Optional — Google Drive, Dropbox, Figma, Canva, etc.)</span>
                          </label>
                          <input
                            type="url"
                            value={existingAssetsDetails}
                            onChange={e => setExistingAssetsDetails(e.target.value)}
                            placeholder="Paste URL to your asset folder, drive, reference or document..."
                            className="w-full px-4 py-3 text-xs sm:text-sm text-white placeholder-slate-400 bg-white/[0.06] border border-white/20 rounded-none focus:outline-none focus:border-[#38bdf8] focus:ring-1 focus:ring-[#38bdf8]"
                          />
                        </div>
                      </div>

                      <div className="pt-4 flex justify-center">
                        <button
                          type="button"
                          disabled={service === 'backend' ? !existingAssetsSingle : selectedExistingAssets.length === 0}
                          onClick={goToNext}
                          className="px-10 py-3.5 text-sm sm:text-base font-bold text-white bg-[#003663] hover:bg-[#002647] border border-[#38bdf8]/40 disabled:opacity-40 disabled:pointer-events-none rounded-none shadow-lg transition-all cursor-pointer"
                        >
                          Next →
                        </button>
                      </div>
                    </div>
                  )}

                  {/* --------------------------------------------------------
                      STEP: PREPARED BACKEND — TECH PREFERENCES ('techPreferences')
                     -------------------------------------------------------- */}
                  {currentStep === 'techPreferences' && profileType === 'prepared' && service === 'backend' && (
                    <div className="space-y-2.5 sm:space-y-7">
                      <div>
                        <span className="font-unisans-thin-caps text-[10px] sm:text-[13px] uppercase tracking-widest text-white block mb-2">
                          TECH STACK & SPECS
                        </span>
                        <h3 className="font-phenomena text-4xl sm:text-4xl lg:text-[54px] font-bold text-white tracking-tight leading-tight">
                          Do you have a preferred tech stack or spec document?
                        </h3>
                      </div>

                      <div className="space-y-4 pt-1 max-w-2xl mx-auto">
                        <div className="space-y-3">
                          {[
                            'Recommend the best stack for my requirements',
                            'I have a preferred tech stack',
                            'Must match our existing codebase',
                          ].map(opt => (
                            <button
                              key={opt}
                              type="button"
                              onClick={() => setTechStackChoice(opt)}
                              className={`w-full p-5 text-left rounded-none transition-all cursor-pointer border ${
                                techStackChoice === opt
                                  ? 'bg-[#003663] border-2 border-[#38bdf8] text-white shadow-lg font-bold'
                                  : 'bg-white/[0.05] hover:bg-white/[0.10] border-white/15 text-white backdrop-blur-md'
                              }`}
                            >
                              <h4 className="text-sm sm:text-base font-bold text-white">{opt}</h4>
                            </button>
                          ))}
                        </div>

                        {(techStackChoice.includes('preferred') || techStackChoice.includes('existing')) && (
                          <div className="pt-2">
                            <label className="font-unisans-thin-caps block text-xs sm:text-[13px] uppercase tracking-wider text-slate-300 mb-1.5">
                              Specify your stack or repository details:
                            </label>
                            <input
                              type="text"
                              value={techStackDetails}
                              onChange={e => setTechStackDetails(e.target.value)}
                              placeholder="e.g. Node.js, Express, PostgreSQL, Supabase, Python, Next.js..."
                              className="w-full px-4 py-3 text-xs sm:text-sm text-white placeholder-slate-400 bg-white/[0.06] border border-white/20 rounded-none focus:outline-none focus:border-[#003663]"
                            />
                          </div>
                        )}
                      </div>

                      <div className="pt-4 flex justify-center">
                        <button
                          type="button"
                          disabled={!techStackChoice}
                          onClick={goToNext}
                          className="px-10 py-3.5 text-sm sm:text-base font-bold text-white bg-[#003663] hover:bg-[#002647] border border-[#38bdf8]/40 disabled:opacity-40 disabled:pointer-events-none rounded-none shadow-lg transition-all cursor-pointer"
                        >
                          Next →
                        </button>
                      </div>
                    </div>
                  )}

                  {/* --------------------------------------------------------
                      STEP: TIMELINE ('timeline')
                     -------------------------------------------------------- */}
                  {currentStep === 'timeline' && (
                    <div className="space-y-2.5 sm:space-y-7">
                      <div>
                        <span className="font-unisans-thin-caps text-[10px] sm:text-[13px] uppercase tracking-widest text-white block mb-2">
                          TIMELINE & DELIVERY
                        </span>
                        <h3 className="font-phenomena text-4xl sm:text-4xl lg:text-[54px] font-bold text-white tracking-tight leading-tight">
                          When do you need this delivered?
                        </h3>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 pt-1">
                        <button
                          type="button"
                          onClick={() => setTimelineType('asap')}
                          className={`p-6 sm:p-7 text-left rounded-none transition-all cursor-pointer hover:-translate-y-1 shadow-sm border ${
                            timelineType === 'asap'
                              ? 'bg-[#003663] border-2 border-[#38bdf8] text-white shadow-lg font-bold'
                              : 'bg-white/[0.05] hover:bg-white/[0.10] border-white/15 text-white backdrop-blur-md'
                          }`}
                        >
                          <h4 className="font-display text-base sm:text-lg font-bold text-white mb-1.5">
                            As soon as possible
                          </h4>
                          <p className="text-xs sm:text-[13px] text-slate-300 font-light leading-relaxed">
                            We&apos;ll prioritize this and move fast.
                          </p>
                        </button>

                        <button
                          type="button"
                          onClick={() => setTimelineType('weeks')}
                          className={`p-6 sm:p-7 text-left rounded-none transition-all cursor-pointer hover:-translate-y-1 shadow-sm border ${
                            timelineType === 'weeks'
                              ? 'bg-[#003663] border-2 border-[#38bdf8] text-white shadow-lg font-bold'
                              : 'bg-white/[0.05] hover:bg-white/[0.10] border-white/15 text-white backdrop-blur-md'
                          }`}
                        >
                          <h4 className="font-display text-base sm:text-lg font-bold text-white mb-1.5">
                            Set target weeks (1–8 weeks)
                          </h4>
                          <p className="text-xs sm:text-[13px] text-slate-300 font-light leading-relaxed">
                            Specify your target delivery window.
                          </p>
                        </button>

                        <button
                          type="button"
                          onClick={() => setTimelineType('flexible')}
                          className={`p-6 sm:p-7 text-left rounded-none transition-all cursor-pointer hover:-translate-y-1 shadow-sm border ${
                            timelineType === 'flexible'
                              ? 'bg-[#003663] border-2 border-[#38bdf8] text-white shadow-lg font-bold'
                              : 'bg-white/[0.05] hover:bg-white/[0.10] border-white/15 text-white backdrop-blur-md'
                          }`}
                        >
                          <h4 className="font-display text-base sm:text-lg font-bold text-white mb-1.5">
                            Flexible
                          </h4>
                          <p className="text-xs sm:text-[13px] text-slate-300 font-light leading-relaxed">
                            Quality first. Whenever it&apos;s ready.
                          </p>
                        </button>
                      </div>

                      {/* Slider when 'weeks' selected */}
                      {timelineType === 'weeks' && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          className="p-6 bg-white/[0.05] border border-white/15 rounded-none max-w-xl mx-auto space-y-4"
                        >
                          <div className="flex items-center justify-between">
                            <label className="font-unisans-thin-caps text-xs uppercase tracking-wider text-slate-300">
                              Target delivery window
                            </label>
                            <span className="text-base sm:text-lg font-bold text-[#38bdf8] font-mono-numbers">
                              {timelineWeeks} {timelineWeeks === 1 ? 'Week' : 'Weeks'}
                            </span>
                          </div>
                          <input
                            type="range"
                            min={1}
                            max={8}
                            step={1}
                            value={timelineWeeks}
                            onChange={e => setTimelineWeeks(Number(e.target.value))}
                            className="w-full h-2 bg-white/20 rounded-none appearance-none cursor-pointer accent-[#003663]"
                          />
                          <div className="flex justify-between text-[11px] text-slate-400 font-mono-numbers">
                            <span>1 Week</span>
                            <span>4 Weeks</span>
                            <span>8 Weeks</span>
                          </div>
                        </motion.div>
                      )}

                      <div className="pt-4 flex justify-center">
                        <button
                          type="button"
                          disabled={!timelineType}
                          onClick={goToNext}
                          className="px-10 py-3.5 text-sm sm:text-base font-bold text-white bg-[#003663] hover:bg-[#002647] border border-[#38bdf8]/40 disabled:opacity-40 disabled:pointer-events-none rounded-none shadow-lg transition-all cursor-pointer"
                        >
                          Next →
                        </button>
                      </div>
                    </div>
                  )}

                  {/* --------------------------------------------------------
                      STEP: BUDGET ('budget')
                     -------------------------------------------------------- */}
                  {currentStep === 'budget' && (
                    <div className="space-y-2.5 sm:space-y-7">
                      <div>
                        <span className="font-unisans-thin-caps text-[10px] sm:text-[13px] uppercase tracking-widest text-white block mb-2">
                          INVESTMENT & BUDGET
                        </span>
                        <h3 className="font-phenomena text-4xl sm:text-4xl lg:text-[54px] font-bold text-white tracking-tight leading-tight">
                          What budget range are you working with?
                        </h3>
                        <p className="text-xs sm:text-sm text-slate-300 font-light mt-1.5">
                          Slide to choose an exact budget or type your specific amount up to ₦10,000,000+.
                        </p>
                      </div>

                      <div className="space-y-4 pt-1 max-w-2xl mx-auto">
                        {/* Interactive exact budget slider */}
                        <div
                          onClick={() => setBudgetType('exact')}
                          className={`p-6 text-left rounded-none transition-all cursor-pointer border ${
                            budgetType === 'exact'
                              ? 'bg-[#003663] border-2 border-[#38bdf8] text-white shadow-lg'
                              : 'bg-white/[0.05] hover:bg-white/[0.10] border-white/15 text-white backdrop-blur-md'
                          }`}
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                            <div>
                              <h4 className="text-base font-bold text-white">
                                Target Budget
                              </h4>
                            </div>

                            {/* Direct editable numeric input with COMMA SEPARATION */}
                            <div className="flex items-center gap-1.5 bg-black/40 px-3 py-1.5 border border-white/20">
                              <span className="text-sm font-bold text-[#38bdf8]">₦</span>
                              <input
                                type="text"
                                value={exactBudgetAmount ? exactBudgetAmount.toLocaleString('en-US') : ''}
                                onChange={e => {
                                  const raw = e.target.value.replace(/[^0-9]/g, '');
                                  const num = Math.min(50000000, Number(raw) || 0);
                                  setExactBudgetAmount(num);
                                  setBudgetType('exact');
                                }}
                                className="w-36 bg-transparent text-right font-mono-numbers font-bold text-base sm:text-lg text-[#38bdf8] focus:outline-none"
                                placeholder="e.g. 2,800,000"
                              />
                            </div>
                          </div>

                          {/* Continuous Slider up to 10M */}
                          <input
                            type="range"
                            min={service === 'graphic' ? 20000 : 50000}
                            max={10000000}
                            step={service === 'graphic' ? 5000 : 10000}
                            value={Math.min(10000000, Math.max(service === 'graphic' ? 20000 : 50000, exactBudgetAmount))}
                            onChange={e => {
                              setExactBudgetAmount(Number(e.target.value));
                              setBudgetType('exact');
                            }}
                            className="w-full h-2.5 bg-white/20 rounded-none appearance-none cursor-pointer accent-[#38bdf8]"
                          />

                          {/* Benchmark indicators */}
                          <div className="flex justify-between text-[11px] text-slate-300 font-mono-numbers mt-2.5">
                            <span>{service === 'graphic' ? '₦20k' : '₦50k'}</span>
                            <span>₦1M</span>
                            <span>₦2.5M</span>
                            <span>₦5M</span>
                            <span>₦7.5M</span>
                            <span>₦10M+</span>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                          <button
                            type="button"
                            onClick={() => setBudgetType('below')}
                            className={`p-5 text-left rounded-none transition-all cursor-pointer border ${
                              budgetType === 'below'
                                ? 'bg-[#003663] border-2 border-[#38bdf8] text-white shadow-lg font-bold'
                                : 'bg-white/[0.05] hover:bg-white/[0.10] border-white/15 text-white backdrop-blur-md'
                            }`}
                          >
                            <h4 className="text-sm sm:text-base font-bold text-white">
                              Below your minimum
                            </h4>
                            <p className="text-xs text-slate-300 font-light mt-1">
                              Under {service === 'graphic' ? '₦20,000' : '₦50,000'} starter package.
                            </p>
                          </button>

                          <button
                            type="button"
                            onClick={() => setBudgetType('idea')}
                            className={`p-5 text-left rounded-none transition-all cursor-pointer border ${
                              budgetType === 'idea'
                                ? 'bg-[#003663] border-2 border-[#38bdf8] text-white shadow-lg font-bold'
                                : 'bg-white/[0.05] hover:bg-white/[0.10] border-white/15 text-white backdrop-blur-md'
                            }`}
                          >
                            <h4 className="text-sm sm:text-base font-bold text-white">
                              Not sure yet — send a quote
                            </h4>
                            <p className="text-xs text-slate-300 font-light mt-1">
                              Quote based on required deliverables.
                            </p>
                          </button>
                        </div>
                      </div>

                      <div className="pt-5 flex justify-center">
                        <button
                          type="button"
                          disabled={!budgetType}
                          onClick={goToNext}
                          className="px-10 py-3.5 text-sm sm:text-base font-bold text-white bg-[#003663] hover:bg-[#002647] border border-[#38bdf8]/40 disabled:opacity-40 disabled:pointer-events-none rounded-none shadow-lg transition-all cursor-pointer"
                        >
                          Next →
                        </button>
                      </div>
                    </div>
                  )}

                  {/* --------------------------------------------------------
                      STEP: CONTACT DETAILS ('contact')
                     -------------------------------------------------------- */}
                  {currentStep === 'contact' && (
                    <div className="space-y-2.5 sm:space-y-7">
                      <div>
                        <span className="font-unisans-thin-caps text-[10px] sm:text-[13px] uppercase tracking-widest text-white block mb-2">
                          THANKS FOR CHOOSING US —
                        </span>
                        <h3 className="font-phenomena text-4xl sm:text-4xl lg:text-[54px] font-bold text-white tracking-tight leading-tight">
                          Where should we send your summary?
                        </h3>
                        <p className="text-xs sm:text-sm text-slate-300 font-light mt-1.5">
                          We&apos;ll use this to set up your brief and reach out to you directly. No spam, ever.
                        </p>
                      </div>

                      <form onSubmit={handleFinalSubmit} className="space-y-5 pt-1 max-w-2xl mx-auto">
                        <div>
                          <label className="font-unisans-thin-caps block text-xs sm:text-[13px] uppercase tracking-wider text-slate-200 mb-2">
                            Your Full Name
                          </label>
                          <input
                            type="text"
                            required
                            value={fullName}
                            onChange={e => setFullName(e.target.value)}
                            placeholder="e.g. Amara Johnson"
                            className="w-full px-4 py-3.5 text-sm sm:text-base text-white placeholder-slate-400 bg-white/[0.06] hover:bg-white/[0.09] border border-white/15 rounded-none focus:outline-none focus:border-[#003663] focus:ring-2 focus:ring-[#38bdf8]/50 transition-all"
                          />
                        </div>

                        <div>
                          <label className="font-unisans-thin-caps block text-xs sm:text-[13px] uppercase tracking-wider text-slate-200 mb-2">
                            Email Address
                          </label>
                          <input
                            type="email"
                            required
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            placeholder="e.g. amara@example.com"
                            className="w-full px-4 py-3.5 text-sm sm:text-base text-white placeholder-slate-400 bg-white/[0.06] hover:bg-white/[0.09] border border-white/15 rounded-none focus:outline-none focus:border-[#003663] focus:ring-2 focus:ring-[#38bdf8]/50 transition-all"
                          />
                        </div>

                        <div>
                          <label className="font-unisans-thin-caps block text-xs sm:text-[13px] uppercase tracking-wider text-slate-200 mb-2">
                            Phone Number
                          </label>
                          <input
                            type="tel"
                            value={phone}
                            onChange={e => setPhone(e.target.value)}
                            placeholder="e.g. +234 800 000 0000"
                            className="w-full px-4 py-3.5 text-sm sm:text-base text-white placeholder-slate-400 bg-white/[0.06] hover:bg-white/[0.09] border border-white/15 rounded-none focus:outline-none focus:border-[#003663] focus:ring-2 focus:ring-[#38bdf8]/50 transition-all"
                          />
                        </div>

                        <div>
                          <label className="font-unisans-thin-caps block text-xs sm:text-[13px] uppercase tracking-wider text-slate-200 mb-2">
                            How would you like us to reach you first?
                          </label>
                          <div className="grid grid-cols-3 gap-3">
                            {['Email', 'WhatsApp', 'Phone call'].map(channel => (
                              <button
                                key={channel}
                                type="button"
                                onClick={() => setPreferredContact(channel)}
                                className={`py-3 px-3 text-xs sm:text-sm font-semibold rounded-none transition-all cursor-pointer text-center border ${
                                  preferredContact === channel
                                    ? 'bg-[#003663] border-2 border-[#38bdf8] text-white shadow-md'
                                    : 'bg-white/[0.05] hover:bg-white/[0.12] border-white/15 text-slate-200 hover:text-white'
                                }`}
                              >
                                {channel}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Prominent White Privacy Subtext */}
                        <div className="pt-2 text-center text-xs sm:text-sm text-white font-medium">
                          Your information is private. We will never share it to anyone.
                        </div>

                        <div className="pt-4 flex justify-center">
                          <button
                            type="submit"
                            disabled={!fullName.trim() || !email.trim()}
                            className="px-12 py-4 text-base font-bold text-[#130f30] border border-black/20 disabled:opacity-40 disabled:pointer-events-none rounded-none shadow-xl hover:brightness-105 hover:scale-[1.02] active:scale-[0.99] transition-all cursor-pointer tracking-wide"
                            style={{
                              background: 'linear-gradient(125deg, #f58338 0%, #f58338 72%, #fcd2bb 72%, #fcd2bb 80%, #ee5266 80%, #ee5266 100%)',
                            }}
                          >
                            Send My Brief →
                          </button>
                        </div>
                      </form>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {/* ==============================================================
              CONFIRMATION SCREEN (Sharp corners)
             ============================================================== */}
          {currentStep === 'confirmation' && briefSummary && (
            <motion.div
              key="confirmation"
              custom={direction}
              variants={royalGracefulVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="w-full flex-1 flex flex-col items-center justify-center text-center space-y-2.5 sm:space-y-7 sm:space-y-8 p-6 sm:p-10 md:p-16 my-auto"
            >
              <div className="w-16 h-16 bg-[#003663] border border-[#38bdf8]/50 flex items-center justify-center text-[#38bdf8] mx-auto rounded-none shadow-xl">
                <CheckCircle2 className="w-8 h-8 text-[#38bdf8]" />
              </div>

              <div className="space-y-3 max-w-2xl mx-auto">
                <span className="text-xs uppercase tracking-widest text-[#38bdf8] font-mono-numbers font-bold">
                  REF: {briefSummary.referenceId}
                </span>
                <h2 className="font-phenomena-bold text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight">
                  VDVC has received your brief
                </h2>
                <p className="text-sm sm:text-base text-slate-300 font-light leading-relaxed font-body-copy">
                  VDVC will get back to you soon via <strong className="text-white font-medium">{briefSummary.preferredContact}</strong> ({briefSummary.preferredContact?.toLowerCase().includes('phone') || briefSummary.preferredContact?.toLowerCase().includes('whatsapp') ? (briefSummary.phone || briefSummary.email) : briefSummary.email}).
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
                <button
                  type="button"
                  onClick={handleDownloadPdfAgain}
                  className="px-8 py-3.5 rounded-none bg-white/[0.08] hover:bg-white/[0.15] border border-white/20 text-white text-sm font-semibold flex items-center gap-2 transition-all cursor-pointer"
                >
                  <FileDown className="w-4 h-4 text-[#38bdf8]" />
                  <span>Download PDF Copy (Optional)</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setProfileType('');
                    setService('');
                    setBusinessName('');
                    setIndustry('');
                    setCustomIndustry('');
                    setIsTypingCustomIndustry(false);
                    setProjectType('');
                    setCustomProjectType('');
                    setSelectedGraphicTypes([]);
                    setSelectedBackendTypes([]);
                    setProjectStatus('');
                    setProjectStatusDetails('');
                    setUsageFormat('');
                    setGraphicQuantity('');
                    setBrandAssets('');
                    setBrandAssetsDetails('');
                    setSelectedGoals([]);
                    setCustomGoal('');
                    setIsCustomGoalOpen(false);
                    setScopePages('');
                    setContentReadiness([]);
                    setContentReadinessLink('');
                    setDomainHosting('');
                    setDesignDirectionChoice('');
                    setFeelMood('');
                    setFeelDescription('');
                    setReferenceWebsiteLink('');
                    setSelectedExistingAssets([]);
                    setExistingAssetsSingle('');
                    setExistingAssetsDetails('');
                    setTechStackChoice('');
                    setTechStackDetails('');
                    setTimelineType('');
                    setTimelineWeeks(4);
                    setBudgetType('exact');
                    setExactBudgetAmount(2800000);
                    setFullName('');
                    setEmail('');
                    setPhone('');
                    setPreferredContact('Email');
                    setBriefSummary(null);
                    setCurrentStep('entry');
                  }}
                  className="px-8 py-3.5 rounded-none bg-[#003663] hover:bg-[#002647] border border-[#38bdf8]/40 text-white text-sm font-bold transition-all cursor-pointer shadow-lg"
                >
                  Start Another Brief →
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};
