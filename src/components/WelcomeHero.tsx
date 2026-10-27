import React from 'react';
import {
  ArrowRight,
  Leaf,
  Layers,
  HeartPulse,
  BookOpen,
  Check,
  Search,
} from 'lucide-react';
import { Language } from '../types';
import { t } from '../data/translations';
import { SAMPLE_PRESETS } from '../data/cropPresets';

interface WelcomeHeroProps {
  currentLang: Language;
  onLanguageSelect: (lang: Language) => void;
  onStartDiagnostic: () => void;
  onLoadPreset: (presetId: string) => void;
  onOpenGuide: () => void;
}

export const WelcomeHero: React.FC<WelcomeHeroProps> = ({
  currentLang,
  onLanguageSelect,
  onStartDiagnostic,
  onLoadPreset,
  onOpenGuide,
}) => {
  const strings = t[currentLang];

  return (
    <div className="max-w-4xl mx-auto space-y-12 pb-16">
      {/* Language Selection & Introduction */}
      <section className="bg-white rounded-xl p-6 sm:p-10 border border-stone-200 space-y-6">
        {/* Language switch bar right at the top */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-stone-100">
          <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
            {currentLang === 'hi' ? 'भाषा चयन / Language:' : 'Select Language / भाषा:'}
          </span>
          <div className="inline-flex rounded-md border border-stone-200 p-0.5 bg-stone-50">
            <button
              type="button"
              onClick={() => onLanguageSelect('en')}
              className={`px-3 py-1 rounded text-xs font-medium transition-colors flex items-center gap-1.5 ${
                currentLang === 'en'
                  ? 'bg-white text-emerald-900 shadow-xs font-semibold'
                  : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              <span>English</span>
              {currentLang === 'en' && <Check className="w-3.5 h-3.5 text-emerald-700" />}
            </button>
            <button
              type="button"
              onClick={() => onLanguageSelect('hi')}
              className={`px-3 py-1 rounded text-xs font-medium transition-colors flex items-center gap-1.5 ${
                currentLang === 'hi'
                  ? 'bg-white text-emerald-900 shadow-xs font-semibold'
                  : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              <span>हिन्दी</span>
              {currentLang === 'hi' && <Check className="w-3.5 h-3.5 text-emerald-700" />}
            </button>
          </div>
        </div>

        {/* Title, Description & Aims */}
        <div className="space-y-3">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-800 uppercase tracking-wider">
            <Leaf className="w-3.5 h-3.5 text-emerald-700" />
            <span>{strings.badgeAims}</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-bold tracking-tight text-stone-900 leading-tight">
            {strings.heroTitle}
          </h1>
          <p className="text-sm sm:text-base text-stone-600 leading-relaxed max-w-2xl font-normal">
            {strings.heroTagline}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
          <button
            onClick={onStartDiagnostic}
            className="w-full sm:w-auto px-6 py-2.5 rounded-lg bg-emerald-800 hover:bg-emerald-900 text-white font-medium text-xs sm:text-sm transition-colors flex items-center justify-center gap-2"
          >
            <span>{strings.heroStartBtn}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={onOpenGuide}
            className="w-full sm:w-auto px-5 py-2.5 rounded-lg border border-stone-300 hover:bg-stone-50 text-stone-700 font-medium text-xs sm:text-sm transition-colors flex items-center justify-center gap-2"
          >
            <BookOpen className="w-4 h-4 text-stone-500" />
            <span>{strings.heroLearnMoreBtn}</span>
          </button>
        </div>
      </section>

      {/* Understated Data Indicators */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { num: strings.stat1Number, label: strings.stat1Label },
          { num: strings.stat2Number, label: strings.stat2Label },
          { num: strings.stat3Number, label: strings.stat3Label },
          { num: strings.stat4Number, label: strings.stat4Label },
        ].map((stat, idx) => (
          <div
            key={idx}
            className="p-4 rounded-xl bg-white border border-stone-200 space-y-1"
          >
            <div className="text-2xl font-bold tracking-tight text-emerald-900">
              {stat.num}
            </div>
            <div className="text-xs text-stone-500 font-medium leading-snug">
              {stat.label}
            </div>
          </div>
        ))}
      </section>

      {/* 4 Core Focus Areas (No shield symbols) */}
      <section className="space-y-4">
        <div>
          <h2 className="text-base sm:text-xl font-bold text-stone-900">
            {strings.aimsHeading}
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 mt-0.5">
            {strings.aimsSub}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {[
            { title: strings.aim1Title, desc: strings.aim1Desc, icon: Search },
            { title: strings.aim2Title, desc: strings.aim2Desc, icon: Layers },
            { title: strings.aim3Title, desc: strings.aim3Desc, icon: Leaf },
            { title: strings.aim4Title, desc: strings.aim4Desc, icon: HeartPulse },
          ].map((aim, idx) => (
            <div
              key={idx}
              className="p-5 rounded-xl bg-white border border-stone-200 space-y-2 hover:border-stone-300 transition-colors"
            >
              <div className="w-7 h-7 rounded-md bg-stone-100 text-emerald-800 flex items-center justify-center">
                <aim.icon className="w-3.5 h-3.5" />
              </div>
              <h3 className="font-semibold text-stone-900 text-sm">
                {aim.title}
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed font-normal">
                {aim.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Case Studies */}
      <section className="space-y-3.5">
        <div>
          <h3 className="text-sm sm:text-base font-bold text-stone-900">
            {strings.testDriveHeading}
          </h3>
          <p className="text-xs text-stone-500 mt-0.5">
            {strings.testDriveSub}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {SAMPLE_PRESETS.map((preset) => {
            const title = currentLang === 'hi' ? preset.titleHi : preset.titleEn;
            return (
              <div
                key={preset.id}
                onClick={() => onLoadPreset(preset.id)}
                className="p-4 rounded-xl bg-white border border-stone-200 hover:border-emerald-700 transition-colors cursor-pointer flex flex-col justify-between space-y-3"
              >
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs text-stone-500 font-medium">
                    <span className="uppercase text-emerald-800 font-semibold text-[11px]">
                      {preset.crop}
                    </span>
                    <span className="text-stone-400">{preset.cropStage}</span>
                  </div>
                  <h4 className="font-semibold text-stone-900 text-xs sm:text-sm">
                    {title}
                  </h4>
                  <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed">
                    {preset.farmerNotesAndQueries}
                  </p>
                </div>

                <div className="text-xs font-semibold text-emerald-800 flex items-center gap-1 pt-1">
                  <span>{currentLang === 'hi' ? 'जाँच देखें' : 'Examine Case'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
