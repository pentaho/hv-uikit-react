/**
 * Schema for colocated `<Component>.doc.ts` files.
 *
 * These carry the guidance that cannot be derived from the source: when to reach
 * for a component, when not to, what surprises people, and which decisions shaped
 * its current API. Props, style classes, design tokens and Storybook examples are
 * extracted automatically — do not restate them here.
 *
 * Doc files are build-time only. They are not exported from `index.ts` and do not
 * ship: `packages/core` publishes `files: ["dist"]`, and nothing imports them from
 * component code. `uikit-cli` serves a generated index built from them.
 */

/** A do/don't statement. `guidance: false` marks an anti-pattern. */
export interface HvDocBestPractice {
  guidance: boolean;
  description: string;
}

/** An accessibility obligation, ideally naming the WCAG criterion it satisfies. */
export interface HvDocAccessibility {
  /** e.g. `"1.4.3 Contrast (Minimum)"` */
  criterion?: string;
  description: string;
}

/** A named part of the component, for describing its structure. */
export interface HvDocAnatomy {
  name: string;
  required: boolean;
  description: string;
}

/**
 * A decision that shaped the component's API.
 *
 * `status` is what keeps a superseded decision from reading like a live one:
 * - `draft` — proposed, not yet governing
 * - `current` — governs the implementation
 * - `archived` — no longer applies; set `supersededBy`
 */
export interface HvDocDecision {
  change: string;
  status: "draft" | "current" | "archived";
  /** Release the decision landed in, e.g. `"v7"`. */
  since?: string;
  /** How to move existing code. */
  migrate?: string;
  /** Why the decision was taken, when it is not obvious from the change. */
  rationale?: string;
  /** For `archived`: what replaced it. */
  supersededBy?: string;
}

export interface HvDocUsage {
  /** One or two sentences on what the component is for. */
  description: string;
  bestPractices?: HvDocBestPractice[];
  accessibility?: HvDocAccessibility[];
  anatomy?: HvDocAnatomy[];
}

/**
 * Narrows the advertised prop surface.
 *
 * Needed where a component inherits a large upstream type — `HvGridProps extends
 * Omit<MuiGridProps, …>`, so MUI's whole system surface resolves as ours. Nothing
 * in the types distinguishes the two, so the real API has to be stated.
 */
export interface HvDocProps {
  /** Advertise only these. Everything else is treated as inherited noise. */
  only?: string[];
  /** Advertise everything except these. */
  hide?: string[];
}

export interface HvComponentDoc {
  /** Exported component name, e.g. `"HvButton"`. */
  name: string;
  /** Grouping used by the docs site and the CLI index. */
  category?: string;
  /** Alternative terms someone might search for. */
  keywords?: string[];
  usage: HvDocUsage;
  /** Only needed when extraction cannot infer the real surface. */
  props?: HvDocProps;
  decisions?: HvDocDecision[];
}
