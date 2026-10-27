import React, { useState, useEffect } from 'react';
import {
  Volume2,
  VolumeX,
  Printer,
  RotateCcw,
  AlertTriangle,
  AlertCircle,
  CheckCircle2,
  Flame,
  Leaf,
  Bug,
  HelpCircle,
  MessageSquare,
} from 'lucide-react';
import { AssessmentForm, DiagnosisReport, Language } from '../types';
import { t } from '../data/translations';
import { FollowUpChat } from './FollowUpChat';

interface ReportViewProps {
  currentLang: Language;
  report: DiagnosisReport;
  formData: AssessmentForm;
  onReset: () => void;
}

export const ReportView: React.FC<ReportViewProps> = ({
  currentLang,
  report,
  formData,
  onReset,
}) => {
  const strings = t[currentLang];
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  const [showChat, setShowChat] = useState<boolean>(false);

  const handleToggleAudio = () => {
    if (!('speechSynthesis' in window)) {
      alert('Speech synthesis is not supported in this browser.');
      return;
    }

    if (isPlayingAudio) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
      return;
    }

    window.speechSynthesis.cancel();

    const textToRead = report.audioSummary || report.amrExplanation;
    const utterance = new SpeechSynthesisUtterance(textToRead);
    utterance.lang = currentLang === 'hi' ? 'hi-IN' : 'en-US';
    utterance.rate = 0.95;

    const voices = window.speechSynthesis.getVoices();
    const matchVoice = voices.find((v) =>
      currentLang === 'hi' ? v.lang.includes('hi') : v.lang.includes('en')
    );
    if (matchVoice) {
      utterance.voice = matchVoice;
    }

    utterance.onend = () => setIsPlayingAudio(false);
    utterance.onerror = () => setIsPlayingAudio(false);

    window.speechSynthesis.speak(utterance);
    setIsPlayingAudio(true);
  };

  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const handlePrint = () => {
    window.print();
  };

  const isHighRisk = report.riskScore >= 70;
  const isModerateRisk = report.riskScore >= 40 && report.riskScore < 70;

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20 print:p-0 print:space-y-4">
      {/* Top Banner & Quick Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white rounded-xl p-6 border border-stone-200 print:border-none">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-800 uppercase tracking-wider mb-1">
            <Leaf className="w-3.5 h-3.5 text-emerald-700" />
            <span>
              {formData.crop.toUpperCase()} • {formData.cropVarietyOrStage || 'Field Inspection'}
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-stone-900 tracking-tight">
            {strings.reportTitle}
          </h1>
          <p className="text-xs text-stone-500 mt-0.5">
            {strings.reportSubtitle}
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2 print:hidden">
          <button
            type="button"
            onClick={handleToggleAudio}
            className={`px-3.5 py-2 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors border ${
              isPlayingAudio
                ? 'bg-amber-50 text-amber-900 border-amber-300'
                : 'bg-stone-50 hover:bg-stone-100 text-stone-700 border-stone-300'
            }`}
          >
            {isPlayingAudio ? (
              <>
                <VolumeX className="w-3.5 h-3.5" />
                <span>{strings.stopAudioBtn}</span>
              </>
            ) : (
              <>
                <Volume2 className="w-3.5 h-3.5 text-emerald-700" />
                <span>{strings.listenAdvisoryBtn}</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="px-3.5 py-2 rounded-lg border border-stone-300 bg-white hover:bg-stone-50 text-stone-700 text-xs font-medium flex items-center gap-1.5 transition-colors"
          >
            <Printer className="w-3.5 h-3.5 text-stone-500" />
            <span>{strings.printReportBtn}</span>
          </button>

          <button
            type="button"
            onClick={onReset}
            className="px-3.5 py-2 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-medium flex items-center gap-1.5 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5 text-stone-500" />
            <span>{strings.testAnotherBtn}</span>
          </button>
        </div>
      </div>

      {/* Likelihood & Clinical Analysis */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Metric Card */}
        <div className="md:col-span-1 bg-white rounded-xl p-6 border border-stone-200 flex flex-col items-center justify-center text-center space-y-3">
          <span className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider">
            {strings.scoreLabel}
          </span>

          <div className="text-5xl font-extrabold text-stone-900 tracking-tight">
            {report.riskScore}%
          </div>

          <div
            className={`px-3 py-1 rounded-md text-xs font-semibold border flex items-center gap-1.5 ${
              isHighRisk
                ? 'bg-rose-50 border-rose-200 text-rose-800'
                : isModerateRisk
                ? 'bg-amber-50 border-amber-200 text-amber-800'
                : 'bg-emerald-50 border-emerald-200 text-emerald-800'
            }`}
          >
            {isHighRisk ? (
              <AlertCircle className="w-3.5 h-3.5 text-rose-700" />
            ) : (
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
            )}
            <span>{report.likelihoodRatingLocalized || report.likelihoodRating}</span>
          </div>

          <p className="text-xs text-stone-600 leading-normal font-normal">
            {isHighRisk
              ? currentLang === 'hi'
                ? 'लक्षण और छिड़काव इतिहास रोगाणुरोधी प्रतिरोध का स्पष्ट संकेत देते हैं।'
                : 'Reported symptoms and spray history strongly indicate pathogen resistance.'
              : isModerateRisk
              ? currentLang === 'hi'
                ? 'दवा सहनशीलता के प्रारंभिक संकेत। रासायनिक चक्र में तत्काल बदलाव करें।'
                : 'Early tolerance detected. Immediate mode-of-action rotation recommended.'
              : currentLang === 'hi'
                ? 'प्रतिरोध का कम जोखिम। यह एक सामान्य प्राथमिक संक्रमण प्रतीत होता है।'
                : 'Low AMR likelihood. Follow standard disease control measures.'}
          </p>
        </div>

        {/* Pathology Analysis */}
        <div className="md:col-span-2 bg-white rounded-xl p-6 border border-stone-200 space-y-4">
          <div className="flex items-center gap-2">
            <Leaf className="w-4 h-4 text-emerald-700" />
            <h3 className="text-sm font-bold text-stone-900 uppercase tracking-wider">
              {strings.whyResistanceHappens}
            </h3>
          </div>

          <p className="text-xs sm:text-sm text-stone-800 font-normal leading-relaxed bg-stone-50 p-4 rounded-lg border border-stone-200">
            {report.amrExplanation}
          </p>

          {/* Suspected Pathogens */}
          <div className="space-y-2 pt-1">
            <h4 className="text-[11px] font-semibold uppercase tracking-wider text-stone-500 flex items-center gap-1">
              <Bug className="w-3.5 h-3.5 text-stone-500" />
              <span>{strings.suspectedPathogensTitle}</span>
            </h4>

            <div className="space-y-2">
              {report.suspectedPathogens.map((pathogen, i) => (
                <div
                  key={i}
                  className="p-3 rounded-lg bg-stone-50/70 border border-stone-200 text-xs space-y-1"
                >
                  <div className="flex items-center justify-between font-semibold">
                    <span className="italic text-stone-900">
                      {pathogen.scientificName}
                    </span>
                    <span className="text-[11px] text-stone-600">
                      {pathogen.commonName}
                    </span>
                  </div>
                  <p className="text-stone-600 leading-normal">
                    <strong className="text-stone-700">Mechanism: </strong>
                    {pathogen.resistanceMechanism}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Answers to Farmer Queries / Notes */}
      <div className="bg-stone-50 rounded-xl p-5 sm:p-6 border border-stone-200 space-y-2">
        <div className="flex items-center gap-2">
          <HelpCircle className="w-4 h-4 text-emerald-800" />
          <h3 className="text-sm font-bold text-stone-900">
            {strings.queryAnswersTitle}
          </h3>
        </div>
        {formData.farmerNotesAndQueries && (
          <p className="text-xs text-stone-500 italic">
            "{formData.farmerNotesAndQueries}"
          </p>
        )}
        <div className="text-xs sm:text-sm text-stone-800 leading-relaxed font-normal pt-1">
          {report.answersToFarmerQueries}
        </div>
      </div>

      {/* Immediate Actions vs Long-term Prevention */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Immediate Actions */}
        <div className="bg-white rounded-xl p-5 sm:p-6 border border-stone-200 space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-stone-100">
            <Flame className="w-4 h-4 text-rose-700" />
            <h3 className="text-sm font-bold text-stone-900">
              {strings.immediateActionTitle}
            </h3>
          </div>

          <div className="space-y-2.5">
            {report.immediateTreatmentSteps.map((step, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-lg border border-stone-200 bg-stone-50/50 space-y-1 text-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-stone-900 flex items-center gap-1.5">
                    <span className="text-stone-500 font-mono text-[11px]">{idx + 1}.</span>
                    <span>{step.title}</span>
                  </span>
                  {step.isCritical && (
                    <span className="text-[10px] font-semibold text-rose-800 bg-rose-50 px-1.5 py-0.5 rounded border border-rose-200">
                      Priority
                    </span>
                  )}
                </div>
                <p className="text-stone-600 leading-relaxed pl-4">
                  {step.action}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Long-Term IPM */}
        <div className="bg-white rounded-xl p-5 sm:p-6 border border-stone-200 space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-stone-100">
            <CheckCircle2 className="w-4 h-4 text-emerald-700" />
            <h3 className="text-sm font-bold text-stone-900">
              {strings.preventiveActionTitle}
            </h3>
          </div>

          <div className="space-y-2.5">
            {report.preventiveAndIPMProtocols.map((protocol, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-lg border border-stone-200 bg-stone-50/50 space-y-1 text-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-stone-900 flex items-center gap-1.5">
                    <span className="text-stone-500 font-mono text-[11px]">{idx + 1}.</span>
                    <span>{protocol.title}</span>
                  </span>
                  <span className="text-[10px] text-stone-500 font-medium bg-white px-1.5 py-0.5 rounded border border-stone-200">
                    {protocol.category}
                  </span>
                </div>
                <p className="text-stone-600 leading-relaxed pl-4">
                  {protocol.action}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Field Warnings */}
      {report.warningSigns && report.warningSigns.length > 0 && (
        <div className="bg-amber-50/70 rounded-xl p-4 border border-amber-200 space-y-1.5 text-xs">
          <div className="flex items-center gap-1.5 text-amber-900 font-semibold">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-700 shrink-0" />
            <span>{strings.warningSignsTitle}</span>
          </div>
          <ul className="list-disc list-inside text-stone-700 space-y-0.5 pl-1">
            {report.warningSigns.map((w, i) => (
              <li key={i}>{w}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Consultation Desk Toggle */}
      <div className="bg-white rounded-xl p-5 sm:p-6 border border-stone-200 space-y-4 print:hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-stone-100 text-stone-700 flex items-center justify-center">
              <MessageSquare className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-stone-900">
                {strings.chatTitle}
              </h3>
              <p className="text-xs text-stone-500">
                {strings.chatSubtitle}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setShowChat((prev) => !prev)}
            className="self-start sm:self-auto px-4 py-2 rounded-lg bg-stone-900 hover:bg-stone-800 text-white text-xs font-medium transition-colors"
          >
            {showChat
              ? currentLang === 'hi'
                ? 'परामर्श बंद करें'
                : 'Close Consultation'
              : strings.askSpecialistBtn}
          </button>
        </div>

        {showChat && (
          <div className="pt-3 border-t border-stone-200">
            <FollowUpChat currentLang={currentLang} context={formData} />
          </div>
        )}
      </div>
    </div>
  );
};
