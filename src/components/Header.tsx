import React from 'react';
import { Leaf } from 'lucide-react';
import { Language } from '../types';
import { t } from '../data/translations';

interface HeaderProps {
  currentLang: Language;
  onLanguageChange: (lang: Language) => void;
  activeView: 'home' | 'diagnose' | 'report';
  onNavigate: (view: 'home' | 'diagnose') => void;
  onOpenGuide: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentLang,
  onLanguageChange,
  activeView,
  onNavigate,
  onOpenGuide,
}) => {
  const strings = t[currentLang];

  return (
    <header className="bg-white border-b border-stone-200 text-stone-900">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-14">
          {/* Brand: Simple typography, natural leaf accent, no shield */}
          <button
            type="button"
            onClick={() => onNavigate('home')}
            className="flex items-center gap-2 text-left group"
          >
            <Leaf className="w-4 h-4 text-emerald-800 shrink-0" />
            <div className="flex items-baseline gap-2">
              <span className="font-bold text-sm tracking-tight text-stone-900 group-hover:text-emerald-800 transition-colors">
                {strings.appName}
              </span>
              <span className="text-[11px] text-stone-500 font-normal hidden sm:inline">
                / {currentLang === 'hi' ? 'पादप रोग प्रतिरोध' : 'Crop Resistance Diagnostic'}
              </span>
            </div>
          </button>

          {/* Understated text navigation & clean language toggle */}
          <div className="flex items-center gap-5 text-xs">
            <nav className="flex items-center gap-4 text-stone-600 font-medium">
              <button
                onClick={() => onNavigate('home')}
                className={`hover:text-stone-900 transition-colors ${
                  activeView === 'home' ? 'text-emerald-900 font-semibold underline underline-offset-4 decoration-emerald-700' : ''
                }`}
              >
                {strings.navHome}
              </button>
              <button
                onClick={() => onNavigate('diagnose')}
                className={`hover:text-stone-900 transition-colors ${
                  activeView === 'diagnose' || activeView === 'report' ? 'text-emerald-900 font-semibold underline underline-offset-4 decoration-emerald-700' : ''
                }`}
              >
                {strings.navDiagnose}
              </button>
              <button
                onClick={onOpenGuide}
                className="hover:text-stone-900 transition-colors hidden sm:block"
              >
                {strings.navEducation}
              </button>
            </nav>

            <span className="text-stone-300">|</span>

            {/* Plain minimal language switcher */}
            <div className="flex items-center gap-1.5 text-xs font-medium">
              <button
                type="button"
                onClick={() => onLanguageChange('en')}
                className={`px-1.5 py-0.5 rounded transition-colors ${
                  currentLang === 'en'
                    ? 'text-emerald-900 font-bold bg-emerald-50'
                    : 'text-stone-400 hover:text-stone-700'
                }`}
              >
                EN
              </button>
              <span className="text-stone-300 text-[10px]">/</span>
              <button
                type="button"
                onClick={() => onLanguageChange('hi')}
                className={`px-1.5 py-0.5 rounded transition-colors ${
                  currentLang === 'hi'
                    ? 'text-emerald-900 font-bold bg-emerald-50'
                    : 'text-stone-400 hover:text-stone-700'
                }`}
              >
                हिन्दी
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
