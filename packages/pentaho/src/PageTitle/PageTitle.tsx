import {
  HvTypography,
  type HvBaseProps,
} from "@hitachivantara/uikit-react-core";

import { useClasses } from "./PageTitle.styles";

export interface PageTitleProps
  extends Omit<HvBaseProps, "children" | "title"> {
  /** Back button element */
  backButton?: React.ReactNode;
  /** Breadcrumb element */
  breadcrumb?: React.ReactNode;
  /** Icon element */
  icon?: React.ReactNode;
  /** Title text or element */
  title: React.ReactNode;
  /** Description text or element */
  description?: React.ReactNode;
  /** Action buttons or controls */
  actions?: React.ReactNode;
  /** Tabs element or PageTitle.Tabs component */
  tabs?: React.ReactNode;
}

/**
 * Page Title provides a consistent page header with breadcrumbs, navigation, actions, and tabs, integrating seamlessly with `OverflowTabs`.
 */
export const PageTitle = ({
  className,
  backButton,
  breadcrumb,
  icon,
  title,
  description,
  actions,
  tabs,
  ...others
}: PageTitleProps) => {
  const { classes, cx } = useClasses();

  return (
    <div className={cx(classes.root, className)} {...others}>
      <header className={classes.container}>
        {backButton && <div className={classes.backButton}>{backButton}</div>}

        <div className={classes.main}>
          {breadcrumb && <div className={classes.breadcrumb}>{breadcrumb}</div>}

          <div className={classes.row}>
            <div className={classes.titleSection}>
              {icon && <div className={classes.icon}>{icon}</div>}

              <div className={classes.titleContainer}>
                {typeof title === "string" ? (
                  <HvTypography
                    variant="title3"
                    component="h1"
                    className={classes.title}
                  >
                    {title}
                  </HvTypography>
                ) : (
                  title
                )}

                {description && (
                  <div className={classes.description}>
                    {typeof description === "string" ? (
                      <HvTypography variant="caption1">
                        {description}
                      </HvTypography>
                    ) : (
                      description
                    )}
                  </div>
                )}
              </div>
            </div>

            {actions && <div className={classes.actions}>{actions}</div>}
          </div>
        </div>
      </header>

      {tabs && <div className={classes.tabs}>{tabs}</div>}
    </div>
  );
};
