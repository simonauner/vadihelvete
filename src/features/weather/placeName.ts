/**
 * Reverse geocoding through OpenStreetMap's Nominatim. The coordinates are
 * rounded to roughly a kilometre, which is plenty to name a place.
 */
export const placeNameUrl = (lat: number, lon: number) =>
  `https://nominatim.openstreetmap.org/reverse?format=jsonv2&zoom=14&accept-language=sv&lat=${lat.toFixed(2)}&lon=${lon.toFixed(2)}`;

const LOCALITY_KEYS = [
  'village',
  'town',
  'city',
  'municipality',
  'county',
] as const;

/** Picks the most human name ("Solna", not "Skytteholm, Solna kommun"). */
export const parsePlaceName = (json: unknown): string | null => {
  const address = (json as { address?: Record<string, unknown> })?.address;
  if (!address) return null;

  for (const key of LOCALITY_KEYS) {
    const name = address[key];
    if (typeof name === 'string' && name.trim()) return name.trim();
  }

  return null;
};

export const fetchPlaceName = async (
  lat: number,
  lon: number
): Promise<string | null> => {
  try {
    const response = await fetch(placeNameUrl(lat, lon));
    if (!response.ok) return null;

    return parsePlaceName(await response.json());
  } catch {
    return null;
  }
};
