export type City = { slug: string; name: string; lat: number; lon: number };

export const cities: City[] = [
  { slug: 'stockholm', name: 'Stockholm', lat: 59.3293, lon: 18.0686 },
  { slug: 'goteborg', name: 'Göteborg', lat: 57.7089, lon: 11.9746 },
  { slug: 'malmo', name: 'Malmö', lat: 55.605, lon: 13.0038 },
  { slug: 'uppsala', name: 'Uppsala', lat: 59.8586, lon: 17.6389 },
  { slug: 'linkoping', name: 'Linköping', lat: 58.4108, lon: 15.6214 },
  { slug: 'orebro', name: 'Örebro', lat: 59.2753, lon: 15.2134 },
  { slug: 'vasteras', name: 'Västerås', lat: 59.6099, lon: 16.5448 },
  { slug: 'jonkoping', name: 'Jönköping', lat: 57.7826, lon: 14.1618 },
  { slug: 'karlstad', name: 'Karlstad', lat: 59.4022, lon: 13.5115 },
  { slug: 'gavle', name: 'Gävle', lat: 60.6749, lon: 17.1413 },
  { slug: 'visby', name: 'Visby', lat: 57.6348, lon: 18.2948 },
  { slug: 'sundsvall', name: 'Sundsvall', lat: 62.3908, lon: 17.3069 },
  { slug: 'ostersund', name: 'Östersund', lat: 63.1792, lon: 14.6357 },
  { slug: 'umea', name: 'Umeå', lat: 63.8258, lon: 20.263 },
  { slug: 'lulea', name: 'Luleå', lat: 65.5848, lon: 22.1547 },
  { slug: 'kiruna', name: 'Kiruna', lat: 67.8558, lon: 20.2253 },
];

export const cityBySlug = (slug: string | undefined): City =>
  cities.find((city) => city.slug === slug) ?? cities[0];
