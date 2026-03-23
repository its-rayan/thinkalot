export function fetchFlagImage(countryCode: string): string {
  return `https://flagcdn.com/${countryCode.toLowerCase()}.svg`;
}
