/**
 * Calculates the company age based on founding date (August 22, 1998)
 * Returns the number of complete years since founding
 * 
 * Logic: If today's date has passed August 22nd of current year,
 * return current year - 1998. If not yet reached August 22nd,
 * return current year - 1998 - 1.
 */
export function getCompanyAge(): number {
  const foundingDate = new Date(1998, 7, 22); // August 22, 1998 (month is 0-indexed)
  const today = new Date();
  
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth();
  const currentDay = today.getDate();
  
  // Check if today has passed August 22nd of current year
  if (currentMonth > 7 || (currentMonth === 7 && currentDay >= 22)) {
    return currentYear - 1998;
  } else {
    return currentYear - 1998 - 1;
  }
}

/**
 * Returns company age as a formatted string (e.g., "28+ years")
 */
export function getCompanyAgeString(): string {
  return `${getCompanyAge()}+ years`;
}
