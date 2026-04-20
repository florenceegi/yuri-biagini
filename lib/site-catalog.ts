/**
 * @package CREATOR-STAGING — Site Catalog (Modular SSOT)
 * @author Padmin D. Curtis (AI Partner OS3.0) for Fabio Cherici
 * @version 1.0.0 (FlorenceEGI — CREATOR-STAGING)
 * @date 2026-04-20
 * @purpose Single source of truth for base site, section addons, feature addons and tier bundles (setup + monthly EUR).
 */

export const BASE_PAGES = [
  { id: 'home', route: '' },
  { id: 'bio', route: 'bio' },
  { id: 'gallery', route: 'gallery' },
  { id: 'statement', route: 'statement' },
  { id: 'contact', route: 'contact' },
] as const;

export const SECTIONS = [
  { id: 'collections',   route: 'collections',   price_setup: 300, price_monthly: 0,  schemaType: 'CreativeWorkSeries' },
  { id: 'exhibitions',   route: 'exhibitions',   price_setup: 400, price_monthly: 0,  schemaType: 'ExhibitionEvent' },
  { id: 'press',         route: 'press',         price_setup: 250, price_monthly: 0,  schemaType: 'Article' },
  { id: 'cv',            route: 'cv',            price_setup: 200, price_monthly: 0,  schemaType: 'Person' },
  { id: 'story_behind',  route: 'story-behind',  price_setup: 500, price_monthly: 0,  schemaType: 'Article' },
  { id: 'process',       route: 'process',       price_setup: 350, price_monthly: 0,  schemaType: 'CreativeWork' },
  { id: 'journal',       route: 'journal',       price_setup: 800, price_monthly: 25, schemaType: 'Blog' },
  { id: 'live',          route: 'live',          price_setup: 600, price_monthly: 35, schemaType: 'Event' },
  { id: 'commission',    route: 'commission',    price_setup: 500, price_monthly: 0,  schemaType: 'Service' },
] as const;

export type SectionId = typeof SECTIONS[number]['id'];

export const FEATURES = [
  { id: 'newsletter',   price_setup: 300,  price_monthly: 15 },
  { id: 'brand_driven', price_setup: 1500, price_monthly: 0  },
  { id: 'own_domain',   price_setup: 150,  price_monthly: 5  },
] as const;

export type FeatureId = typeof FEATURES[number]['id'];

export const TIERS = [
  {
    id: 'creator',
    setup: 3500,
    monthly: 89,
    included_sections: [] as SectionId[],
    included_features: [] as FeatureId[],
  },
  {
    id: 'studio',
    setup: 6500,
    monthly: 149,
    included_sections: ['collections', 'exhibitions', 'press', 'cv', 'story_behind'] as SectionId[],
    included_features: ['newsletter'] as FeatureId[],
  },
  {
    id: 'maestro',
    setup: 12000,
    monthly: 249,
    included_sections: ['collections', 'exhibitions', 'press', 'cv', 'story_behind', 'process', 'live', 'journal', 'commission'] as SectionId[],
    included_features: ['newsletter', 'brand_driven', 'own_domain'] as FeatureId[],
  },
] as const;

export type TierId = typeof TIERS[number]['id'];

export function getTier(id: TierId) {
  return TIERS.find((t) => t.id === id)!;
}

export function getSection(id: string) {
  return SECTIONS.find((s) => s.id === id);
}

export function getFeature(id: string) {
  return FEATURES.find((f) => f.id === id);
}

export interface Quote {
  setup: number;
  monthly: number;
  addon_sections: SectionId[];
  addon_features: FeatureId[];
}

export function computeQuote(
  tierId: TierId,
  selectedSections: SectionId[],
  selectedFeatures: FeatureId[],
): Quote {
  const tier = getTier(tierId);

  const addonSections = selectedSections.filter((s) => !tier.included_sections.includes(s));
  const addonFeatures = selectedFeatures.filter((f) => !tier.included_features.includes(f));

  const sectionsSetup = addonSections.reduce((sum, id) => sum + (getSection(id)?.price_setup ?? 0), 0);
  const sectionsMonthly = addonSections.reduce((sum, id) => sum + (getSection(id)?.price_monthly ?? 0), 0);
  const featuresSetup = addonFeatures.reduce((sum, id) => sum + (getFeature(id)?.price_setup ?? 0), 0);
  const featuresMonthly = addonFeatures.reduce((sum, id) => sum + (getFeature(id)?.price_monthly ?? 0), 0);

  return {
    setup: tier.setup + sectionsSetup + featuresSetup,
    monthly: tier.monthly + sectionsMonthly + featuresMonthly,
    addon_sections: addonSections,
    addon_features: addonFeatures,
  };
}
