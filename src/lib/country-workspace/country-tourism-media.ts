export type CountryTourismMedia = {
  countrySlug: string
  countryName: string
  countryCode: string
  flagSrc: string
  flagAlt: string
  imageSrc: string
  imageAlt: string
  tourismUrl: string
  tourismLabel: string
  attribution: string
}

export const COUNTRY_TOURISM_MEDIA: Record<string, CountryTourismMedia> = {
  portugal: {
    countrySlug: 'portugal',
    countryName: 'Portugal',
    countryCode: 'PT',
    flagSrc: 'https://flagcdn.com/w160/pt.png',
    flagAlt: 'Flag of Portugal',
    imageSrc: 'https://cdn.visitportugal.com/sites/default/files/styles/experiencias_detalhe/public/mediateca/N1003d.jpg?itok=272VbtwJ',
    imageAlt: 'Ponte 25 de Abril over the Tagus River in Lisbon, Portugal',
    tourismUrl: 'https://www.visitportugal.com/en/destinos/lisboa-regiao',
    tourismLabel: 'Visit Portugal',
    attribution: 'Photo supplied by Turismo de Portugal through Visit Portugal.',
  },
  spain: {
    countrySlug: 'spain',
    countryName: 'Spain',
    countryCode: 'ES',
    flagSrc: 'https://flagcdn.com/w160/es.png',
    flagAlt: 'Flag of Spain',
    imageSrc: 'https://www.spain.info/export/sites/segtur/.content/imagenes/cabeceras-grandes/cataluna/park-guell-barcelona-s-305364611.jpg_604889389.jpg',
    imageAlt: 'View from Park Güell in Barcelona, Spain',
    tourismUrl: 'https://www.spain.info/en/destination/barcelona/',
    tourismLabel: 'Spain.info',
    attribution: 'Destination image supplied by Spain’s official tourism website, Spain.info.',
  },
  greece: {
    countrySlug: 'greece',
    countryName: 'Greece',
    countryCode: 'GR',
    flagSrc: 'https://flagcdn.com/w160/gr.png',
    flagAlt: 'Flag of Greece',
    imageSrc: 'https://cdn.visitgreece.tech/wp-uploads/attica-18.jpg',
    imageAlt: 'Attica landscape featured by the Greek National Tourism Organisation',
    tourismUrl: 'https://www.visitgreece.gr/en/mainland/attica',
    tourismLabel: 'Visit Greece',
    attribution: 'Photo supplied by the Greek National Tourism Organisation through Visit Greece.',
  },
  estonia: {
    countrySlug: 'estonia',
    countryName: 'Estonia',
    countryCode: 'EE',
    flagSrc: 'https://flagcdn.com/w160/ee.png',
    flagAlt: 'Flag of Estonia',
    imageSrc: 'https://visitestonia.com/content-images/501658/estonia-photo-gallery-en-001-visit-estonia.jpg',
    imageAlt: 'Orjaku harbour in Estonia',
    tourismUrl: 'https://visitestonia.com/en/traveltrade/estonia-photo-gallery',
    tourismLabel: 'Visit Estonia',
    attribution: 'Photo author: Visit Estonia. Source: Visit Estonia photo gallery.',
  },
  mexico: {
    countrySlug: 'mexico',
    countryName: 'Mexico',
    countryCode: 'MX',
    flagSrc: 'https://flagcdn.com/w160/mx.png',
    flagAlt: 'Flag of Mexico',
    imageSrc: 'https://visitmexico.com/media/usercontent/67fd7216e52bd-sectur_zocalo-8232-%281%29_gmxdot_jpg',
    imageAlt: 'Palacio de Bellas Artes in Mexico City, Mexico',
    tourismUrl: 'https://visitmexico.com/en/estado/9/ciudad-de-mexico',
    tourismLabel: 'Visit Mexico',
    attribution: 'Destination image supplied by Visit Mexico, Mexico’s official tourism portal.',
  },
}

export function getCountryTourismMedia(countrySlug: string) {
  return COUNTRY_TOURISM_MEDIA[countrySlug] ?? null
}
