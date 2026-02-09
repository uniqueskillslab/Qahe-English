// Client-safe utility functions that don't require server-side APIs

export function calculateOverallScore(scores: { 
  fluencyCoherence: number;
  lexicalResource: number;
  grammaticalRange: number;
  pronunciation: number;
}): number {
  const { fluencyCoherence, lexicalResource, grammaticalRange, pronunciation } = scores;
  const average = (fluencyCoherence + lexicalResource + grammaticalRange + pronunciation) / 4;
  return Math.round(average * 2) / 2; // Round to nearest 0.5
}

export function getBandDescriptor(score: number): string {
  if (score >= 9) return 'Expert User';
  if (score >= 8) return 'Very Good User';
  if (score >= 7) return 'Good User';
  if (score >= 6) return 'Competent User';
  if (score >= 5) return 'Modest User';
  if (score >= 4) return 'Limited User';
  if (score >= 3) return 'Extremely Limited User';
  if (score >= 2) return 'Intermittent User';
  if (score >= 1) return 'Non User';
  return 'Did not attempt test';
}