import type { ExtractNames } from "@hitachivantara/uikit-react-utils";

import { ViewMode } from "../../enums";
import { VisibilitySelectorActions } from "../../types";
import { getMonthNamesList } from "../../utils";
import { Navigation } from "../Navigation";
import { staticClasses, useClasses } from "./ComposedNavigation.styles";

export { staticClasses as composedNavigationClasses };

export type HvComposedNavigationClasses = ExtractNames<typeof useClasses>;

export const HvComposedNavigation = ({
  classes: classesProp,
  id,
  locale,
  onChange,
  onViewModeChange,
  visibleYear,
  visibleMonth,
  ...others
}: HvComposedNavigationProps) => {
  const { classes } = useClasses(classesProp);

  const listMonthNamesLong = getMonthNamesList(locale, "long");
  const monthName = listMonthNamesLong[visibleMonth - 1];

  return (
    <div className={classes.navigationContainer} {...others}>
      <div className={classes.navigationMonth}>
        <Navigation
          navigationText={monthName}
          onNavigatePrevious={(event) => {
            onChange?.(event, "previous_month");
          }}
          onNavigateNext={(event) => {
            onChange?.(event, "next_month");
          }}
          onTextClick={() => {
            onViewModeChange("monthly");
          }}
          className={classes.navigationMonth}
        />
      </div>

      <Navigation
        navigationText={visibleYear.toString()}
        onNavigatePrevious={(event) => {
          onChange?.(event, "previous_year");
        }}
        onNavigateNext={(event) => {
          onChange?.(event, "next_year");
        }}
      />
    </div>
  );
};

export interface HvComposedNavigationProps {
  /**
   * A Jss Object used to override or extend the component styles.
   */
  classes?: HvComposedNavigationClasses;
  /**
   * Identifier.
   */
  id?: string;
  /**
   * Locale to be used by the calendar.
   */
  locale?: string;
  /**
   * Callback to define the input date.
   */
  onChange?: (event: any, action: VisibilitySelectorActions) => void;
  /**
   * Callback to define the view mode.
   */
  onViewModeChange: (viewMode: ViewMode) => void;
  /**
   * Controls the visible month of the Calendar
   */
  visibleMonth: number;
  /**
   * Controls the visible month of the Calendar
   */
  visibleYear: number;
}
