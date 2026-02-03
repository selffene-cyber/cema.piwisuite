
import { SpliceType, Abrasiveness, Moisture, AnchoUnidad, VelocidadUnidad } from '../types';

// Conversion functions for belt width and speed

/**
 * Converts belt width to inches
 * @param value - The width value
 * @param unit - The unit of the value ('in' or 'mm')
 * @returns The value in inches
 */
export const convertBeltWidthToInches = (value: number, unit: AnchoUnidad): number => {
  if (unit === 'in') return value;
  if (unit === 'mm') return value / 25.4;
  return value;
};

/**
 * Converts belt speed to FPM (feet per minute)
 * @param value - The speed value
 * @param unit - The unit of the value ('fpm' or 'm/s')
 * @returns The value in FPM
 */
export const convertBeltSpeedToFPM = (value: number, unit: VelocidadUnidad): number => {
  if (unit === 'fpm') return value;
  if (unit === 'm/s') return value * 196.85;
  return value;
};

// CEMA 576 Score Functions

/**
 * Calculates belt width score based on CEMA 576 scale
 * @param widthInches - Belt width in inches
 * @returns Score from 0, 1, 2, 4, or 8
 * 
 * CEMA 576 Belt Width Scale:
 * 0: <24 in (<610 mm)
 * 1: 24 in – 42 in (610 mm – 1067 mm)
 * 2: >42 in – 60 in (1067 mm – 1524 mm)
 * 4: >60 in – 96 in (1524 mm – 2438 mm)
 * 8: >96 in (>2438 mm)
 */
export const getBeltWidthScore = (widthInches: number): number => {
  if (widthInches < 24) return 0;
  else if (widthInches <= 42) return 1;
  else if (widthInches <= 60) return 2;
  else if (widthInches <= 96) return 4;
  else return 8;
};

/**
 * Calculates belt speed score based on CEMA 576 scale
 * @param speedFPM - Belt speed in FPM
 * @returns Score from 1, 2, 4, or 8
 * 
 * CEMA 576 Belt Speed Scale:
 * 1: <300 fpm (<1.5 m/s)
 * 2: 300 – 600 fpm (1.5 – 3 m/s)
 * 4: 601 – 1000 fpm (3.1 – 5 m/s)
 * 8: >1000 fpm (>5 m/s)
 */
export const getBeltSpeedScore = (speedFPM: number): number => {
  if (speedFPM < 300) return 1;
  else if (speedFPM <= 600) return 2;
  else if (speedFPM <= 1000) return 4;
  else return 8;
};

/**
 * Calculates splice type score based on CEMA 576 scale
 * @param splice - The splice type (user's selection is used directly)
 * @returns Score from 0, 2, or 4
 * 
 * CEMA 576 Splice Type Scale:
 * 0: Vulcanized
 * 2: Mechanical splices with belt speed below 500 fpm (2.5 m/s)
 * 4: Mechanical splices with belt speed 500 fpm (2.5 m/s) or greater
 */
export const getSpliceTypeScore = (splice: SpliceType, _speedFPM?: number): number => {
  if (splice === SpliceType.VULCANIZED) return 0;
  if (splice === SpliceType.MECHANICAL_LOW_SPEED) return 2;
  if (splice === SpliceType.MECHANICAL_HIGH_SPEED) return 4;
  return 0;
};

/**
 * Calculates abrasiveness score based on CEMA 576 scale
 * @param abrasiveness - The abrasiveness category
 * @returns Score from 1, 2, or 3
 * 
 * CEMA 576 Abrasiveness Scale:
 * 1: Mildly Abrasive (ANSI/CEMA 550 code 5, index 1-17)
 * 2: Moderately Abrasive (ANSI/CEMA 550 code 6, index 18-67)
 * 3: Extremely Abrasive (ANSI/CEMA 550 code 7, index 68-416)
 */
