import React, { useState, useEffect, useRef } from 'react';
import { Images, Calendar, User } from 'lucide-react';
import { VDVCLogo } from './VDVCLogo';

interface NavbarProps {
  currentView: 'portfolio' | 'dashboard' | 'login';
  setCurrentView: (view: 'portfolio' | 'dashboard' | 'login') => void;
  onNavigateToLogin: () => void;
  websiteName?: string;
  logoUrl?: string;
  isMobileNavVisible?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  setCurrentView,
  onNavigateToLogin,
  logoUrl,
  isMobileNavVisible,
}) => {
  const [imgError, setImgError] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const lastScrollY = useRef(0);

  const effectiveMobileVisible = isMobileNavVisible !== undefined ? isMobileNavVisible : isVisible;

  const logoSrc =
    logoUrl && !logoUrl.includes('vdvc-logo.png')
      ? logoUrl
      : '/VDVC 4 - Logo - NO-TEXT-TRANSPARENT-BG.png';

  const [isOverBooking, setIsOverBooking] = useState(false);

  // Scroll handler for mobile slide in/out and booking section viewport tracking
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const delta = currentScrollY - lastScrollY.current;
      if (Math.abs(delta) > 4) {
        const nextVisible = !(currentScrollY > lastScrollY.current && currentScrollY > 30);
        setIsVisible(prev => (prev !== nextVisible ? nextVisible : prev));
        lastScrollY.current = currentScrollY;
      }

      // Check if booking section reaches the top of viewport and until it leaves
      const bookingEl = document.getElementById('booking');
      if (bookingEl) {
        const rect = bookingEl.getBoundingClientRect();
        // Desktop navbar is 64px (h-16). When booking top reaches viewport top (<= 64px) and until it leaves (> 0px)
        const isAtTop = rect.top <= 64 && rect.bottom > 0;
        setIsOverBooking(prev => (prev !== isAtTop ? isAtTop : prev));
      } else {
        setIsOverBooking(prev => (prev !== false ? false : prev));
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    // Check initial position on mount
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    if (currentView !== 'portfolio') {
      setCurrentView('portfolio');
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      {/* DESKTOP NAVBAR (Top Sticky, visible on sm and larger screens) */}
      <header
        className={`sticky top-0 z-40 w-full transition-colors duration-300 hidden sm:block ${
          isOverBooking
            ? 'bg-[#130f30]'
            : 'bg-[#d9d9d9]'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Zone 1: Logo and VDVC wordmark on left end */}
          <button
            onClick={() => {
              setCurrentView('portfolio');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="text-left group cursor-pointer focus:outline-none flex items-center gap-2.5"
          >
            {!imgError ? (
              <img
                src={logoSrc}
                alt="VDVC 4 - Logo"
                onError={() => {
                  if (logoSrc !== '/vdvc-4-logo-no-text-transparent-bg.png') {
                    const fallback = '/vdvc-4-logo-no-text-transparent-bg.png';
                    const testImg = new Image();
                    testImg.src = fallback;
                    testImg.onload = () => {
                      const el = document.getElementById('navbar-logo-img') as HTMLImageElement;
                      if (el) el.src = fallback;
                    };
                    testImg.onerror = () => setImgError(true);
                  } else {
                    setImgError(true);
                  }
                }}
                id="navbar-logo-img"
                className="w-8 h-8 object-contain shrink-0 group-hover:scale-105 transition-transform"
              />
            ) : (
              <VDVCLogo className="w-8 h-8" />
            )}
            <span
              className={`font-moon-light text-lg sm:text-xl transition-colors ${
                isOverBooking
                  ? 'text-[#d9d9d9] group-hover:text-white'
                  : 'text-slate-900 group-hover:text-slate-600'
              }`}
            >
              VDVC
            </span>
          </button>

          {/* Zone 2: Clean nav links: Gallery -> Book -> About */}
          <nav className="flex items-center gap-6 sm:gap-8 font-phenomena text-lg sm:text-xl font-bold tracking-wide">
            <button
              onClick={() => scrollTo('gallery')}
              className={`transition-colors cursor-pointer ${
                isOverBooking
                  ? 'text-[#d9d9d9] hover:text-white'
                  : currentView === 'portfolio'
                  ? 'text-slate-900'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Gallery
            </button>
            <button
              onClick={() => scrollTo('booking')}
              className={`transition-colors cursor-pointer ${
                isOverBooking
                  ? 'text-[#d9d9d9] hover:text-white'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Book
            </button>
            <button
              onClick={() => scrollTo('about')}
              className={`transition-colors cursor-pointer ${
                isOverBooking
                  ? 'text-[#d9d9d9] hover:text-white'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              About
            </button>
          </nav>

          {/* Zone 3: Far right corner emoji 😎 button */}
          <div className="flex items-center justify-end">
            <button
              onClick={onNavigateToLogin}
              className="text-xl sm:text-2xl p-1.5 hover:scale-110 active:scale-95 transition-transform duration-200 cursor-pointer focus:outline-none select-none"
              aria-label="Admin Access"
              title="Admin Login"
            >
              😎
            </button>
          </div>
        </div>
      </header>

      {/* MOBILE BOTTOM NAVBAR (Fixed at bottom of screen, reduced height h-11/h-12, slide in/out on scroll) */}
      <header
        className={`fixed bottom-0 left-0 right-0 z-50 backdrop-blur-md shadow-lg px-6 h-11 flex items-center justify-between sm:hidden transition-all duration-300 ease-in-out ${
          isOverBooking
            ? 'bg-[#130f30]/95'
            : 'bg-[#d9d9d9]/95'
        } ${effectiveMobileVisible ? 'translate-y-0' : 'translate-y-full'}`}
      >
        {/* Left: Logo Icon ONLY (No VDVC text) */}
        <button
          onClick={() => {
            setCurrentView('portfolio');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="p-1 focus:outline-none group cursor-pointer flex items-center"
          aria-label="Home"
        >
          {!imgError ? (
            <img
              src={logoSrc}
              alt="Logo"
              className="w-6 h-6 object-contain shrink-0 group-hover:scale-110 transition-transform"
            />
          ) : (
            <VDVCLogo className="w-6 h-6" />
          )}
        </button>

        {/* Center: Nav links replaced with suitable icons (compacted on mobile) */}
        <nav className="flex items-center gap-2">
          <button
            onClick={() => scrollTo('gallery')}
            className={`p-1 active:scale-95 transition-transform cursor-pointer ${
              isOverBooking
                ? 'text-[#d9d9d9] hover:text-white'
                : 'text-slate-700 hover:text-slate-950'
            }`}
            title="Gallery"
            aria-label="Gallery"
          >
            <Images className="w-5 h-5" />
          </button>
          <button
            onClick={() => scrollTo('booking')}
            className={`p-1 active:scale-95 transition-transform cursor-pointer ${
              isOverBooking
                ? 'text-[#d9d9d9] hover:text-white'
                : 'text-slate-700 hover:text-slate-950'
            }`}
            title="Book"
            aria-label="Book"
          >
            <Calendar className="w-5 h-5" />
          </button>
          <button
            onClick={() => scrollTo('about')}
            className={`p-1 active:scale-95 transition-transform cursor-pointer ${
              isOverBooking
                ? 'text-[#d9d9d9] hover:text-white'
                : 'text-slate-700 hover:text-slate-950'
            }`}
            title="About"
            aria-label="About"
          >
            <User className="w-5 h-5" />
          </button>
        </nav>

        {/* Right: Admin Emoji 😎 */}
        <button
          onClick={onNavigateToLogin}
          className="text-lg p-1 hover:scale-110 active:scale-95 transition-transform cursor-pointer focus:outline-none select-none"
          aria-label="Admin Access"
          title="Admin Login"
        >
          😎
        </button>
      </header>
    </>
  );
};
