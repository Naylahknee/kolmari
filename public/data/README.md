# Nexitnation geographic data

`continents.geojson` groups Natural Earth 1:110m Admin 0 country boundaries into
the six Nexitnation regions. Natural Earth data is public domain. The feature
properties (`slug`, `label`, `countryCount`, and `matchLabel`) are Nexit-owned
presentation metadata.

Source: https://www.naturalearthdata.com/downloads/110m-cultural-vectors/110m-admin-0-countries/

`countries-110m.geojson` is the corresponding ungrouped Natural Earth
admin-0 dataset. The build-time generator in
`scripts/generate-country-shapes.mjs` converts selected country geometries
into compact SVG paths for continent-page country cards.
