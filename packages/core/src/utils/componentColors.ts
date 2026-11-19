// Colors components use that aren't theme tokens, as [light, dark]. The components' styles read them, and so does
// the Figma library's sync (packages/figma), which makes each a variable the library's components bind to.
import {
  blue,
  orange,
  pink,
  slate,
  teal,
  theme,
  violet,
  yellow,
} from "@pentaho/uikit-styles";

type Pair = [light: string, dark: string];

/** HvBaseInput's field fill. */
export const inputBg: Pair = ["#FFFFFF", slate[950]];

/** HvAvatar's text and fill for each `color`. */
export const avatarColors = {
  blue: {
    text: [theme.colors.primaryStrong, blue[300]],
    bg: [theme.colors.primaryDimmed, blue[900]],
  },
  orange: { text: [orange[700], orange[200]], bg: [orange[200], orange[900]] },
  teal: { text: [teal[800], teal[200]], bg: [teal[200], teal[900]] },
  violet: { text: [violet[800], violet[200]], bg: [violet[200], violet[900]] },
  pink: { text: [pink[900], pink[200]], bg: [pink[200], pink[900]] },
  yellow: { text: [yellow[700], yellow[100]], bg: [yellow[200], yellow[900]] },
  neutral: { text: [slate[400], slate[300]], bg: [slate[200], slate[700]] },
} satisfies Record<string, { text: Pair; bg: Pair }>;

export const lightDark = ([light, dark]: Pair) =>
  `light-dark(${light}, ${dark})`;
