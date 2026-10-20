// Link Google Maps otomatis (kolom googleMapsUrl di DB tetap ada, tapi tidak lagi diisi manual).
export const mapsUrlFor = (name: string, address: string) =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${name} ${address}`.trim())}`;
