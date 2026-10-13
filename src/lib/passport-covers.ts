/** Cover imagery only. Entry rules and passport nationality stay in passport-index. */
export type PassportCoverAsset = {
  code: string
  country: string
  region: string
  src: string
  sourceUrl: string
  author: string
  license: string
  licenseUrl: string
  changes: string
  sourceChecked: string
}

const commons = 'https://commons.wikimedia.org/wiki/File:'
const cc0 = 'https://creativecommons.org/publicdomain/zero/1.0/'
const ccby = 'https://creativecommons.org/licenses/by-sa/4.0/'

export const PASSPORT_COVERS: Record<string, PassportCoverAsset> = Object.fromEntries([
  { code: 'US', country: 'United States', region: 'Americas', file: 'Passport_US.jpg', author: 'United States Department of State', license: 'Public domain', licenseUrl: commons + 'Passport_US.jpg', changes: 'Resized and converted to WebP.' },
  { code: 'CA', country: 'Canada', region: 'Americas', file: 'Canadian_Passports_-_Old_and_New.jpg', author: 'Jusfiq', license: 'CC BY-SA 4.0', licenseUrl: ccby, changes: 'Cropped to the newer cover on the right, resized and converted to WebP. Derivative remains CC BY-SA 4.0.' },
  { code: 'PT', country: 'Portugal', region: 'Europe', file: 'Portuguese_Passport_Cover.jpg', author: 'Arenawise', license: 'CC BY-SA 4.0', licenseUrl: ccby, changes: 'Resized and converted to WebP. Derivative remains CC BY-SA 4.0.' },
  { code: 'MX', country: 'Mexico', region: 'Americas', file: 'Portada_pasaporte_mexicano.jpg', author: 'Diegoromch', license: 'CC0 1.0', licenseUrl: cc0, changes: 'Resized and converted to WebP.' },
  { code: 'ES', country: 'Spain', region: 'Europe', file: 'Four_Different_Passports.jpg', author: 'Horizon206', license: 'CC0 1.0', licenseUrl: cc0, changes: 'Cropped to the Spanish passport on the left, resized and converted to WebP.' },
  { code: 'GH', country: 'Ghana', region: 'Africa', file: 'Ghana_Biometric_Passport.jpg', author: 'Government of Ghana / Ghana Immigration Service', license: 'Public domain', licenseUrl: commons + 'Ghana_Biometric_Passport.jpg', changes: 'Resized and converted to WebP.' },
  { code: 'FR', country: 'France', region: 'Europe', file: 'French_Passport_Image.png', author: 'Nikimura', license: 'CC BY-SA 4.0', licenseUrl: ccby, changes: 'Resized and converted to WebP. Derivative remains CC BY-SA 4.0.' },
  { code: 'BR', country: 'Brazil', region: 'Americas', file: 'Passport_of_Brazil_(2019).png', author: 'República Federativa do Brasil', license: 'Public domain (Commons designation)', licenseUrl: commons + 'Passport_of_Brazil_(2019).png', changes: 'Captured the rendered Commons thumbnail, cropped the surrounding browser canvas and converted to WebP.' },
].map(({ file, ...asset }) => [asset.code, {
  ...asset, src: `/images/passports/${asset.code.toLowerCase()}.webp`,
  sourceUrl: commons + file, sourceChecked: '2026-10-13',
}]))

export const POPULAR_PASSPORT_CODES = ['US', 'CA', 'PT', 'MX', 'ES', 'GH', 'FR', 'BR']

export function passportCodeForCountry(country: string): string {
  return Object.values(PASSPORT_COVERS).find((asset) => asset.country === country)?.code ?? ''
}
