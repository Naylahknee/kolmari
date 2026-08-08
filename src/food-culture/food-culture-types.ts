// src/lib/food-culture/types.ts
//
// Food Culture taxonomy for Kolmari.
// This is a FILTER layer, not a ranking layer — countries carry multiple
// tags, and the user selects the combination that matters to them.
// Distinct from the general `health` composite score (WHO/OECD-sourced);
// this module is Kolmari's own editorial categorization and is labeled
// as such wherever it's displayed.

export const FOOD_CULTURE_ARCHETYPES = [
  "mediterranean",
  "farm-to-table",
  "seafood-forward",
  "plant-forward",
  "strict-allergen-labeling",
  "low-processed-food",
  "dairy-heavy",
  "nut-heavy",
  "high-processed-food",
] as const;

export type FoodCultureArchetype = typeof FOOD_CULTURE_ARCHETYPES[number];

export const ARCHETYPE_LABELS: Record<FoodCultureArchetype, string> = {
  "mediterranean": "Mediterranean",
  "farm-to-table": "Farm-to-Table",
  "seafood-forward": "Seafood-Forward",
  "plant-forward": "Plant-Forward",
  "strict-allergen-labeling": "Strict Allergen Labeling",
  "low-processed-food": "Low Processed-Food Presence",
  "dairy-heavy": "Dairy-Heavy",
  "nut-heavy": "Nut-Heavy Cuisine",
  "high-processed-food": "High Processed-Food Culture",
};

export const ARCHETYPE_DESCRIPTIONS: Record<FoodCultureArchetype, string> = {
  "mediterranean": "Olive oil, fish, and produce-forward staples with minimal processed food in the everyday diet.",
  "farm-to-table": "Short supply chains and a strong local or organic agriculture culture.",
  "seafood-forward": "Fish and shellfish are dietary staples — a heart-healthy signal, but a caution flag for shellfish allergies.",
  "plant-forward": "Strong vegetarian and vegan infrastructure with produce-heavy staples.",
  "strict-allergen-labeling": "Legally mandated allergen disclosure on packaged food and, often, restaurant menus.",
  "low-processed-food": "Everyday diet leans toward whole foods over packaged or convenience food.",
  "dairy-heavy": "Cream, cheese, and butter are dietary staples — a caution flag for dairy allergy or intolerance.",
  "nut-heavy": "Tree nuts or peanuts appear commonly in everyday cooking — a caution flag for nut allergies.",
  "high-processed-food": "Convenience and packaged food dominate the everyday diet.",
};

// Allergens tracked for personal filtering. Extend as needed.
export const TRACKED_ALLERGENS = [
  "shellfish",
  "treeNuts",
  "peanuts",
  "dairy",
  "gluten",
  "eggs",
] as const;

export type Allergen = typeof TRACKED_ALLERGENS[number];

export type AllergenPrevalence = "common" | "occasional" | "rare";

export interface CountryFoodCulture {
  countrySlug: string;
  archetypes: FoodCultureArchetype[];
  allergenPrevalence: Record<Allergen, AllergenPrevalence>;
  labelingLaw: string;          // plain-language description of the legal labeling regime
  cardioNote: string;           // short note on heart-health relevance of the everyday diet
  assessmentType: "kolmari-editorial"; // always disclosed, not presented as official stat
  sourceUrl?: string;           // official source backing labelingLaw, if available
  lastReviewed: string;         // ISO date
}
