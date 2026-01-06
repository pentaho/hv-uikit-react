import type { ExtractNames } from "@hitachivantara/uikit-react-utils";

import { HvButton } from "../../../Button";
import { HvIcon } from "../../../icons";
import { HvBaseProps } from "../../../types/generic";
import { staticClasses, useClasses } from "./Navigation.styles";

export { staticClasses as navigationClasses };

export type HvNavigationClasses = ExtractNames<typeof useClasses>;

export const Navigation = ({
  id,
  classes: classesProp,
  onNavigatePrevious,
  onNavigateNext,
  onTextClick,
  navigationText = "n/a",
  isPreviousEnabled = true,
  isNextEnabled = true,
}: NavigationProps) => {
  const { classes, cx } = useClasses(classesProp);

  return (
    <div className={classes.root}>
      <HvButton
        icon
        disabled={!isPreviousEnabled}
        aria-label="Previous"
        className={cx(classes.icon, {
          [classes.disabled]: !isPreviousEnabled,
        })}
        onClick={onNavigatePrevious}
      >
        <HvIcon name="CaretRight" size="xs" rotate />
      </HvButton>

      <HvButton
        id={id}
        variant="secondaryGhost"
        onClick={onTextClick}
        component={onTextClick ? "button" : "div"}
        className={cx(classes.text, {
          [classes.textWithoutHover]: !onTextClick,
        })}
      >
        {navigationText}
      </HvButton>

      <HvButton
        icon
        disabled={!isNextEnabled}
        aria-label="Next"
        className={cx(classes.icon, {
          [classes.disabled]: !isNextEnabled,
        })}
        onClick={onNavigateNext}
      >
        <HvIcon name="CaretRight" size="xs" />
      </HvButton>
    </div>
  );
};

export interface NavigationProps extends HvBaseProps {
  /**
   * A Jss Object used to override or extend the component styles.
   */
  classes?: HvNavigationClasses;
  /**
   * A function to be executed whenever the navigate previous action is triggered.
   */
  onNavigatePrevious: (event: React.MouseEvent<HTMLElement>) => void;
  /**
   * A function to be executed whenever the navigate next action is triggered.
   */
  onNavigateNext: (event: React.MouseEvent<HTMLElement>) => void;
  /**
   * A function to be executed whenever the text is clicked.
   */
  onTextClick?: () => void;
  /**
   * The text that will be shown between the navigation buttons.
   */
  navigationText?: string;
  /**
   * Flag stating if the previous button should be enabled or disabled.
   */
  isPreviousEnabled?: boolean;
  /**
   * Flag stating if the next button should be enabled or disabled.
   */
  isNextEnabled?: boolean;
}
