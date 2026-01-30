
import { SpliceType, Abrasiveness, Moisture } from '../types';

export const calculateScores = (
  width: number,
  speed: number,
  splice: SpliceType,
  abrasiveness: Abrasiveness,
  moisture: Moisture
) => {
  let widthScore = 0;
  if (width < 24) widthScore = 0;
  else if (width <= 42) widthScore = 1;
  else if (width <= 60) widthScore = 2;
  else if (width <= 96) widthScore = 4;
  else widthScore = 8;

  let speedScore = 0;
  if (speed < 300) speedScore = 1;
  else if (speed <= 600) speedScore = 2;
  else if (speed <= 1000) speedScore = 4;
  else speedScore = 8;

  let spliceScore = 0;
  if (splice === SpliceType.VULCANIZED) spliceScore = 0;
  else if (splice === SpliceType.MECHANICAL_LOW_SPEED) spliceScore = 2;
  else spliceScore = 4;

  let abrasiveScore = 0;
  if (abrasiveness === Abrasiveness.MILD) abrasiveScore = 1;
  else if (abrasiveness === Abrasiveness.MODERATE) abrasiveScore = 2;
  else abrasiveScore = 3;

  let moistureScore = 0;
  if (moisture === Moisture.DRY) moistureScore = 1;
  else if (moisture === Moisture.MOIST) moistureScore = 2;
  else if (moisture === Moisture.WET) moistureScore = 4;
  else moistureScore = 8;

  const total = widthScore + speedScore + spliceScore + abrasiveScore + moistureScore;

  let severityClass = 1;
  if (total <= 6) severityClass = 1;
  else if (total <= 10) severityClass = 2;
  else if (total <= 15) severityClass = 3;
  else if (total <= 23) severityClass = 4;
  else severityClass = 5;

  return { total, severityClass, breakdown: { beltWidth: widthScore, beltSpeed: speedScore, spliceType: spliceScore, abrasiveness: abrasiveScore, moisture: moistureScore } };
};
