import React, { useState } from 'react';
import { X, Droplets, Leaf, BookOpen, ArrowRight } from 'lucide-react';
import { Language } from '../types';
import { t } from '../data/translations';

interface EducationModalProps {
  currentLang: Language;
  isOpen: boolean;
  onClose: () => void;
  onStartDiagnose: () => void;
}

export const EducationModal: React.FC<EducationModalProps> = ({
  currentLang,
  isOpen,
  onClose,
  onStartDiagnose,
}) => {
  const strings = t[currentLang];
  const [activeTab, setActiveTab] = useState<'ooze' | 'biocontrol' | 'science'>('ooze');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs animate-fade-in">
      <div className="relative w-full max-w-2xl bg-white rounded-xl shadow-xl border border-stone-200 overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-stone-900 text-stone-100 flex items-center justify-between border-b border-stone-800">
          <div>
            <h3 className="text-base font-bold tracking-tight">
              {strings.guideModalTitle}
            </h3>
            <p className="text-xs text-stone-400">
              {currentLang === 'hi'
                ? 'खेत में रोग पहचान एवं प्रतिरोध प्रबंधन'
                : 'Field diagnostics and resistance management manual'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-md hover:bg-stone-800 flex items-center justify-center text-stone-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Minimal Navigation Tabs */}
        <div className="flex border-b border-stone-200 bg-stone-50 px-4 pt-1.5 gap-1 overflow-x-auto">
          {[
            { id: 'ooze', label: strings.guideTab1, icon: Droplets },
            { id: 'biocontrol', label: strings.guideTab2, icon: Leaf },
            { id: 'science', label: strings.guideTab3, icon: BookOpen },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3 py-2 text-xs font-medium flex items-center gap-1.5 border-b-2 transition-colors whitespace-nowrap ${
                activeTab === tab.id
                  ? 'border-emerald-700 text-emerald-900 bg-white rounded-t-md font-semibold'
                  : 'border-transparent text-stone-500 hover:text-stone-800'
              }`}
            >
              <tab.icon className="w-3.5 h-3.5 text-stone-500" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1 text-stone-800 text-xs sm:text-sm leading-relaxed">
          {/* TAB 1: Water Glass Ooze Test */}
          {activeTab === 'ooze' && (
            <div className="space-y-4">
              <p className="text-stone-600 font-normal">
                {currentLang === 'hi'
                  ? 'पारदर्शी कांच के पानी का टेस्ट 2 मिनट के भीतर पुष्टि करता है कि मुरझाना फंगल वास्कुलर रुकावट से है या बैक्टीरियल विल्ट से।'
                  : 'The water-glass ooze test allows immediate field differentiation between fungal vascular browning and active bacterial vascular streaming.'}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3.5 rounded-lg border border-stone-200 bg-stone-50 space-y-1.5">
                  <span className="font-mono text-xs font-bold text-stone-500">01</span>
                  <h4 className="font-semibold text-stone-900 text-xs">
                    {currentLang === 'hi' ? 'तने का निचला हिस्सा' : 'Sample Cut'}
                  </h4>
                  <p className="text-stone-600 text-xs leading-normal">
                    {currentLang === 'hi'
                      ? 'मुरझाए पौधे के निचले तने से 3-4 सेमी का साफ टुकड़ा काटें।'
                      : 'Cut a 3–4 cm segment from the base of a freshly wilted stem.'}
                  </p>
                </div>

                <div className="p-3.5 rounded-lg border border-stone-200 bg-stone-50 space-y-1.5">
                  <span className="font-mono text-xs font-bold text-stone-500">02</span>
                  <h4 className="font-semibold text-stone-900 text-xs">
                    {currentLang === 'hi' ? 'साफ पानी में रखें' : 'Suspend in Water'}
                  </h4>
                  <p className="text-stone-600 text-xs leading-normal">
                    {currentLang === 'hi'
                      ? 'साफ कांच के गिलास में पानी भरकर तने के सिरे को सतह पर डुबोएं।'
                      : 'Place cut end just beneath surface of clean transparent water.'}
                  </p>
                </div>

                <div className="p-3.5 rounded-lg border border-stone-200 bg-stone-50 space-y-1.5">
                  <span className="font-mono text-xs font-bold text-stone-500">03</span>
                  <h4 className="font-semibold text-stone-900 text-xs">
                    {currentLang === 'hi' ? 'दूधिया धागे' : 'Observe Streaming'}
                  </h4>
                  <p className="text-stone-600 text-xs leading-normal">
                    {currentLang === 'hi'
                      ? '1-2 मिनट में नीचे उतरते दूधिया धागे बैक्टीरियल संक्रमण की पुष्टि करते हैं।'
                      : 'Milky ribbons discharging downward confirm bacterial infection.'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Biocontrol Alternatives */}
          {activeTab === 'biocontrol' && (
            <div className="space-y-3">
              {[
                {
                  name: 'Bacillus subtilis (strain QST 713)',
                  dose: '3–4 g/L (50g per 15L knapsack)',
                  benefit:
                    currentLang === 'hi'
                      ? 'पत्तियों पर जैविक सुरक्षा परत बनाता है और लिपोटेप्टाइड से रोगजनक बैक्टीरिया की कोशिका भित्ति को नष्ट करता है।'
                      : 'Produces lipopeptide antibiotics that disrupt bacterial cell membranes without generating resistance.',
                },
                {
                  name: 'Pseudomonas fluorescens',
                  dose: '10 ml/L or 1L/acre through drip',
                  benefit:
                    currentLang === 'hi'
                      ? 'जड़ों में सिस्टेमिक प्रतिरोध सक्रिय करता है और लोहे के तत्वों को बांधकर रोगाणुओं को भूखा मारता है।'
                      : 'Colonizes root surfaces, produces siderophores to starve pathogens, and triggers plant defense pathways.',
                },
                {
                  name: 'Trichoderma viride',
                  dose: '2 kg per acre with organic compost',
                  benefit:
                    currentLang === 'hi'
                      ? 'मिट्टी में मौजूद उकठा रोग पैदा करने वाले फफूंद को परजीवी की तरह नष्ट करता है।'
                      : 'Mycoparasitic biocontrol suppressing soil-borne fungal pathogens in the rhizosphere.',
                },
              ].map((bio, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-lg border border-stone-200 bg-stone-50 space-y-1"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <h4 className="font-semibold text-stone-900 text-xs">
                      {bio.name}
                    </h4>
                    <span className="text-[11px] text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-medium">
                      {bio.dose}
                    </span>
                  </div>
                  <p className="text-stone-600 text-xs leading-relaxed">
                    {bio.benefit}
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* TAB 3: Science of AMR */}
          {activeTab === 'science' && (
            <div className="space-y-3">
              <div className="p-3.5 rounded-lg border border-stone-200 bg-stone-50 space-y-1">
                <h4 className="font-semibold text-stone-900 text-xs">
                  {currentLang === 'hi' ? 'खुराक बढ़ाने का जोखिम' : 'The Hazard of Dosage Escalation'}
                </h4>
                <p className="text-stone-600 text-xs leading-relaxed">
                  {currentLang === 'hi'
                    ? 'असर कम होने पर रासायनिक खुराक दोगुनी करने से फसल झुलस जाती है, मिट्टी के मित्र सूक्ष्मजीव नष्ट होते हैं और प्रतिरोधी रोगाणुओं को अधिक बढ़ावा मिलता है।'
                    : 'Doubling antibiotic rates increases leaf phytotoxicity, eliminates beneficial epiphytic microflora, and exerts higher selective pressure for mutant strains.'}
                </p>
              </div>

              <div className="p-3.5 rounded-lg border border-stone-200 bg-stone-50 space-y-1">
                <h4 className="font-semibold text-stone-900 text-xs">
                  {currentLang === 'hi' ? 'FRAC वर्ग चक्रीकरण' : 'FRAC Mode-of-Action Rotation'}
                </h4>
                <p className="text-stone-600 text-xs leading-relaxed">
                  {currentLang === 'hi'
                    ? 'एक ही रासायनिक समूह का लगातार छिड़काव न करें। एकल-लक्ष्य रसायनों के बाद बहु-लक्ष्य तांबा या जैविक उत्पाद का प्रयोग करें।'
                    : 'Avoid consecutive applications of the same FRAC group. Alternate single-site compounds with multi-site contact protectants and biological agents.'}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-stone-50 border-t border-stone-200 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-md border border-stone-300 text-stone-700 text-xs font-medium hover:bg-stone-100 transition-colors"
          >
            {currentLang === 'hi' ? 'बंद करें' : 'Close'}
          </button>
          <button
            onClick={() => {
              onClose();
              onStartDiagnose();
            }}
            className="px-4 py-2 rounded-md bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-medium flex items-center gap-1.5 transition-colors"
          >
            <span>{strings.heroStartBtn}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
