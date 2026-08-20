import {
  HvAppShellEventThemeTrigger,
  type HvAppShellEventTheme,
} from "@pentaho/app-shell-events";
import {
  HvButton,
  HvGlobalActions,
  HvGrid,
  HvTypography,
  useTheme,
  type HvThemeColorMode,
} from "@pentaho/uikit-react-core";

function Button({ colorMode }: { colorMode: HvThemeColorMode }) {
  const handleColorModeClick = () => {
    globalThis.dispatchEvent(
      new CustomEvent<HvAppShellEventTheme>(HvAppShellEventThemeTrigger, {
        detail: { colorMode },
      }),
    );
  };

  return (
    <HvButton
      className="capitalize"
      variant="secondarySubtle"
      onClick={handleColorModeClick}
    >
      {colorMode}
    </HvButton>
  );
}

const Theming = () => {
  const { colorModes } = useTheme();

  return (
    <>
      <HvGlobalActions title="Theming" className="mb-xs" />

      <HvGrid container className="mb-xs">
        <HvGrid display="flex" justifyContent="center" size={12}>
          <HvTypography variant="title3">Color mode</HvTypography>
        </HvGrid>

        <HvGrid display="flex" justifyContent="space-evenly" size={12}>
          {colorModes.map((colorMode) => (
            <Button key={colorMode} colorMode={colorMode} />
          ))}
        </HvGrid>
      </HvGrid>
    </>
  );
};

export default Theming;
