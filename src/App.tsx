import React, { useState } from 'react';
import { Header } from './components/Header';
import { WelcomeHero } from './components/WelcomeHero';
import { DiagnosticWizard } from './components/DiagnosticWizard';
import { ReportView } from './components/ReportView';
import { EducationModal } from './components/EducationModal';
import { AssessmentForm, DiagnosisReport, Language } from './types';
import { SAMPLE_PRESETS } from './data/cropPresets';
import { t } from './data/translations';

const initialFormData: AssessmentForm = {
  crop: 'rice',
  cropVarietyOrStage: '',
  symptoms: ['leaf_scorch_drying'],
  sprayHistory: {
    antibioticsOrFungicidesUsed: ['streptocycline'],
    sprayFrequency: '3-5 times (Moderate)',
    prophylacticSpraying: true,
    dosageTrend: 'Increased dosage (1.5x - 2x)',
    diminishingEfficacyNoticed: true,
    neighbouringFieldsAffected: true,
  },
  environmental: {
    irrigationType: 'Flood / Furrow Irrigation',
    recentWeather: 'Hot, humid & intermittent cloudy rain',
    soilPractice: 'Heavy synthetic NPK fertilizers, minimal organic compost',
  },
  farmerNotesAndQueries: '',
};

export default function App() {
  const [currentLang, setCurrentLang] = useState<Language>('en');
  const [activeView, setActiveView] = useState<'home' | 'diagnose' | 'report'>('home');
  const [formData, setFormData] = useState<AssessmentForm>(initialFormData);
  const [report, setReport] = useState<DiagnosisReport | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isGuideOpen, setIsGuideOpen] = useState<boolean>(false);

  const strings = t[currentLang];

  const handleLanguageChange = (newLang: Language) => {
    setCurrentLang(newLang);
  };

  const handleStartDiagnostic = () => {
    setActiveView('diagnose');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLoadPreset = async (presetId: string) => {
    const preset = SAMPLE_PRESETS.find((p) => p.id === presetId);
    if (!preset) return;

    const populated: AssessmentForm = {
      crop: preset.crop,
      cropVarietyOrStage: preset.cropStage,
      symptoms: preset.symptoms,
      sprayHistory: {
        antibioticsOrFungicidesUsed: preset.sprayHistory.antibioticsOrFungicidesUsed,
        sprayFrequency: preset.sprayHistory.sprayFrequency,
        prophylacticSpraying: preset.sprayHistory.prophylacticSpraying,
        dosageTrend: preset.sprayHistory.dosageTrend,
        diminishingEfficacyNoticed: preset.sprayHistory.diminishingEfficacyNoticed,
        neighbouringFieldsAffected: preset.sprayHistory.neighbouringFieldsAffected,
      },
      environmental: {
        irrigationType: preset.environmental.irrigationType,
        recentWeather: preset.environmental.recentWeather,
        soilPractice: preset.environmental.soilPractice,
      },
      farmerNotesAndQueries: preset.farmerNotesAndQueries,
    };

    setFormData(populated);
    // Execute diagnosis directly for instant demonstration
    runDiagnosisWithData(populated);
  };

  const runDiagnosisWithData = async (dataToSubmit: AssessmentForm) => {
    setIsLoading(true);
    setActiveView('diagnose');

    try {
      const response = await fetch('/api/diagnose', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...dataToSubmit,
          language: currentLang,
        }),
      });

      const data = await response.json();
      if (data.report) {
        setReport(data.report);
        setActiveView('report');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } catch (err) {
      console.error('Diagnosis submission error:', err);
      alert(
        currentLang === 'hi'
          ? 'जाँच रिपोर्ट तैयार करने में समस्या आई। कृपया पुनः प्रयास करें।'
          : 'Could not generate report. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitDiagnosis = () => {
    runDiagnosisWithData(formData);
  };

  const handleReset = () => {
    setReport(null);
    setFormData(initialFormData);
    setActiveView('diagnose');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-stone-100 text-stone-900 font-sans flex flex-col selection:bg-emerald-100">
      {/* App Header */}
      <Header
        currentLang={currentLang}
        onLanguageChange={handleLanguageChange}
        activeView={activeView}
        onNavigate={(view) => setActiveView(view)}
        onOpenGuide={() => setIsGuideOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 pt-8 pb-12">
        {activeView === 'home' && (
          <WelcomeHero
            currentLang={currentLang}
            onLanguageSelect={handleLanguageChange}
            onStartDiagnostic={handleStartDiagnostic}
            onLoadPreset={handleLoadPreset}
            onOpenGuide={() => setIsGuideOpen(true)}
          />
        )}

        {activeView === 'diagnose' && (
          <DiagnosticWizard
            currentLang={currentLang}
            formData={formData}
            onChange={setFormData}
            onSubmit={handleSubmitDiagnosis}
            isLoading={isLoading}
            onCancel={() => setActiveView('home')}
          />
        )}

        {activeView === 'report' && report && (
          <ReportView
            currentLang={currentLang}
            report={report}
            formData={formData}
            onReset={handleReset}
          />
        )}
      </main>

      {/* Field Manual Modal */}
      <EducationModal
        currentLang={currentLang}
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
        onStartDiagnose={() => {
          setIsGuideOpen(false);
          setActiveView('diagnose');
        }}
      />

      {/* Clean Minimalist Footer */}
      <footer className="mt-auto border-t border-stone-200 bg-white py-6 px-4 text-center text-xs text-stone-500 space-y-1.5 print:hidden">
        <div className="flex flex-wrap items-center justify-center gap-3 text-xs font-medium text-stone-700">
          <span>{strings.appName}</span>
          <span>•</span>
          <span>{strings.appSub}</span>
          <span>•</span>
          <button
            onClick={() => setIsGuideOpen(true)}
            className="hover:underline text-emerald-800 font-semibold"
          >
            {strings.navEducation}
          </button>
        </div>
        <p className="max-w-2xl mx-auto text-[11px] text-stone-400">
          {currentLang === 'hi'
            ? 'अस्वीकरण: यह प्रणाली पादप रोग विज्ञान और एएमआर जैव-सुरक्षा दिशानिर्देशों पर आधारित है। गंभीर प्रकोप की स्थिति में नजदीकी कृषि विज्ञान केंद्र (KVK) से संपर्क करें।'
            : 'Disclaimer: This platform provides agricultural resistance probability. For severe local outbreaks, please consult your regional Krishi Vigyan Kendra (KVK) or State Agricultural Extension Officer.'}
        </p>
      </footer>
    </div>
  );
}
