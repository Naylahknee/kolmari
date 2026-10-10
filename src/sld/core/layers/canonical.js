// @ts-check

/**
 * Canonical SLD operational preservation ontology.
 *
 * Technical checks such as architecture, dependencies, data, interface, and
 * intent are rule families. They must map into these seven layers; they must
 * never replace the Seven Layer Dip model.
 */
export const SLD_LAYER_IDS = Object.freeze([
  'identity',
  'design',
  'behavior',
  'system',
  'logic',
  'content',
  'execution',
])

/** @param {string} layer */
export function isCanonicalLayer(layer) {
  return SLD_LAYER_IDS.includes(layer)
}
