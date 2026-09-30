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

type StepId =
  | 'entry'
  | 'who'
  | 'service'
  | 'projectType'
  | 'business'
  | 'goals'
  | 'feel'
  | 'scope'
  | 'brandAssets'
  | 'existingAssets'
  | 'quantity'
  | 'techPreferences'
  | 'currentState'
  | 'timeline'
  | 'budget'
  | 'contact'
  | 'confirmation';

export const BUSINESS_INDUSTRIES = [
  "Accounting & Tax",
  "Agro-Processing & Packaging",
  "Architecture & Interior Design",
  "Auto Body & Detailing",
  "Auto Dealerships",
  "Auto Repair Workshops",
  "Auto Spare Parts",
  "Bakeries & Pastries",
  "Banking & Microfinance",
  "Bars & Nightclubs",
  "Beauty & Cosmetics",
  "Building Materials Supply",
  "Business Consulting",
  "Business Registration Services",
  "Cafes & Juice Bars",
  "Carpentry & Roofing",
  "Catering & Cloud Kitchens",
  "Civil Engineering",
  "Cleaning & Laundry",
  "Colleges & Universities",
  "Consumer Packaged Goods",
  "Content Creators & Influencers",
  "Crop Farming",
  "Crypto & Web3",
  "Data & AI Services",
  "Dental & Optometry",
  "Digital Marketing & SEO",
  "EdTech Platforms",
  "Electrical & Generator Repair",
  "Electrical Manufacturing",
  "Electronics & Gadgets",
  "Event Planning",
  "Event Venues",
  "Facility Management",
  "Farm Machinery & Inputs",
  "Fashion & Apparel",
  "Film & Broadcasting",
  "Fintech & Payments",
  "Fish Farming",
  "Fitness & Gyms",
  "Forestry & Timber",
  "Foundations & Trust Funds",
  "Garments & Textiles",
  "General Merchandise",
  "Graphic Design Studios",
  "Hair Salons & Barbershops",
  "Hardware & Telecom",
  "Haulage & Freight",
  "Home & Furniture",
  "Hospitals & Clinics",
  "HR & Recruitment",
  "HVAC & Air Conditioning",
  "Industrial Chemicals",
  "Insurance Services",
  "IT & Cybersecurity",
  "Jewelry & Luxury Goods",
  "Last-Mile Delivery",
  "Legal Services",
  "Lending & Credit",
  "Livestock & Poultry",
  "Marine & Rail Transport",
  "Mental Health Counseling",
  "Metal Fabrication",
  "Mining & Quarrying",
  "Music & Record Labels",
  "NGOs & Charities",
  "Oil & Gas Exploration",
  "Oil & Gas Retail",
  "Pest Control Services",
  "Pharmacies & Chemists",
  "Photography & Videography",
  "Plastics & Packaging",
  "Plumbing Services",
  "POS & Money Transfer",
  "Primary & Secondary Schools",
  "Printing & Secretarial",
  "Property Development",
  "Public Sector Initiatives",
  "Real Estate Agencies",
  "Religious Centers",
  "Ride-Hailing & Car Hire",
  "SaaS & Cloud Software",
  "Security Services",
  "Shipping & Cargo",
  "Software & App Development",
  "Solar & Renewable Energy",
  "Spas & Skin Clinics",
  "Supermarkets & Groceries",
  "Surveying & Consulting",
  "Tech Bootcamps",
  "Trade Associations",
  "Tutoring & Coaching",
  "Vehicle Rentals & Leasing",
  "Vocational Training Centers",
  "Warehousing & Fulfillment",
  "Water & Utilities",
  "Wealth Management",
  "Other / Unlisted"
];

const INDUSTRIES = BUSINESS_INDUSTRIES;

