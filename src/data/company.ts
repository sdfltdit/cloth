// Company founding date — August 22, 1998
export const FOUNDING_DATE = new Date('1998-08-22');
export const FOUNDING_YEAR = 1998;

/**
 * Calculate years since founding (current year - 1998).
 * Auto-updates every year.
 */
export function getYearsExperience(): number {
  const now = new Date();
  const currentYear = now.getFullYear();
  
  // Check if anniversary has passed this year
  const anniversaryThisYear = new Date(
    currentYear, 7, 22 // August is month 7 (0-indexed)
  );
  
  if (now >= anniversaryThisYear) {
    return currentYear - FOUNDING_YEAR;
  } else {
    return currentYear - FOUNDING_YEAR - 1;
  }
}

/**
 * Return years experience with "+" suffix.
 * Example: "27+" or "28+"
 */
export function getYearsExperiencePlus(): string {
  return `${getYearsExperience()}+`;
}

/**
 * Return years experience as full phrase.
 * Example: "27 years" or "28 years"
 */
export function getYearsExperiencePhrase(): string {
  return `${getYearsExperience()} years`;
}

/**
 * Return years experience as phrase with "+".
 * Example: "27+ years"
 */
export function getYearsExperiencePlusPhrase(): string {
  return `${getYearsExperience()}+ years`;
}
