
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  readonly VITE_R2_PUBLIC_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

export enum SpliceType {
  VULCANIZED = 'Vulcanized',
  MECHANICAL_LOW_SPEED = 'Mechanical < 500 fpm (2.5 m/s)',
  MECHANICAL_HIGH_SPEED = 'Mechanical >= 500 fpm (2.5 m/s) or greater '
}

export enum Abrasiveness {
  MILD = 'Mildly Abrasive (Index 1-17)',
  MODERATE = 'Moderately Abrasive (Index 18-67)',
  EXTREME = 'Extremely Abrasive (Index 68-416)'
}

export enum Moisture {
  DRY = 'Mild/Dry (<2%)',
  MOIST = 'Medium/Moist (2-8%)',
  WET = 'Heavy/Wet (>8%)',
  SLURRY = 'Severe/Wet/Sticky Slurry'
}

export interface Evaluation {
  id: string;
  timestamp: string;
  clientName: string;
  tag: string;
  beltWidth: number;
  beltSpeed: number;
  spliceType: SpliceType;
  abrasiveness: Abrasiveness;
  moisture: Moisture;
  totalScore: number;
  severityClass: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
}
