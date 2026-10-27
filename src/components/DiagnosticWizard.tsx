import React, { useState } from 'react';
import {
  ArrowRight,
  ArrowLeft,
  Mic,
  MicOff,
  Check,
  Info,
  Calendar,
  CloudRain,
  Layers,
  FlaskConical,
  Activity,
  FileText,
} from 'lucide-react';
import { AssessmentForm, Language } from '../types';
import { CROPS, SYMPTOMS, SPRAY_CHEMICALS } from '../data/cropPresets';
import { t } from '../data/translations';

interface DiagnosticWizardProps {
  currentLang: Language;
  formData: AssessmentForm;
  onChange: (data: AssessmentForm) => void;
  onSubmit: () => void;
  isLoading: boolean;
  onCancel: () => void;
}

export const DiagnosticWizard: React.FC<DiagnosticWizardProps> = ({
  currentLang,
  formData,
  onChange,
  onSubmit,
  isLoading,
  onCancel,
}) => {
  const strings = t[currentLang];
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const totalSteps = 6;

  const handleCropSelect = (cropId: string) => {
    onChange({ ...formData, crop: cropId });
  };

  const handleToggleSymptom = (symptomId: string) => {
    const exists = formData.symptoms.includes(symptomId);
    const updated = exists
      ? formData.symptoms.filter((s) => s !== symptomId)
      : [...formData.symptoms, symptomId];
    onChange({ ...formData, symptoms: updated });
  };

  const handleToggleChemical = (chemId: string) => {
    const exists = formData.sprayHistory.antibioticsOrFungicidesUsed.includes(chemId);
    const updated = exists
      ? formData.sprayHistory.antibioticsOrFungicidesUsed.filter((c) => c !== chemId)
      : [...formData.sprayHistory.antibioticsOrFungicidesUsed, chemId];
    onChange({
      ...formData,
      sprayHistory: {
        ...formData.sprayHistory,
        antibioticsOrFungicidesUsed: updated,
      },
    });
  };

  const handleAddChip = (chipText: string) => {
    const prev = formData.farmerNotesAndQueries.trim();
    const updated = prev ? `${prev}. ${chipText}` : chipText;
    onChange({ ...formData, farmerNotesAndQueries: updated });
  };

  const handleToggleVoice = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert(
        currentLang === 'hi'
          ? 'ब्राउज़र में वॉइस इनपुट उपलब्ध नहीं है। कृपया लिखकर बताएं।'
          : 'Voice input is not supported in this browser. Please type your notes.'
      );
      return;
    }

    if (isRecording) {
      setIsRecording(false);
      return;
    }

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = currentLang === 'hi' ? 'hi-IN' : 'en-US';
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => setIsRecording(true);
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      const prev = formData.farmerNotesAndQueries.trim();
      const updated = prev ? `${prev} ${transcript}` : transcript;
      onChange({ ...formData, farmerNotesAndQueries: updated });
      setIsRecording(false);
    };
    recognition.onerror = () => setIsRecording(false);
    recognition.onend = () => setIsRecording(false);
    recognition.start();
  };

  const canProceed = () => {
    if (currentStep === 1) return !!formData.crop;
    if (currentStep === 2) return formData.symptoms.length > 0;
    return true;
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-16">
      {/* Step header */}
      <div className="bg-white rounded-xl p-6 border border-stone-200 space-y-3">
        <div className="flex items-center justify-between text-xs text-stone-500 font-medium">
          <span className="text-emerald-800 font-semibold uppercase tracking-wider text-[11px]">
            {currentLang === 'hi' ? `चरण 0${currentStep} / 0${totalSteps}` : `Step 0${currentStep} of 0${totalSteps}`}
          </span>
          <button
            onClick={onCancel}
            className="text-stone-400 hover:text-stone-700 underline"
          >
            {currentLang === 'hi' ? 'वापस जाएं' : 'Exit to overview'}
          </button>
        </div>

        <div>
          <h2 className="text-lg sm:text-xl font-bold text-stone-900">
            {currentStep === 1 && strings.step1Title}
            {currentStep === 2 && strings.step2Title}
            {currentStep === 3 && strings.step3Title}
            {currentStep === 4 && strings.step4Title}
            {currentStep === 5 && strings.step5Title}
            {currentStep === 6 && strings.step6Title}
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 mt-0.5">
            {currentStep === 1 && strings.step1Prompt}
            {currentStep === 2 && strings.step2Prompt}
            {currentStep === 3 && strings.step3Prompt}
            {currentStep === 4 && strings.step4Prompt}
            {currentStep === 5 && strings.step5Prompt}
            {currentStep === 6 && strings.step6Sub}
          </p>
        </div>

        {/* Minimal Progress Line */}
        <div className="w-full bg-stone-100 h-1 rounded-full overflow-hidden">
          <div
            className="bg-emerald-700 h-full transition-all duration-200"
            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
          />
        </div>
      </div>

      {/* Main question box */}
      <div className="bg-white rounded-xl p-6 sm:p-7 border border-stone-200 space-y-6">
        {/* STEP 1: Crop Selection */}
        {currentStep === 1 && (
          <div className="space-y-5">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5">
              {CROPS.map((c) => {
                const isSelected = formData.crop === c.id;
                const name = currentLang === 'hi' ? c.nameHi : c.nameEn;
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => handleCropSelect(c.id)}
                    className={`p-3 rounded-lg border text-center transition-colors flex flex-col items-center justify-center gap-1.5 ${
                      isSelected
                        ? 'border-emerald-700 bg-emerald-50 text-emerald-950 font-semibold'
                        : 'border-stone-200 hover:border-stone-400 bg-white text-stone-800'
                    }`}
                  >
                    <span className="text-2xl">{c.icon}</span>
                    <span className="text-xs font-medium">{name}</span>
                  </button>
                );
              })}
            </div>

            <div className="space-y-1.5 pt-2">
              <label className="text-xs font-semibold text-stone-700 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-stone-500" />
                <span>{strings.cropStageLabel}</span>
              </label>
              <input
                type="text"
                value={formData.cropVarietyOrStage}
                onChange={(e) =>
                  onChange({ ...formData, cropVarietyOrStage: e.target.value })
                }
                placeholder={strings.cropStagePlaceholder}
                className="w-full px-3.5 py-2 rounded-lg border border-stone-300 text-xs sm:text-sm text-stone-900 focus:outline-none focus:border-emerald-700"
              />
            </div>
          </div>
        )}

        {/* STEP 2: Symptoms */}
        {currentStep === 2 && (
          <div className="space-y-3.5">
            <div className="flex items-center gap-2 text-xs text-stone-600 bg-stone-50 p-2.5 rounded-lg border border-stone-200">
              <Info className="w-4 h-4 text-emerald-700 shrink-0" />
              <span>{strings.step2Hint}</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {SYMPTOMS.map((sym) => {
                const isSelected = formData.symptoms.includes(sym.id);
                const title = currentLang === 'hi' ? sym.nameHi : sym.nameEn;
                const desc = currentLang === 'hi' ? sym.descriptionHi : sym.descriptionEn;

                return (
                  <div
                    key={sym.id}
                    onClick={() => handleToggleSymptom(sym.id)}
                    className={`p-3.5 rounded-lg border cursor-pointer transition-colors flex items-start gap-2.5 ${
                      isSelected
                        ? 'border-emerald-700 bg-emerald-50/70'
                        : 'border-stone-200 hover:border-stone-300 bg-white'
                    }`}
                  >
                    <span className="text-xl shrink-0 mt-0.5">{sym.icon}</span>
                    <div className="flex-1 space-y-0.5">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs sm:text-sm font-semibold text-stone-900">
                          {title}
                        </h4>
                        {sym.isAMRIndicator && (
                          <span className="text-[10px] font-medium text-amber-800 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200 shrink-0 ml-1.5">
                            AMR Clue
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-stone-600 leading-normal">
                        {desc}
                      </p>
                    </div>
                    <div
                      className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 mt-0.5 ${
                        isSelected
                          ? 'bg-emerald-700 border-emerald-700 text-white'
                          : 'border-stone-300 bg-white'
                      }`}
                    >
                      {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 3: Spray History */}
        {currentStep === 3 && (
          <div className="space-y-5">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-stone-800 uppercase tracking-wider flex items-center gap-1.5">
                <FlaskConical className="w-3.5 h-3.5 text-stone-500" />
                <span>{strings.step3Prompt}</span>
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {SPRAY_CHEMICALS.map((chem) => {
                  const isSelected =
                    formData.sprayHistory.antibioticsOrFungicidesUsed.includes(chem.id);
                  const name = currentLang === 'hi' ? chem.nameHi : chem.nameEn;

                  return (
                    <div
                      key={chem.id}
                      onClick={() => handleToggleChemical(chem.id)}
                      className={`p-3 rounded-lg border cursor-pointer transition-colors flex items-center justify-between gap-2 ${
                        isSelected
                          ? 'border-emerald-700 bg-emerald-50'
                          : 'border-stone-200 hover:border-stone-300 bg-white'
                      }`}
                    >
                      <div>
                        <div className="text-xs font-semibold text-stone-900">
                          {name}
                        </div>
                        <div className="text-[11px] text-stone-500">
                          {chem.type}
                        </div>
                      </div>
                      <div
                        className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${
                          isSelected
                            ? 'bg-emerald-700 border-emerald-700 text-white'
                            : 'border-stone-300 bg-white'
                        }`}
                      >
                        {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-stone-200">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-stone-700">
                  {strings.frequencyLabel}
                </label>
                <select
                  value={formData.sprayHistory.sprayFrequency}
                  onChange={(e) =>
                    onChange({
                      ...formData,
                      sprayHistory: {
                        ...formData.sprayHistory,
                        sprayFrequency: e.target.value,
                      },
                    })
                  }
                  className="w-full px-3 py-2 rounded-lg border border-stone-300 bg-white text-xs font-medium text-stone-900 focus:outline-none focus:border-emerald-700"
                >
                  <option value="1-2 times (Occasional)">{strings.freqOption1}</option>
                  <option value="3-5 times (Moderate)">{strings.freqOption2}</option>
                  <option value="Weekly or >6 times (Intensive)">
                    {strings.freqOption3}
                  </option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-stone-700">
                  {strings.prophylacticLabel}
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      onChange({
                        ...formData,
                        sprayHistory: {
                          ...formData.sprayHistory,
                          prophylacticSpraying: true,
                        },
                      })
                    }
                    className={`py-2 px-3 rounded-lg border text-xs font-medium transition-colors ${
                      formData.sprayHistory.prophylacticSpraying
                        ? 'bg-emerald-700 text-white border-emerald-700'
                        : 'bg-white border-stone-300 text-stone-700 hover:bg-stone-50'
                    }`}
                  >
                    {strings.yes}
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      onChange({
                        ...formData,
                        sprayHistory: {
                          ...formData.sprayHistory,
                          prophylacticSpraying: false,
                        },
                      })
                    }
                    className={`py-2 px-3 rounded-lg border text-xs font-medium transition-colors ${
                      !formData.sprayHistory.prophylacticSpraying
                        ? 'bg-emerald-700 text-white border-emerald-700'
                        : 'bg-white border-stone-300 text-stone-700 hover:bg-stone-50'
                    }`}
                  >
                    {strings.no}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: Diminishing Efficacy & Dosage */}
        {currentStep === 4 && (
          <div className="space-y-5">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-stone-800 uppercase tracking-wider flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-stone-500" />
                <span>{strings.diminishingEfficacyLabel}</span>
              </label>
              <div className="space-y-2">
                <div
                  onClick={() =>
                    onChange({
                      ...formData,
                      sprayHistory: {
                        ...formData.sprayHistory,
                        diminishingEfficacyNoticed: true,
                      },
                    })
                  }
                  className={`p-3.5 rounded-lg border cursor-pointer transition-colors flex items-center justify-between ${
                    formData.sprayHistory.diminishingEfficacyNoticed
                      ? 'border-emerald-700 bg-emerald-50 text-stone-900 font-medium'
                      : 'border-stone-200 hover:border-stone-300 bg-white text-stone-700'
                  }`}
                >
                  <span className="text-xs sm:text-sm">{strings.diminishingYes}</span>
                  {formData.sprayHistory.diminishingEfficacyNoticed && (
                    <Check className="w-4 h-4 text-emerald-700 stroke-[3]" />
                  )}
                </div>

                <div
                  onClick={() =>
                    onChange({
                      ...formData,
                      sprayHistory: {
                        ...formData.sprayHistory,
                        diminishingEfficacyNoticed: false,
                      },
                    })
                  }
                  className={`p-3.5 rounded-lg border cursor-pointer transition-colors flex items-center justify-between ${
                    !formData.sprayHistory.diminishingEfficacyNoticed
                      ? 'border-emerald-700 bg-emerald-50 text-stone-900 font-medium'
                      : 'border-stone-200 hover:border-stone-300 bg-white text-stone-700'
                  }`}
                >
                  <span className="text-xs sm:text-sm">{strings.diminishingNo}</span>
                  {!formData.sprayHistory.diminishingEfficacyNoticed && (
                    <Check className="w-4 h-4 text-emerald-700 stroke-[3]" />
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-2 pt-2 border-t border-stone-200">
              <label className="text-xs font-semibold text-stone-700">
                {strings.dosageTrendLabel}
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {[
                  { val: 'Normal recommended packet dosage', label: strings.dosageTrendOption1 },
                  { val: 'Increased dosage (1.5x - 2x)', label: strings.dosageTrendOption2 },
                  { val: 'Mixed multiple antibiotic & fungicide cocktails', label: strings.dosageTrendOption3 },
                ].map((opt, i) => {
                  const isSelected = formData.sprayHistory.dosageTrend === opt.val;
                  return (
                    <button
                      key={i}
                      type="button"
                      onClick={() =>
                        onChange({
                          ...formData,
                          sprayHistory: {
                            ...formData.sprayHistory,
                            dosageTrend: opt.val,
                          },
                        })
                      }
                      className={`p-3 rounded-lg border text-left text-xs font-medium transition-colors ${
                        isSelected
                          ? 'bg-emerald-700 text-white border-emerald-700'
                          : 'bg-white border-stone-300 text-stone-800 hover:bg-stone-50'
                      }`}
                    >
                      {opt.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="space-y-2 pt-2 border-t border-stone-200">
              <label className="text-xs font-semibold text-stone-700">
                {strings.neighbourLabel}
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() =>
                    onChange({
                      ...formData,
                      sprayHistory: {
                        ...formData.sprayHistory,
                        neighbouringFieldsAffected: true,
                      },
                    })
                  }
                  className={`p-2.5 rounded-lg border text-xs font-medium transition-colors ${
                    formData.sprayHistory.neighbouringFieldsAffected
                      ? 'bg-emerald-700 text-white border-emerald-700'
                      : 'bg-white border-stone-300 text-stone-800 hover:bg-stone-50'
                  }`}
                >
                  {strings.neighbourYes}
                </button>
                <button
                  type="button"
                  onClick={() =>
                    onChange({
                      ...formData,
                      sprayHistory: {
                        ...formData.sprayHistory,
                        neighbouringFieldsAffected: false,
                      },
                    })
                  }
                  className={`p-2.5 rounded-lg border text-xs font-medium transition-colors ${
                    !formData.sprayHistory.neighbouringFieldsAffected
                      ? 'bg-emerald-700 text-white border-emerald-700'
                      : 'bg-white border-stone-300 text-stone-800 hover:bg-stone-50'
                  }`}
                >
                  {strings.neighbourNo}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* STEP 5: Environment */}
        {currentStep === 5 && (
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-stone-700 flex items-center gap-1.5 uppercase tracking-wider">
                <CloudRain className="w-3.5 h-3.5 text-stone-500" />
                <span>{strings.irrigationLabel}</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {[
                  { val: 'Drip Irrigation', label: strings.irrigationOption1 },
                  { val: 'Flood / Furrow Irrigation', label: strings.irrigationOption2 },
                  { val: 'Rainfed / Sprinkler', label: strings.irrigationOption3 },
                ].map((opt, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() =>
                      onChange({
                        ...formData,
                        environmental: {
                          ...formData.environmental,
                          irrigationType: opt.val,
                        },
                      })
                    }
                    className={`p-2.5 rounded-lg border text-xs font-medium transition-colors ${
                      formData.environmental.irrigationType === opt.val
                        ? 'bg-emerald-700 text-white border-emerald-700'
                        : 'bg-white border-stone-300 text-stone-800 hover:bg-stone-50'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1.5 pt-2 border-t border-stone-200">
              <label className="text-xs font-semibold text-stone-700 uppercase tracking-wider">
                {strings.weatherLabel}
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {[
                  { val: 'Hot, humid & intermittent cloudy rain', label: strings.weatherOption1 },
                  { val: 'Heavy continuous rain & waterlogging', label: strings.weatherOption2 },
                  { val: 'Dry & warm weather', label: strings.weatherOption3 },
                ].map((opt, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() =>
                      onChange({
                        ...formData,
                        environmental: {
                          ...formData.environmental,
                          recentWeather: opt.val,
                        },
                      })
                    }
                    className={`p-2.5 rounded-lg border text-xs font-medium transition-colors text-left ${
                      formData.environmental.recentWeather === opt.val
                        ? 'bg-emerald-700 text-white border-emerald-700'
                        : 'bg-white border-stone-300 text-stone-800 hover:bg-stone-50'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1.5 pt-2 border-t border-stone-200">
              <label className="text-xs font-semibold text-stone-700 flex items-center gap-1.5 uppercase tracking-wider">
                <Layers className="w-3.5 h-3.5 text-stone-500" />
                <span>{strings.soilLabel}</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {[
                  { val: 'Heavy synthetic NPK fertilizers, minimal organic compost', label: strings.soilOption1 },
                  { val: 'Added cow dung manure (FYM) or vermicompost', label: strings.soilOption2 },
                  { val: 'Regular bio-fertilizers, Jeevamrut, or Trichoderma enriched soil', label: strings.soilOption3 },
                ].map((opt, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() =>
                      onChange({
                        ...formData,
                        environmental: {
                          ...formData.environmental,
                          soilPractice: opt.val,
                        },
                      })
                    }
                    className={`p-2.5 rounded-lg border text-xs font-medium transition-colors text-left ${
                      formData.environmental.soilPractice === opt.val
                        ? 'bg-emerald-700 text-white border-emerald-700'
                        : 'bg-white border-stone-300 text-stone-800 hover:bg-stone-50'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* STEP 6: Field Observations & Queries */}
        {currentStep === 6 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm sm:text-base font-bold text-stone-900 flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-emerald-700" />
                  <span>{strings.step6Prompt}</span>
                </h3>
                <p className="text-xs text-stone-600 mt-0.5">
                  {strings.step6Sub}
                </p>
              </div>

              <button
                type="button"
                onClick={handleToggleVoice}
                className={`px-3 py-1.5 rounded-md text-xs font-medium flex items-center gap-1.5 transition-colors border ${
                  isRecording
                    ? 'bg-red-700 text-white border-red-700'
                    : 'bg-stone-50 hover:bg-stone-100 text-stone-700 border-stone-300'
                }`}
              >
                {isRecording ? (
                  <>
                    <MicOff className="w-3.5 h-3.5" />
                    <span>{strings.speechStop}</span>
                  </>
                ) : (
                  <>
                    <Mic className="w-3.5 h-3.5 text-stone-600" />
                    <span>{strings.speechStart}</span>
                  </>
                )}
              </button>
            </div>

            {isRecording && (
              <div className="p-2.5 bg-red-50 border border-red-200 rounded-lg text-xs text-red-800 font-medium">
                {strings.speechListening}
              </div>
            )}

            <textarea
              rows={4}
              value={formData.farmerNotesAndQueries}
              onChange={(e) =>
                onChange({ ...formData, farmerNotesAndQueries: e.target.value })
              }
              placeholder={strings.notesPlaceholder}
              className="w-full p-3.5 rounded-lg border border-stone-300 text-xs sm:text-sm text-stone-900 focus:outline-none focus:border-emerald-700 leading-relaxed font-normal"
            />

            <div className="space-y-1.5">
              <span className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider">
                {strings.quickChipsHeading}
              </span>
              <div className="flex flex-wrap gap-1.5">
                {[
                  strings.chip1,
                  strings.chip2,
                  strings.chip3,
                  strings.chip4,
                  strings.chip5,
                ].map((chip, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleAddChip(chip)}
                    className="text-xs px-2.5 py-1 rounded-md bg-stone-50 hover:bg-stone-100 text-stone-700 border border-stone-200 transition-colors"
                  >
                    + {chip}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Footer controls */}
        <div className="pt-4 border-t border-stone-200 flex items-center justify-between">
          {currentStep > 1 ? (
            <button
              type="button"
              onClick={() => setCurrentStep((prev) => prev - 1)}
              className="px-4 py-2 rounded-lg border border-stone-300 text-stone-700 hover:bg-stone-50 font-medium text-xs flex items-center gap-1.5 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>{strings.wizardPrev}</span>
            </button>
          ) : (
            <div />
          )}

          {currentStep < totalSteps ? (
            <button
              type="button"
              disabled={!canProceed()}
              onClick={() => setCurrentStep((prev) => prev + 1)}
              className={`px-5 py-2.5 rounded-lg font-medium text-xs flex items-center gap-1.5 transition-colors ${
                canProceed()
                  ? 'bg-emerald-700 hover:bg-emerald-800 text-white'
                  : 'bg-stone-200 text-stone-400 cursor-not-allowed'
              }`}
            >
              <span>{strings.wizardNext}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              type="button"
              disabled={isLoading}
              onClick={onSubmit}
              className="px-6 py-2.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-medium text-xs flex items-center gap-2 transition-colors disabled:opacity-60"
            >
              {isLoading ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>{strings.wizardAnalyzing}</span>
                </>
              ) : (
                <span>{strings.wizardSubmit}</span>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
