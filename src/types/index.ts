export type Language = 'en' | 'hi';

export interface CropOption {
  id: string;
  nameEn: string;
  nameHi: string;
  icon: string;
  commonAMRThreats: string;
}

export interface SymptomOption {
  id: string;
  nameEn: string;
  nameHi: string;
  descriptionEn: string;
  descriptionHi: string;
  icon: string;
  isAMRIndicator?: boolean;
}

export interface SprayHistory {
  antibioticsOrFungicidesUsed: string[];
  sprayFrequency: string;
  prophylacticSpraying: boolean;
  dosageTrend: string;
  diminishingEfficacyNoticed: boolean;
  neighbouringFieldsAffected: boolean;
}

export interface EnvironmentalData {
  irrigationType: string;
  recentWeather: string;
  soilPractice: string;
}

export interface AssessmentForm {
  crop: string;
  cropVarietyOrStage: string;
  symptoms: string[];
  sprayHistory: SprayHistory;
  environmental: EnvironmentalData;
  farmerNotesAndQueries: string;
}

export interface SuspectedPathogen {
  scientificName: string;
  commonName: string;
  resistanceMechanism: string;
}

export interface TreatmentStep {
  title: string;
  action: string;
  isCritical: boolean;
}

export interface PreventiveProtocol {
  title: string;
  action: string;
  category: 'Soil' | 'Biological' | 'Cultural' | 'Chemical Rotation';
}

export interface DiagnosisReport {
  likelihoodRating: 'High Risk of AMR' | 'Moderate Risk / Developing Tolerance' | 'Low Risk of AMR (Standard Infection)';
  likelihoodRatingLocalized: string;
  riskScore: number;
  amrExplanation: string;
  suspectedPathogens: SuspectedPathogen[];
  immediateTreatmentSteps: TreatmentStep[];
  preventiveAndIPMProtocols: PreventiveProtocol[];
  answersToFarmerQueries: string;
  warningSigns: string[];
  audioSummary: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  timestamp: string;
}
