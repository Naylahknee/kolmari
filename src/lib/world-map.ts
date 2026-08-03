export type WorldCoordinate = {
  lat: number
  lng: number
}

/** Equirectangular projection matching the 1000 × 520 illustrated world board. */
export function projectWorldCoordinate(coordinate: WorldCoordinate): { x: number; y: number } {
  return {
    x: ((coordinate.lng + 180) / 360) * 1000,
    y: ((90 - Math.max(-90, Math.min(90, coordinate.lat))) / 180) * 520,
  }
}
