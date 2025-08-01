import { NavLink, useNavigate } from "react-router";
import { useTheme as useMuiTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import {
  HvHeader,
  HvHeaderActions,
  HvHeaderBrand,
  HvHeaderNavigation,
  HvIconButton,
  useTheme,
} from "@hitachivantara/uikit-react-core";
import { Debug, ThemeSwitcher } from "@hitachivantara/uikit-react-icons";

import { useNavigationContext } from "../context/navigation";

const UIKitLogo = () => (
  <svg width="100" viewBox="0 0 439 160" fill="light-dark(#333, #fff)">
    <title>UI Kit Logo</title>
    <path d="M0 12C0 5.37258 5.37258 0 12 0H165C171.627 0 177 5.37258 177 12V148C177 154.627 171.627 160 165 160H12C5.37258 160 0 154.627 0 148V12Z" />
    <path
      d="M82.2727 39.7273H105.966V95.6364C105.966 102.284 104.375 108.037 101.193 112.895C98.0398 117.724 93.6364 121.46 87.983 124.102C82.3295 126.716 75.767 128.023 68.2955 128.023C60.767 128.023 54.1761 126.716 48.5227 124.102C42.8693 121.46 38.4659 117.724 35.3125 112.895C32.1875 108.037 30.625 102.284 30.625 95.6364V39.7273H54.3182V93.5909C54.3182 96.2898 54.9148 98.7045 56.108 100.835C57.3011 102.937 58.9489 104.585 61.0511 105.778C63.1818 106.972 65.5966 107.568 68.2955 107.568C71.0227 107.568 73.4375 106.972 75.5398 105.778C77.642 104.585 79.2898 102.937 80.483 100.835C81.6761 98.7045 82.2727 96.2898 82.2727 93.5909V39.7273ZM140.92 39.7273V127H117.227V39.7273H140.92Z"
      fill="light-dark(#fff, #333)"
    />
    <path d="M214.608 127V39.7273H230.418V79.8267H231.483L265.531 39.7273H284.835L251.085 78.8892L285.134 127H266.128L240.091 89.5852L230.418 101.006V127H214.608ZM311.629 39.7273V127H295.819V39.7273H311.629ZM324.913 52.9801V39.7273H394.544V52.9801H367.57V127H351.888V52.9801H324.913Z" />
  </svg>
);

export const Header = () => {
  const navigate = useNavigate();
  const theme = useMuiTheme();
  const { selectedMode, colorModes, changeMode } = useTheme();
  const { activePath, navigation } = useNavigationContext();

  const isXs = useMediaQuery(theme.breakpoints.only("xs"));

  return (
    <HvHeader position="fixed" className="w-full left-0">
      <HvHeaderBrand
        logo={
          <NavLink to="/">
            <UIKitLogo />
          </NavLink>
        }
        name={!isXs ? "Showroom" : undefined}
      />

      <HvHeaderNavigation
        data={navigation}
        selected={activePath?.id}
        onClick={(event, selection) => {
          if (selection.path) navigate(selection.path);
        }}
      />

      <HvHeaderActions>
        {import.meta.env.DEV && (
          <HvIconButton title="Test page" component={NavLink} to="/debug">
            <Debug />
          </HvIconButton>
        )}
        <HvIconButton
          title="Change color mode"
          onClick={() => {
            const nextIdx = colorModes.findIndex((m) => m === selectedMode) + 1;
            changeMode(colorModes[nextIdx % colorModes.length]);
          }}
        >
          <ThemeSwitcher />
        </HvIconButton>
      </HvHeaderActions>
    </HvHeader>
  );
};