export const BookingSection: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<StepId>('entry');
  const [direction, setDirection] = useState<1 | -1>(1);

  // Form State
  const [profileType, setProfileType] = useState<string>(''); // 'idea' | 'prepared'
  const [service, setService] = useState<'website' | 'graphic' | 'backend' | ''>('');
  
  // Project Type
  const [projectType, setProjectType] = useState<string>('');
  const [customProjectType, setCustomProjectType] = useState<string>('');
  const [selectedGraphicTypes, setSelectedGraphicTypes] = useState<string[]>([]);
  
  // Business Info
  const [businessName, setBusinessName] = useState<string>('');
  const [industry, setIndustry] = useState<string>('');
  const [customIndustry, setCustomIndustry] = useState<string>('');
  const [isTypingCustomIndustry, setIsTypingCustomIndustry] = useState<boolean>(false);
  
  // Goals
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);
  const [customGoal, setCustomGoal] = useState<string>('');
  const [isCustomGoalOpen, setIsCustomGoalOpen] = useState(false);

  // Style / Feel Direction
  const [designDirectionChoice, setDesignDirectionChoice] = useState<string>('');
  const [feelMood, setFeelMood] = useState<string>('');
  const [feelDescription, setFeelDescription] = useState<string>('');
  const [referenceWebsiteLink, setReferenceWebsiteLink] = useState<string>('');

  // Assets & Scope fields
  const [scopePages, setScopePages] = useState<string>('');
  const [brandAssets, setBrandAssets] = useState<string>('');
  const [brandAssetsDetails, setBrandAssetsDetails] = useState<string>('');
  const [existingAssets, setExistingAssets] = useState<string>('');
  const [existingAssetsDetails, setExistingAssetsDetails] = useState<string>('');
  const [graphicQuantity, setGraphicQuantity] = useState<string>('');
  const [techStackChoice, setTechStackChoice] = useState<string>('');
  const [techStackDetails, setTechStackDetails] = useState<string>('');
  const [systemCurrentState, setSystemCurrentState] = useState<string>('');

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
    if (profileType === 'prepared') {
      if (service === 'website') {
        return ['who', 'service', 'projectType', 'business', 'goals', 'feel', 'scope', 'timeline', 'budget', 'contact'];
      }
      if (service === 'graphic') {
        return ['who', 'service', 'projectType', 'business', 'feel', 'brandAssets', 'quantity', 'timeline', 'budget', 'contact'];
      }
      if (service === 'backend') {
        return ['who', 'service', 'projectType', 'business', 'goals', 'techPreferences', 'currentState', 'timeline', 'budget', 'contact'];
      }
      return ['who', 'service', 'projectType', 'business', 'goals', 'feel', 'timeline', 'budget', 'contact'];
    } else {
      // Category 1: 'idea'
      if (service === 'website') {
        return ['who', 'service', 'projectType', 'business', 'goals', 'feel', 'existingAssets', 'timeline', 'budget', 'contact'];
      }
      if (service === 'graphic') {
        return ['who', 'service', 'projectType', 'business', 'feel', 'existingAssets', 'quantity', 'timeline', 'budget', 'contact'];
      }
    }
    return ['who', 'service', 'projectType', 'business', 'goals', 'feel', 'timeline', 'budget', 'contact'];
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

  // Toggle goals
  const toggleGoal = (tag: string) => {
    if (selectedGoals.includes(tag)) {
      setSelectedGoals(selectedGoals.filter(t => t !== tag));
    } else {
      if (selectedGoals.length < 2) {
        setSelectedGoals([...selectedGoals, tag]);
      } else {
        setSelectedGoals([selectedGoals[1], tag]);
      }
    }
  };

  // Toggle graphic deliverables for Category 2
  const toggleGraphicType = (type: string) => {
    if (selectedGraphicTypes.includes(type)) {
      setSelectedGraphicTypes(selectedGraphicTypes.filter(t => t !== type));
    } else {
      setSelectedGraphicTypes([...selectedGraphicTypes, type]);
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
      backend: 'Backend / Systems',
    };

    const resolvedIndustry =
      (isTypingCustomIndustry || industry === 'Other' || industry === 'Other (Type your own)' || industry === 'Other / Unlisted') && customIndustry.trim()
        ? customIndustry.trim()
        : industry || 'Not specified';

    const effectiveProjectType =
      profileType === 'prepared' && service === 'graphic'
        ? [...selectedGraphicTypes, customProjectType.trim()].filter(Boolean).join(', ')
        : (customProjectType.trim() || projectType || undefined);

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
          ? "I have an idea but I'm not sure where to start"
          : 'I know exactly what I want',
      service: serviceNameMap[service] || 'Creative Consulting',
      projectType: effectiveProjectType,
      goals: selectedGoals,
      customGoal: customGoal.trim() || undefined,
      feelMood: feelMood || designDirectionChoice || undefined,
      feelDescription: feelDescription.trim() || undefined,
      referenceWebsiteLink: referenceWebsiteLink.trim() || undefined,
      scopePages: scopePages || undefined,
      graphicQuantity: graphicQuantity || undefined,
      brandAssets: brandAssets ? `${brandAssets}${brandAssetsDetails.trim() ? `: ${brandAssetsDetails.trim()}` : ''}` : undefined,
      existingAssets: existingAssets ? `${existingAssets}${existingAssetsDetails.trim() ? `: ${existingAssetsDetails.trim()}` : ''}` : undefined,
      techStackPreference: techStackChoice ? `${techStackChoice}${techStackDetails.trim() ? `: ${techStackDetails.trim()}` : ''}` : undefined,
      systemCurrentState: systemCurrentState || undefined,
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

    // 1. Save brief to Firestore and local backup so studio owner has full record in Dashboard
    try {
      await setDoc(doc(db, 'briefs', briefData.referenceId), {
        ...briefData,
        createdAt: Date.now(),
        status: 'new',
      });
    } catch (err) {
      console.warn('Firestore brief save fallback:', err);
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
Goals: ${briefData.goals.join(', ')} ${briefData.customGoal ? `(${briefData.customGoal})` : ''}
Style Direction: ${briefData.feelMood || 'N/A'}
Description: ${briefData.feelDescription || 'N/A'}
Reference Link: ${briefData.referenceWebsiteLink || 'N/A'}
Scope Pages: ${briefData.scopePages || 'N/A'}
Graphic Quantity: ${briefData.graphicQuantity || 'N/A'}
Brand Assets: ${briefData.brandAssets || 'N/A'}
Existing Assets: ${briefData.existingAssets || 'N/A'}
Tech Preferences: ${briefData.techStackPreference || 'N/A'}
Current System State: ${briefData.systemCurrentState || 'N/A'}
Timeline: ${briefData.timelineType === 'weeks' ? `${briefData.timelineWeeks} Weeks` : briefData.timelineType}
Budget: ${briefData.budgetBand || briefData.budgetType}`;

      // Background form dispatch to formsubmit / web3forms API for vapourdense@gmail.com
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
          goals: briefData.goals.join(', '),
          custom_goal: briefData.customGoal || 'N/A',
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

  const isGoalsNextActive = selectedGoals.length > 0 || customGoal.trim().length >= 4;

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
                  className="px-10 sm:px-12 py-4 text-base sm:text-lg font-bold text-white bg-[#003663] hover:bg-[#002647] border border-[#38bdf8]/40 rounded-none shadow-xl transition-all cursor-pointer"
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
                  {/* Wide Orange Progress Bar (On top of back arrow, no percentage) */}
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
                      QUESTION 1 — The Split (Category 1 vs Category 2)
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
                            I have an idea but I&apos;m not sure where to start
                          </h4>
                          <p className="text-xs sm:text-sm text-slate-300 font-light leading-relaxed">
                            You know you need something — a website, a design, maybe more. You&apos;re just not sure what that looks like yet.
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
                            You&apos;ve got the specs, the vision, or at least a strong direction. You&apos;re ready to get into the details.
                          </p>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* --------------------------------------------------------
                      SERVICE SELECTION
                     -------------------------------------------------------- */}
                  {currentStep === 'service' && (
                    <div className="space-y-2.5 sm:space-y-7">
                      <div>
                        <span className="font-unisans-thin-caps text-[10px] sm:text-[13px] uppercase tracking-widest text-white block mb-2">
                          NEXT, TELL US  —
                        </span>
                        <h3 className="font-phenomena text-4xl sm:text-4xl lg:text-[54px] font-bold text-white tracking-tight leading-tight">
                          What are you looking to get done?
                        </h3>
                      </div>

                      <div className={`grid grid-cols-1 ${profileType === 'idea' ? 'sm:grid-cols-2' : 'sm:grid-cols-3'} gap-5 pt-1`}>
                        <button
                          type="button"
                          onClick={() => {
                            setService('website');
                            goToStep('projectType');
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
                            From a clean business site to a fully functional web application — if it lives in a browser, this is it.
                          </p>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setService('graphic');
                            goToStep('projectType');
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
                            Logos, flyers, brand kits, social media graphics. If it needs to look great, we&apos;ve got you.
                          </p>
                        </button>

                        {/* Only rendered if user knows what they want (Category 2) */}
                        {profileType !== 'idea' && (
                          <button
                            type="button"
                            onClick={() => {
                              setService('backend');
                              goToStep('projectType');
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
                              Backend / Systems
                            </h4>
                            <p className="text-xs sm:text-[13px] text-slate-300 font-light leading-relaxed">
                              APIs, databases, dashboards, integrations. The stuff that powers everything behind the scenes.
                            </p>
                          </button>
                        )}
                      </div>
                    </div>
                  )}

                  {/* --------------------------------------------------------
                      Q2 — WHAT ARE YOU LOOKING TO GET DONE? / DELIVERABLES / SYSTEM TYPE
                     -------------------------------------------------------- */}
                  {currentStep === 'projectType' && (
                    <div className="space-y-2.5 sm:space-y-7">
                      <div>
                        <span className="font-unisans-thin-caps text-[10px] sm:text-[13px] uppercase tracking-widest text-white block mb-2">
                          {profileType === 'idea'
                            ? service === 'graphic'
                              ? 'Q2 — DELIVERABLE SCOPE'
                              : 'Q2 — MAIN GOAL'
                            : service === 'website'
                            ? 'Q2 — PROJECT TYPE'
                            : service === 'graphic'
                            ? 'Q2 — DELIVERABLE SCOPE'
                            : 'Q2 — PROJECT TYPE'}
                        </span>
                        <h3 className="font-phenomena text-4xl sm:text-4xl lg:text-[54px] font-bold text-white tracking-tight leading-tight">
                          {profileType === 'idea'
                            ? service === 'graphic'
                              ? 'What are we crafting together?'
                              : 'What are you looking to get done?'
                            : service === 'website'
                            ? 'What type of project are you building?'
                            : service === 'graphic'
                            ? 'What are we crafting together?'
                            : 'What type of system are you building?'}
                        </h3>
                      </div>

                      {/* Options Grid */}
                      <div className="space-y-4 pt-1">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                          {/* CATEGORY 1: Website */}
                          {profileType === 'idea' && service === 'website' &&
                            [
                              'Show people what my business is about',
                              'Let customers contact or reach me easily',
                              'Let customers book, order, or sign up for something',
                              'Sell products online',
                              "I'm not sure yet — I just know I need a website",
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

                          {/* CATEGORY 1: Graphic */}
                          {profileType === 'idea' && service === 'graphic' &&
                            [
                              'A logo for my business',
                              'Something to hand out or share (flyer, business card)',
                              'Graphics for my social media pages',
                              'I want my whole brand to look consistent',
                              "I'm not sure yet — I just know it needs to look better",
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

                          {/* CATEGORY 2: Website */}
                          {profileType === 'prepared' && service === 'website' &&
                            [
                              'Informational / Brochure site',
                              'Web Application (users log in, interact with data)',
                              'E-commerce store',
                              'Landing page / Single page',
                              'Portfolio site',
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

                          {/* CATEGORY 2: Graphic */}
                          {profileType === 'prepared' && service === 'graphic' &&
                            [
                              'Logo',
                              'Flyer or Poster',
                              'Business Card',
                              'Social Media Graphics',
                              'Brand Identity Kit',
                              'Packaging',
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

                          {/* CATEGORY 2: Backend */}
                          {profileType === 'prepared' && service === 'backend' &&
                            [
                              'REST API or backend for an existing frontend',
                              'Admin dashboard or internal tool',
                              'Database design and setup',
                              'Third-party integrations (payments, auth, SMS, etc.)',
                              'Automation or workflow system',
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
                        </div>

                        {/* Something else text input (for Category 2) */}
                        {profileType === 'prepared' && (
                          <div className="pt-2">
                            <label className="font-unisans-thin-caps block text-xs sm:text-[13px] uppercase tracking-wider text-slate-300 mb-1.5">
                              Something else (text input):
                            </label>
                            <input
                              type="text"
                              value={customProjectType}
                              onChange={e => setCustomProjectType(e.target.value)}
                              placeholder="Type your specific project / deliverable type..."
                              className="w-full px-4 py-3 text-xs sm:text-sm text-white placeholder-slate-400 bg-white/[0.06] border border-white/20 rounded-none focus:outline-none focus:border-[#003663] focus:ring-2 focus:ring-[#38bdf8]/50"
                            />
                          </div>
                        )}
                      </div>

                      <div className="pt-4 flex justify-center">
                        <button
                          type="button"
                          disabled={
                            profileType === 'prepared' && service === 'graphic'
                              ? selectedGraphicTypes.length === 0 && !customProjectType.trim()
                              : !projectType && !customProjectType.trim()
                          }
                          onClick={() => goToStep('business')}
                          className="px-10 py-3.5 text-sm sm:text-base font-bold text-white bg-[#003663] hover:bg-[#002647] border border-[#38bdf8]/40 disabled:opacity-40 disabled:pointer-events-none rounded-none shadow-lg transition-all cursor-pointer"
                        >
                          Next →
                        </button>
                      </div>
                    </div>
                  )}

                  {/* --------------------------------------------------------
                      Q3 — Business Info (All Paths)
                     -------------------------------------------------------- */}
                  {currentStep === 'business' && (
                    <div className="space-y-2.5 sm:space-y-7">
                      <div>
                        <span className="font-unisans-thin-caps text-[10px] sm:text-[13px] uppercase tracking-widest text-white block mb-2">
                          Q3 — BUSINESS INFO
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
                          onClick={() => {
                            if (service === 'graphic') {
                              goToStep('feel');
                            } else {
                              goToStep('goals');
                            }
                          }}
                          className="px-10 py-3.5 text-sm sm:text-base font-bold text-white bg-[#003663] hover:bg-[#002647] border border-[#38bdf8]/40 disabled:opacity-40 disabled:pointer-events-none rounded-none shadow-lg transition-all cursor-pointer"
                        >
                          Next →
                        </button>
                      </div>
                    </div>
                  )}

                  {/* --------------------------------------------------------
                      Q4 — GOALS (Website & Backend Paths)
                     -------------------------------------------------------- */}
                  {currentStep === 'goals' && (
                    <div className="space-y-2.5 sm:space-y-7">
                      <div>
                        <span className="font-unisans-thin-caps text-[10px] sm:text-[13px] uppercase tracking-widest text-white block mb-2">
                          {profileType === 'idea'
                            ? 'Q4 — CALL TO ACTION (UP TO 2)'
                            : service === 'backend'
                            ? 'Q4 — KEY CRITERIA (UP TO 2)'
                            : 'Q4 — GOALS (UP TO 2)'}
                        </span>

                        <h3 className="font-phenomena text-4xl sm:text-4xl lg:text-[54px] font-bold text-white tracking-tight leading-tight">
                          {profileType === 'idea'
                            ? 'What do you want people to do when they visit your site?'
                            : service === 'backend'
                            ? 'What does success look like for this engine?'
                            : 'What do you want people to do when they land on your site?'}
                        </h3>
                      </div>

                      {/* Tag options */}
                      <div className="space-y-4 pt-1">
                        <div className="flex flex-wrap gap-2.5">
                          {(profileType === 'idea'
                            ? [
                                'Contact or reach me easily',
                                'Learn about my products or services',
                                'Book an appointment or session',
                                'Buy something directly',
                                'Trust my brand more',
                              ]
                            : service === 'backend'
                            ? [
                                'Power a frontend or mobile app',
                                'Build an internal tool',
                                'Connect third-party services',
                                'Automate a business process',
                              ]
                            : [
                                'Contact or reach me easily',
                                'Let customers book or order something',
                                'Sell products directly',
                                'Automate a business process',
                                'Replace or improve an existing system',
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

                          {profileType === 'idea' && !isCustomGoalOpen && (
                            <button
                              type="button"
                              onClick={() => setIsCustomGoalOpen(true)}
                              className="px-4 py-2.5 rounded-none text-xs sm:text-sm font-medium text-[#38bdf8] hover:text-white hover:bg-white/[0.12] bg-white/[0.05] border border-white/15 cursor-pointer transition-colors"
                            >
                              ✏️ Something else (short text input)
                            </button>
                          )}
                        </div>

                        {/* Something else input field */}
                        {(profileType === 'prepared' || isCustomGoalOpen) && (
                          <div className="w-full pt-1">
                            <input
                              type="text"
                              value={customGoal}
                              onChange={e => setCustomGoal(e.target.value)}
                              placeholder="Something else (short text input)..."
                              className="w-full px-4 py-3 text-xs sm:text-sm text-white placeholder-slate-400 bg-white/[0.06] border border-white/20 rounded-none focus:outline-none focus:border-[#003663] focus:ring-2 focus:ring-[#38bdf8]/50"
                            />
                          </div>
                        )}
                      </div>

                      <div className="pt-5 flex justify-center">
                        <button
                          type="button"
                          disabled={!isGoalsNextActive}
                          onClick={() => {
                            if (profileType === 'prepared') {
                              if (service === 'website') goToStep('feel');
                              else if (service === 'backend') goToStep('techPreferences');
                              else goToStep('feel');
                            } else {
                              goToStep('feel');
                            }
                          }}
                          className={`px-10 py-3.5 text-sm sm:text-base font-bold text-white rounded-none shadow-lg transition-all cursor-pointer border ${
                            isGoalsNextActive
                              ? 'bg-[#003663] hover:bg-[#002647] border-[#38bdf8]/40 ring-2 ring-[#38bdf8]/30'
                              : 'bg-white/10 text-white/30 border-white/10 opacity-40 pointer-events-none'
                          }`}
                        >
                          Next →
                        </button>
                      </div>
                    </div>
                  )}

                  {/* --------------------------------------------------------
                      Q5 (Website) / Q4 (Graphic) — FEEL & STYLE DIRECTION
                     -------------------------------------------------------- */}
                  {currentStep === 'feel' && (
                    <div className="space-y-2.5 sm:space-y-7">
                      <div>
                        <span className="font-unisans-thin-caps text-[10px] sm:text-[13px] uppercase tracking-widest text-white block mb-2">
                          {service === 'graphic'
                            ? 'Q4 — DESIGN DIRECTION'
                            : 'Q5 — DESIGN DIRECTION'}
                        </span>
                        <h3 className="font-phenomena text-4xl sm:text-4xl lg:text-[54px] font-bold text-white tracking-tight leading-tight">
                          {service === 'graphic'
                            ? 'What should people feel when they see your design?'
                            : profileType === 'idea'
                            ? 'How do you want it to feel?'
                            : 'Do you have a design direction in mind?'}
                        </h3>
                      </div>

                      {/* CATEGORY 1: Website */}
                      {profileType === 'idea' && service === 'website' && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 pt-1">
                          {[
                            'Clean & Professional',
                            'Bold & Energetic',
                            'Warm & Friendly',
                            'Minimal & Elegant',
                            'Dark & Dramatic',
                            'Surprise me — I trust you',
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

                      {/* CATEGORY 1: Graphic */}
                      {profileType === 'idea' && service === 'graphic' && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
                          {[
                            'That this business is serious and trustworthy',
                            'That this business is fun and exciting',
                            'That this business is premium and high-end',
                            'That this business is friendly and approachable',
                            "I'm not sure — just make it look great",
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

                      {/* CATEGORY 2: Prepared Design Direction */}
                      {profileType === 'prepared' && (
                        <div className="space-y-4 pt-1">
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
                                {service === 'graphic'
                                  ? 'I have references (link or upload)'
                                  : 'Yes, I have references or a style guide (link or file upload)'}
                              </h4>
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
                                {service === 'graphic'
                                  ? 'I have a general idea (text input)'
                                  : 'Yes, I have a general idea (text input)'}
                              </h4>
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
                                {service === 'graphic'
                                  ? 'Start from scratch — surprise me'
                                  : "No — I'll leave the creative direction to you"}
                              </h4>
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
                                placeholder="https://example.com or Figma / Google Drive link..."
                                className="w-full px-4 py-3 text-xs sm:text-sm text-white placeholder-slate-400 bg-white/[0.06] border border-white/20 rounded-none focus:outline-none focus:border-[#003663] focus:ring-2 focus:ring-[#38bdf8]/50"
                              />
                            </div>
                          )}

                          {designDirectionChoice === 'idea' && (
                            <div className="pt-2">
                              <label className="font-unisans-thin-caps block text-xs sm:text-[13px] uppercase tracking-wider text-slate-300 mb-1.5">
                                Describe your general idea:
                              </label>
                              <textarea
                                rows={2}
                                value={feelDescription}
                                onChange={e => setFeelDescription(e.target.value)}
                                placeholder="Describe the aesthetic, typography, colors, or mood..."
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
                          onClick={() => {
                            if (profileType === 'prepared') {
                              if (service === 'website') goToStep('scope');
                              else if (service === 'graphic') goToStep('brandAssets');
                              else goToStep('timeline');
                            } else {
                              goToStep('existingAssets');
                            }
                          }}
                          className="px-10 py-3.5 text-sm sm:text-base font-bold text-white bg-[#003663] hover:bg-[#002647] border border-[#38bdf8]/40 disabled:opacity-40 disabled:pointer-events-none rounded-none shadow-lg transition-all cursor-pointer"
                        >
                          Next →
                        </button>
                      </div>
                    </div>
                  )}

                  {/* --------------------------------------------------------
                      CATEGORY 1: Q6 (Website) / Q5 (Graphic) — EXISTING ASSETS
                     -------------------------------------------------------- */}
                  {currentStep === 'existingAssets' && profileType === 'idea' && (
                    <div className="space-y-2.5 sm:space-y-7">
                      <div>
                        <span className="font-unisans-thin-caps text-[10px] sm:text-[13px] uppercase tracking-widest text-white block mb-2">
                          {service === 'graphic'
                            ? 'Q5 — ASSETS'
                            : 'Q6 — EXISTING ARTIFACTS'}
                        </span>
                        <h3 className="font-phenomena text-4xl sm:text-4xl lg:text-[54px] font-bold text-white tracking-tight leading-tight">
                          {service === 'graphic'
                            ? 'Are there brand guidelines or materials we can work with already in place?'
                            : 'Do you have anything already?'}
                        </h3>
                      </div>

                      <div className="space-y-3.5 pt-1 max-w-2xl mx-auto">
                        {(service === 'graphic'
                          ? [
                              "No — we're starting from scratch",
                              'I have a logo but need more designed around it',
                              'I have some colours or a style I like (describe or upload)',
                              'I have old designs that need a refresh',
                            ]
                          : [
                              "No — we're starting from scratch",
                              'I have a logo or some brand colours',
                              'I have an old website that needs replacing',
                              'I have some content ready (photos, text, etc.)',
                            ]
                        ).map(item => (
                          <button
                            key={item}
                            type="button"
                            onClick={() => setExistingAssets(item)}
                            className={`w-full p-5 text-left rounded-none transition-all cursor-pointer border ${
                              existingAssets === item
                                ? 'bg-[#003663] border-2 border-[#38bdf8] text-white shadow-lg font-bold'
                                : 'bg-white/[0.05] hover:bg-white/[0.10] border-white/15 text-white backdrop-blur-md'
                            }`}
                          >
                            <h4 className="text-sm sm:text-base font-bold text-white">{item}</h4>
                          </button>
                        ))}

                        {existingAssets && !existingAssets.startsWith('No') && (
                          <div className="pt-3 p-4 bg-white/[0.04] border border-white/15 rounded-none space-y-2">
                            <label className="font-unisans-thin-caps block text-xs sm:text-[13px] uppercase tracking-wider text-slate-200 mb-1 flex items-center justify-between flex-wrap gap-1">
                              <span className="flex items-center gap-1.5 text-[#38bdf8] font-bold">
                                <LinkIcon className="w-3.5 h-3.5" />
                                <span>Drop Asset Link:</span>
                              </span>
                              <span className="text-[10px] text-slate-300 lowercase tracking-normal italic">(Optional — Google Drive, Dropbox, Figma, Canva, etc.)</span>
                            </label>
                            <input
                              type="url"
                              value={existingAssetsDetails}
                              onChange={e => setExistingAssetsDetails(e.target.value)}
                              placeholder="Paste URL to your asset, logo, brand guide, drive folder or reference..."
                              className="w-full px-4 py-3 text-xs sm:text-sm text-white placeholder-slate-400 bg-white/[0.06] border border-white/20 rounded-none focus:outline-none focus:border-[#38bdf8] focus:ring-1 focus:ring-[#38bdf8]"
                            />
                          </div>
                        )}
                      </div>

                      <div className="pt-4 flex justify-center">
                        <button
                          type="button"
                          disabled={!existingAssets}
                          onClick={() => {
                            if (service === 'graphic') {
                              goToStep('quantity');
                            } else {
                              goToStep('timeline');
                            }
                          }}
                          className="px-10 py-3.5 text-sm sm:text-base font-bold text-white bg-[#003663] hover:bg-[#002647] border border-[#38bdf8]/40 disabled:opacity-40 disabled:pointer-events-none rounded-none shadow-lg transition-all cursor-pointer"
                        >
                          Next →
                        </button>
                      </div>
                    </div>
                  )}

                  {/* --------------------------------------------------------
                      CATEGORY 2 (Website Path): Q6 — Pages / Scope
                     -------------------------------------------------------- */}
                  {currentStep === 'scope' && profileType === 'prepared' && service === 'website' && (
                    <div className="space-y-2.5 sm:space-y-7">
                      <div>
                        <span className="font-unisans-thin-caps text-[10px] sm:text-[13px] uppercase tracking-widest text-white block mb-2">
                          Q6 — PAGES / SCOPE
                        </span>
                        <h3 className="font-phenomena text-4xl sm:text-4xl lg:text-[54px] font-bold text-white tracking-tight leading-tight">
                          How many pages or views do you need?
                        </h3>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-1">
                        {['1–3 pages', '4–7 pages', '8+ pages', 'Not sure yet'].map(opt => (
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
                            <h4 className="text-base font-bold text-white">{opt}</h4>
                          </button>
                        ))}
                      </div>

                      <div className="pt-4 flex justify-center">
                        <button
                          type="button"
                          disabled={!scopePages}
                          onClick={() => goToStep('timeline')}
                          className="px-10 py-3.5 text-sm sm:text-base font-bold text-white bg-[#003663] hover:bg-[#002647] border border-[#38bdf8]/40 disabled:opacity-40 disabled:pointer-events-none rounded-none shadow-lg transition-all cursor-pointer"
                        >
                          Next →
                        </button>
                      </div>
                    </div>
                  )}

                  {/* --------------------------------------------------------
                      CATEGORY 2 (Graphic Path): Q5 — Existing Brand Assets
                     -------------------------------------------------------- */}
                  {currentStep === 'brandAssets' && profileType === 'prepared' && service === 'graphic' && (
                    <div className="space-y-2.5 sm:space-y-7">
                      <div>
                        <span className="font-unisans-thin-caps text-[10px] sm:text-[13px] uppercase tracking-widest text-white block mb-2">
                          Q5 — EXISTING BRAND ASSETS
                        </span>
                        <h3 className="font-phenomena text-4xl sm:text-4xl lg:text-[54px] font-bold text-white tracking-tight leading-tight">
                          What do you have on ground?
                        </h3>
                      </div>

                      <div className="space-y-4 pt-1 max-w-2xl mx-auto">
                        <div className="space-y-3">
                          {[
                            'Yes, I have a logo and brand colours (upload or describe)',
                            'No — starting from scratch',
                            'It exists but needs a refresh',
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

                        {brandAssets && !brandAssets.startsWith('No') && (
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
                          onClick={() => goToStep('quantity')}
                          className="px-10 py-3.5 text-sm sm:text-base font-bold text-white bg-[#003663] hover:bg-[#002647] border border-[#38bdf8]/40 disabled:opacity-40 disabled:pointer-events-none rounded-none shadow-lg transition-all cursor-pointer"
                        >
                          Next →
                        </button>
                      </div>
                    </div>
                  )}

                  {/* --------------------------------------------------------
                      Q6 — QUANTITY (Graphic Path: Category 1 & Category 2)
                     -------------------------------------------------------- */}
                  {currentStep === 'quantity' && service === 'graphic' && (
                    <div className="space-y-2.5 sm:space-y-7">
                      <div>
                        <span className="font-unisans-thin-caps text-[10px] sm:text-[13px] uppercase tracking-widest text-white block mb-2">
                          Q6 — QUANTITY
                        </span>
                        <h3 className="font-phenomena text-4xl sm:text-4xl lg:text-[54px] font-bold text-white tracking-tight leading-tight">
                          {profileType === 'idea'
                            ? 'How many pieces do you need?'
                            : 'What quantity are you looking for?'}
                        </h3>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-1">
                        {(profileType === 'idea'
                          ? [
                              'Just one',
                              'A small set (2–5 pieces)',
                              "I need a few different things (we'll figure it out together)",
                              'Not sure yet',
                            ]
                          : [
                              'Just one piece',
                              'A small set (2–5 pieces)',
                              'An ongoing supply',
                              'Not sure yet',
                            ]
                        ).map(opt => (
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
                          onClick={() => goToStep('timeline')}
                          className="px-10 py-3.5 text-sm sm:text-base font-bold text-white bg-[#003663] hover:bg-[#002647] border border-[#38bdf8]/40 disabled:opacity-40 disabled:pointer-events-none rounded-none shadow-lg transition-all cursor-pointer"
                        >
                          Next →
                        </button>
                      </div>
                    </div>
                  )}

                  {/* --------------------------------------------------------
                      CATEGORY 2 (Backend Path): Q5 — Tech Preferences
                     -------------------------------------------------------- */}
                  {currentStep === 'techPreferences' && profileType === 'prepared' && service === 'backend' && (
                    <div className="space-y-2.5 sm:space-y-7">
                      <div>
                        <span className="font-unisans-thin-caps text-[10px] sm:text-[13px] uppercase tracking-widest text-white block mb-2">
                          Q5 — TOOLING CHOICES
                        </span>
                        <h3 className="font-phenomena text-4xl sm:text-4xl lg:text-[54px] font-bold text-white tracking-tight leading-tight">
                          Do you have a preferred stack in mind?
                        </h3>
                      </div>

                      <div className="space-y-4 pt-1 max-w-2xl mx-auto">
                        <div className="space-y-3">
                          {[
                            'Yes, I have a preferred stack (text input)',
                            'No — recommend what works best',
                            'I have an existing codebase (text input)',
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

                        {(techStackChoice.includes('preferred stack') || techStackChoice.includes('existing codebase')) && (
                          <div className="pt-2">
                            <label className="font-unisans-thin-caps block text-xs sm:text-[13px] uppercase tracking-wider text-slate-300 mb-1.5">
                              Specify your stack or codebase details:
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
                          onClick={() => goToStep('currentState')}
                          className="px-10 py-3.5 text-sm sm:text-base font-bold text-white bg-[#003663] hover:bg-[#002647] border border-[#38bdf8]/40 disabled:opacity-40 disabled:pointer-events-none rounded-none shadow-lg transition-all cursor-pointer"
                        >
                          Next →
                        </button>
                      </div>
                    </div>
                  )}

                  {/* --------------------------------------------------------
                      CATEGORY 2 (Backend Path): Q6 — Current State
                     -------------------------------------------------------- */}
                  {currentStep === 'currentState' && profileType === 'prepared' && service === 'backend' && (
                    <div className="space-y-2.5 sm:space-y-7">
                      <div>
                        <span className="font-unisans-thin-caps text-[10px] sm:text-[13px] uppercase tracking-widest text-white block mb-2">
                          Q6 — CURRENT STATE
                        </span>
                        <h3 className="font-phenomena text-4xl sm:text-4xl lg:text-[54px] font-bold text-white tracking-tight leading-tight">
                          What stage are we picking things up from?
                        </h3>
                      </div>

                      <div className="space-y-3.5 pt-1 max-w-2xl mx-auto">
                        {[
                          'Brand new — starting from scratch',
                          'Existing project that needs improvement',
                          'Existing project I want to hand off or maintain',
                        ].map(opt => (
                          <button
                            key={opt}
                            type="button"
                            onClick={() => setSystemCurrentState(opt)}
                            className={`w-full p-5 text-left rounded-none transition-all cursor-pointer border ${
                              systemCurrentState === opt
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
                          disabled={!systemCurrentState}
                          onClick={() => goToStep('timeline')}
                          className="px-10 py-3.5 text-sm sm:text-base font-bold text-white bg-[#003663] hover:bg-[#002647] border border-[#38bdf8]/40 disabled:opacity-40 disabled:pointer-events-none rounded-none shadow-lg transition-all cursor-pointer"
                        >
                          Next →
                        </button>
                      </div>
                    </div>
                  )}

                  {/* --------------------------------------------------------
                      Q7 — TIMELINE (All Paths)
                     -------------------------------------------------------- */}
                  {currentStep === 'timeline' && (
                    <div className="space-y-2.5 sm:space-y-7">
                      <div>
                        <span className="font-unisans-thin-caps text-[10px] sm:text-[13px] uppercase tracking-widest text-white block mb-2">
                          Q7 — ALMOST THERE, TIMELINE
                        </span>
                        <h3 className="font-phenomena text-4xl sm:text-4xl lg:text-[54px] font-bold text-white tracking-tight leading-tight">
                          {profileType === 'idea' ? 'When do you want it?' : 'When do you need this live?'}
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
                            {profileType === 'idea' ? 'As soon as possible' : 'ASAP'}
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
                            Slider: 1–8 weeks
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
                            {profileType === 'idea' ? "I'm not sure yet" : "I'm flexible"}
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
                          onClick={() => goToStep('budget')}
                          className="px-10 py-3.5 text-sm sm:text-base font-bold text-white bg-[#003663] hover:bg-[#002647] border border-[#38bdf8]/40 disabled:opacity-40 disabled:pointer-events-none rounded-none shadow-lg transition-all cursor-pointer"
                        >
                          Next →
                        </button>
                      </div>
                    </div>
                  )}

                  {/* --------------------------------------------------------
                      Q8 — BUDGET (All Paths with Comma-Separated Formatting)
                     -------------------------------------------------------- */}
                  {currentStep === 'budget' && (
                    <div className="space-y-2.5 sm:space-y-7">
                      <div>
                        <span className="font-unisans-thin-caps text-[10px] sm:text-[13px] uppercase tracking-widest text-white block mb-2">
                          {profileType === 'idea' ? 'Q8 — FINALLY, BUDGET' : 'Q8 — FINALLY, INVESTMENT'}
                        </span>
                        <h3 className="font-phenomena text-4xl sm:text-4xl lg:text-[54px] font-bold text-white tracking-tight leading-tight">
                          {profileType === 'idea' ? 'How much do you want to pay for it?' : 'What budget range are you working with?'}
                        </h3>
                        <p className="text-xs sm:text-sm text-slate-300 font-light mt-1.5">
                          Slide to choose an exact budget or type your specific amount up to ₦10,000,000+.
                        </p>
                      </div>

                      <div className="space-y-4 pt-1 max-w-2xl mx-auto">
                        {/* Interactive exact budget slider with COMMA SEPARATED NUMBERS */}
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
                                Slider
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
                              {profileType === 'idea' ? "I have no idea yet — I'm just exploring" : 'No idea yet'}
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
                          onClick={() => goToStep('contact')}
                          className="px-10 py-3.5 text-sm sm:text-base font-bold text-white bg-[#003663] hover:bg-[#002647] border border-[#38bdf8]/40 disabled:opacity-40 disabled:pointer-events-none rounded-none shadow-lg transition-all cursor-pointer"
                        >
                          Next →
                        </button>
                      </div>
                    </div>
                  )}

                  {/* --------------------------------------------------------
                      CONTACT DETAILS & DOSSIER DISPATCH
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
                            className="px-12 py-4 text-base font-bold text-white bg-[#003663] hover:bg-[#002647] border border-[#38bdf8]/40 disabled:opacity-40 disabled:pointer-events-none rounded-none shadow-xl transition-all cursor-pointer"
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
                    setProjectType('');
                    setCustomProjectType('');
                    setSelectedGraphicTypes([]);
                    setBusinessName('');
                    setIndustry('');
                    setSelectedGoals([]);
                    setCustomGoal('');
                    setDesignDirectionChoice('');
                    setFeelMood('');
                    setFeelDescription('');
                    setReferenceWebsiteLink('');
                    setScopePages('');
                    setBrandAssets('');
                    setBrandAssetsDetails('');
                    setExistingAssets('');
                    setExistingAssetsDetails('');
                    setGraphicQuantity('');
                    setTechStackChoice('');
                    setTechStackDetails('');
                    setSystemCurrentState('');
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
