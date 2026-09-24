/**
 * Validation rules extracted from component contracts (JSDoc @tags)
 * Hard-coded for HvButton and HvAvatar to test validation runner
 */

export interface ValidationRule {
  componentName: string;
  ruleName: string;
  type: "variant" | "token" | "antiPattern" | "a11y";
  check: (props: Record<string, any>) => { pass: boolean; reason?: string };
  failureMessage: string;
  suggestion: string;
  enforcement: "error" | "warn" | "info";
}

const HVBUTTON_VALID_VARIANTS = [
  "contained",
  "subtle",
  "ghost",
  "positiveContained",
  "positiveSutle",
  "positiveGhost",
  "negativeContained",
  "negativeSutle",
  "negativeGhost",
  "warningContained",
  "warningSutle",
  "warningGhost",
  "primaryContained",
  "primarySutle",
  "primaryGhost",
  "secondaryContained",
  "secondarySutle",
  "secondaryGhost",
  "semantic",
];

const HVAVATAR_VALID_VARIANTS = ["circular", "square"];

/**
 * HvButton validation rules
 */
export const HV_BUTTON_RULES: ValidationRule[] = [
  {
    componentName: "HvButton",
    ruleName: "variant-valid",
    type: "variant",
    check: (props) => {
      const variant = props.variant;
      if (!variant) return { pass: true }; // default is valid
      const isValid = HVBUTTON_VALID_VARIANTS.includes(variant);
      return {
        pass: isValid,
        reason: isValid
          ? undefined
          : `variant "${variant}" is not a valid HvButton variant`,
      };
    },
    failureMessage: "Invalid variant name",
    suggestion: `Use one of: ${HVBUTTON_VALID_VARIANTS.join(", ")}`,
    enforcement: "error",
  },
  {
    componentName: "HvButton",
    ruleName: "no-raw-colors",
    type: "token",
    check: (props) => {
      const color = props.color;
      const style = props.style as Record<string, any> | undefined;
      const styleColor = style?.color;

      // Check for raw hex/rgb colors
      const isRawHex =
        typeof color === "string" &&
        /^#[0-9A-Fa-f]{6}|#[0-9A-Fa-f]{3}/.test(color);
      const isRawRgb = typeof color === "string" && /^rgb(a?)\(/.test(color);
      const isStyleRaw =
        styleColor &&
        (/^#[0-9A-Fa-f]{6}|#[0-9A-Fa-f]{3}/.test(styleColor) ||
          /^rgb(a?)\(/.test(styleColor));

      return {
        pass: !(isRawHex || isRawRgb || isStyleRaw),
        reason:
          isRawHex || isRawRgb || isStyleRaw
            ? "Raw color value instead of design token"
            : undefined,
      };
    },
    failureMessage: "Raw color value instead of design token",
    suggestion:
      'Use variant="negative" or import color token from @pentaho/uikit-styles',
    enforcement: "error",
  },
  {
    componentName: "HvButton",
    ruleName: "selected-toggle-semantics",
    type: "antiPattern",
    check: (props) => {
      const selected = props.selected;
      const ariaPressed = props["aria-pressed"];

      // If selected is true but aria-pressed is not set, this is likely wrong
      if (selected === true && ariaPressed === undefined) {
        return {
          pass: false,
          reason:
            "selected prop implies aria-pressed toggle semantics but aria-pressed is not set",
        };
      }

      return { pass: true };
    },
    failureMessage:
      '"selected" prop without aria-pressed implies incorrect toggle usage',
    suggestion:
      "Add aria-pressed={isActive} and onClick handler for true toggles, or remove selected prop",
    enforcement: "warn",
  },
  {
    componentName: "HvButton",
    ruleName: "icon-only-needs-aria-label",
    type: "a11y",
    check: (props) => {
      const children = props.children;
      const ariaLabel = props["aria-label"];
      const title = props.title;

      // Only flag if it looks like an icon (emoji or icon element)
      // Don't flag text content like "Save", "Cancel", etc
      if (children && (children.includes("🔍") || children.includes("Icon"))) {
        if (!ariaLabel && !title) {
          return {
            pass: false,
            reason: "Icon-only button must have aria-label for accessibility",
          };
        }
      }

      return { pass: true };
    },
    failureMessage: "Icon-only button missing aria-label",
    suggestion: 'Add aria-label="Button label here" for accessibility',
    enforcement: "error",
  },
];

/**
 * HvAvatar validation rules
 */
export const HV_AVATAR_RULES: ValidationRule[] = [
  {
    componentName: "HvAvatar",
    ruleName: "variant-valid",
    type: "variant",
    check: (props) => {
      const variant = props.variant;
      if (!variant) return { pass: true }; // default is circular
      const isValid = HVAVATAR_VALID_VARIANTS.includes(variant);
      return {
        pass: isValid,
        reason: isValid
          ? undefined
          : `variant "${variant}" is not a valid HvAvatar variant`,
      };
    },
    failureMessage: "Invalid variant name",
    suggestion: `Use one of: ${HVAVATAR_VALID_VARIANTS.join(", ")}`,
    enforcement: "error",
  },
  {
    componentName: "HvAvatar",
    ruleName: "image-needs-alt",
    type: "a11y",
    check: (props) => {
      const src = props.src;
      const srcSet = props.srcSet;
      const alt = props.alt;

      if ((src || srcSet) && !alt) {
        return {
          pass: false,
          reason: "Image avatar missing alt text",
        };
      }

      return { pass: true };
    },
    failureMessage: "Missing alt text for image",
    suggestion: 'Add alt="User description" prop for accessibility',
    enforcement: "error",
  },
  {
    componentName: "HvAvatar",
    ruleName: "no-bg-color-in-group",
    type: "antiPattern",
    check: (props) => {
      const backgroundColor = props.backgroundColor;
      const bgColor = props["bg-color"];
      const style = (props.style as Record<string, any> | undefined)
        ?.backgroundColor;

      if (backgroundColor || bgColor || style) {
        return {
          pass: false,
          reason:
            "Custom backgroundColor should not be set when avatar will be in AvatarGroup",
        };
      }

      return { pass: true };
    },
    failureMessage: "Custom backgroundColor conflicts with AvatarGroup styling",
    suggestion:
      "Remove backgroundColor prop and let AvatarGroup control styling",
    enforcement: "warn",
  },
  {
    componentName: "HvAvatar",
    ruleName: "no-image-and-initials",
    type: "antiPattern",
    check: (props) => {
      const src = props.src;
      const children = props.children;

      // If both src and text children exist, this is confusing
      if (src && typeof children === "string" && children.trim().length > 0) {
        return {
          pass: false,
          reason: "Providing both image and initials is ambiguous",
        };
      }

      return { pass: true };
    },
    failureMessage: "Ambiguous: both image src and initials provided",
    suggestion: "Provide either src or children (initials), not both",
    enforcement: "warn",
  },
];

/**
 * Get all rules for a component
 */
export function getRulesForComponent(componentName: string): ValidationRule[] {
  switch (componentName) {
    case "HvButton":
      return HV_BUTTON_RULES;
    case "HvAvatar":
      return HV_AVATAR_RULES;
    default:
      return [];
  }
}

/**
 * Get all known components with rules
 */
export function getKnownComponents(): string[] {
  return ["HvButton", "HvAvatar"];
}
