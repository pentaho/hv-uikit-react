import { theme } from "./theme";

it("returns the expected colors values", () => {
  expect(theme.colors.primary).toBe("var(--uikit-colors-primary)");
  expect(theme.colors.positive).toBe("var(--uikit-colors-positive)");
  expect(theme.colors.text).toBe("var(--uikit-colors-text)");
});
it("returns the expected space values", () => {
  expect(theme.space.xs).toBe("var(--uikit-space-xs)");
  expect(theme.space.sm).toBe("var(--uikit-space-sm)");
  expect(theme.space.md).toBe("var(--uikit-space-md)");
  expect(theme.space.lg).toBe("var(--uikit-space-lg)");
  expect(theme.space.xl).toBe("var(--uikit-space-xl)");
});
it("returns the expected spacing() values", () => {
  expect(theme.spacing("md", "2px", "0")).toBe("var(--uikit-space-md) 2px 0");
  expect(theme.spacing("lg", "4px")).toBe("var(--uikit-space-lg) 4px");
  expect(theme.spacing("xl")).toBe("var(--uikit-space-xl)");
});
it("returns the correct alpha transparency values", () => {
  expect(theme.alpha("primary", 0.5)).toBe(
    "color-mix(in srgb, var(--uikit-colors-primary) 50%, transparent)",
  );
  expect(theme.alpha("warning", 0.8)).toBe(
    "color-mix(in srgb, var(--uikit-colors-warning) 80%, transparent)",
  );

  expect(theme.alpha("text", "60%")).toBe(
    "color-mix(in srgb, var(--uikit-colors-text) 60%, transparent)",
  );

  expect(theme.alpha("#ff0000", 0.3)).toBe(
    "color-mix(in srgb, #ff0000 30%, transparent)",
  );
  expect(theme.alpha("rgb(255, 0, 0)", "25%")).toBe(
    "color-mix(in srgb, rgb(255, 0, 0) 25%, transparent)",
  );
});

it("returns the correct color-mix values", () => {
  expect(theme.mix("primary", 0.7, "text")).toBe(
    "color-mix(in srgb, var(--uikit-colors-primary) 70%, var(--uikit-colors-text))",
  );
  expect(theme.mix("warning", 0.5, "positive")).toBe(
    "color-mix(in srgb, var(--uikit-colors-warning) 50%, var(--uikit-colors-positive))",
  );

  expect(theme.mix("primary", "60%", "text")).toBe(
    "color-mix(in srgb, var(--uikit-colors-primary) 60%, var(--uikit-colors-text))",
  );

  expect(theme.mix("primary", 0.8)).toBe(
    "color-mix(in srgb, var(--uikit-colors-primary) 80%, transparent)",
  );
  expect(theme.mix("#ff0000", 0.6, "#00ff00")).toBe(
    "color-mix(in srgb, #ff0000 60%, #00ff00)",
  );
  expect(theme.mix("rgb(255, 0, 0)", "75%", "blue")).toBe(
    "color-mix(in srgb, rgb(255, 0, 0) 75%, blue)",
  );
  expect(theme.mix("primary", 0.4, "white")).toBe(
    "color-mix(in srgb, var(--uikit-colors-primary) 40%, white)",
  );
  expect(theme.mix("#000000", "30%", "negative")).toBe(
    "color-mix(in srgb, #000000 30%, var(--uikit-colors-negative))",
  );
});
