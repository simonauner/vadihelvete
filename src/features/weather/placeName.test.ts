import { describe, expect, it } from 'vitest';
import { parsePlaceName, placeNameUrl } from './placeName';

describe('parsePlaceName', () => {
  it('prefers the town over the suburb and municipality', () => {
    expect(
      parsePlaceName({
        address: {
          suburb: 'Skytteholm',
          town: 'Solna',
          municipality: 'Solna kommun',
          county: 'Stockholms län',
        },
      })
    ).toBe('Solna');
  });

  it('prefers a village over the city it belongs to', () => {
    expect(
      parsePlaceName({ address: { village: 'Abisko', city: 'Kiruna' } })
    ).toBe('Abisko');
  });

  it('falls back to the municipality', () => {
    expect(
      parsePlaceName({ address: { municipality: 'Arjeplogs kommun' } })
    ).toBe('Arjeplogs kommun');
  });

  it('handles garbage', () => {
    expect(parsePlaceName(null)).toBeNull();
    expect(parsePlaceName({ error: 'Unable to geocode' })).toBeNull();
    expect(parsePlaceName({ address: { city: '  ' } })).toBeNull();
  });
});

describe('placeNameUrl', () => {
  it('rounds the position to two decimals', () => {
    expect(placeNameUrl(59.358318, 17.993471)).toContain('lat=59.36&lon=17.99');
  });
});
