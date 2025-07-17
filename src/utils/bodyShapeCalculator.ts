interface MeasurementData {
  bust: string;
  waist: string;
  hips: string;
  shoulders: string;
  torsoLength: string;
  legLength: string;
}

export interface BodyShapeResult {
  bodyShape: string;
  proportionType: string;
}

export const calculateBodyShape = (measurements: MeasurementData): BodyShapeResult => {
  const bust = parseFloat(measurements.bust);
  const waist = parseFloat(measurements.waist);
  const hips = parseFloat(measurements.hips);
  const shoulders = parseFloat(measurements.shoulders);
  const torsoLength = parseFloat(measurements.torsoLength);
  const legLength = parseFloat(measurements.legLength);

  // Calculate body shape
  let bodyShape = '';
  
  const bustHipDiff = Math.abs(bust - hips);
  const waistBustDiff = bust - waist;
  const waistHipDiff = hips - waist;
  
  if (bustHipDiff <= 1 && waistBustDiff >= 9 && waistHipDiff >= 10) {
    bodyShape = 'hourglass';
  } else if (waist >= bust && waist >= hips) {
    bodyShape = 'apple';
  } else if (hips > bust && waistHipDiff >= 9) {
    bodyShape = 'pear';
  } else if (bustHipDiff <= 3 && waistBustDiff < 9 && waistHipDiff < 10) {
    bodyShape = 'rectangle';
  } else if (bust > hips) {
    bodyShape = 'inverted triangle';
  } else {
    bodyShape = 'hourglass'; // default
  }

  // Calculate proportion type
  let proportionType = '';
  const totalLength = torsoLength + legLength;
  const torsoRatio = torsoLength / totalLength;
  
  if (torsoRatio < 0.45) {
    proportionType = 'short torso';
  } else if (torsoRatio > 0.55) {
    proportionType = 'long torso';
  } else {
    proportionType = 'balanced';
  }

  return {
    bodyShape,
    proportionType
  };
};