export const getAbrasivenessScore = (abrasiveness: Abrasiveness): number => {
  if (abrasiveness === Abrasiveness.MILD) return 1;
  else if (abrasiveness === Abrasiveness.MODERATE) return 2;
  else return 3; // EXTREME
};

/**
 * Calculates moisture score based on CEMA 576 scale
 * @param moisture - The moisture category
 * @returns Score from 1, 2, 4, or 8
 * 
 * CEMA 576 Moisture Scale:
 * 1: Mild/Dry (<2% moisture by weight)
 * 2: Medium/Moist (2-8% moisture by weight)
 * 4: Heavy/Wet (>8% moisture by weight)
 * 8: Severe/Wet/Sticky slurry with fines
 */
export const getMoistureScore = (moisture: Moisture): number => {
  if (moisture === Moisture.DRY) return 1;
  else if (moisture === Moisture.MOIST) return 2;
  else if (moisture === Moisture.WET) return 4;
  else return 8; // SLURRY
};

/**
 * Calculates all CEMA 576 scores
 * @param widthInches - Belt width in inches
 * @param speedFPM - Belt speed in FPM
 * @param splice - Splice type
 * @param abrasiveness - Abrasiveness category
 * @param moisture - Moisture category
 * @returns Object with total score, severity class, and individual scores
 */
export const calculateScores = (
  widthInches: number,
  speedFPM: number,
  splice: SpliceType,
  abrasiveness: Abrasiveness,
  moisture: Moisture
) => {
  const widthScore = getBeltWidthScore(widthInches);
  const speedScore = getBeltSpeedScore(speedFPM);
  const spliceScore = getSpliceTypeScore(splice, speedFPM);
  const abrasiveScore = getAbrasivenessScore(abrasiveness);
  const moistureScore = getMoistureScore(moisture);

  const total = widthScore + speedScore + spliceScore + abrasiveScore + moistureScore;

  /**
   * CEMA 576 Application Severity Ranking (Class calculation):
   * ≤ 6: Class 1
   * 7-10: Class 2
   * 11-15: Class 3
   * 16-23: Class 4
   * ≥24: Class 5
   */
  let severityClass = 1;
  if (total <= 6) severityClass = 1;
  else if (total <= 10) severityClass = 2;
  else if (total <= 15) severityClass = 3;
  else if (total <= 23) severityClass = 4;
  else severityClass = 5;

  return { 
    total, 
    severityClass, 
    breakdown: { 
      beltWidth: widthScore, 
      beltSpeed: speedScore, 
      spliceType: spliceScore, 
      abrasiveness: abrasiveScore, 
      moisture: moistureScore 
    } 
  };
};

// Legacy scoring functions (kept for backward compatibility)

export const calculateBeltWidthScore = (widthInches: number): number => {
  if (widthInches < 24) return 0;
  else if (widthInches <= 42) return 1;
  else if (widthInches <= 60) return 2;
  else if (widthInches <= 96) return 4;
  else return 8;
};

export const calculateBeltSpeedScore = (speedFpm: number): number => {
  if (speedFpm < 300) return 1;
  else if (speedFpm <= 600) return 2;
  else if (speedFpm <= 1000) return 4;
  else return 8;
};

export const calculateSpliceTypeScore = (splice: SpliceType): number => {
  if (splice === SpliceType.VULCANIZED) return 0;
  if (splice === SpliceType.MECHANICAL_LOW_SPEED) return 2;
  if (splice === SpliceType.MECHANICAL_HIGH_SPEED) return 4;
  return 0;
};

export const calculateAbrasivenessScore = (abrasiveness: Abrasiveness): number => {
  if (abrasiveness === Abrasiveness.MILD) return 1;
  else if (abrasiveness === Abrasiveness.MODERATE) return 2;
  else return 3;
};

export const calculateMoistureScore = (moisture: Moisture): number => {
  if (moisture === Moisture.DRY) return 1;
  else if (moisture === Moisture.MOIST) return 2;
  else if (moisture === Moisture.WET) return 4;
  else return 8;
};
