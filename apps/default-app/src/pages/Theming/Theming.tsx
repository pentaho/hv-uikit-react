import {
  HvAppShellEventTheme,
  HvAppShellEventThemeTrigger,
} from "@hitachivantara/app-shell-events";
import {
  HvButton,
  HvGlobalActions,
  HvGrid,
  HvThemeColorMode,
  HvTypography,
  useTheme,
} from "@hitachivantara/uikit-react-core";

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
        <HvGrid item xs={12} display="flex" justifyContent="center">
          <HvTypography variant="title3">Color mode</HvTypography>
        </HvGrid>

        <HvGrid item xs={12} display="flex" justifyContent="space-evenly">
          {colorModes.map((colorMode) => (
            <Button key={colorMode} colorMode={colorMode} />
          ))}
        </HvGrid>
      </HvGrid>
    </>
  );
};

export default Theming;
