import { useState } from "react";
import { css, cx } from "@emotion/css";
import {
  HvButton,
  HvDropDownMenu,
  HvOverflowTooltip,
  HvTypography,
  theme,
  useUniqueId,
  type HvListValue,
} from "@hitachivantara/uikit-react-core";
import { DropDownXS, DropUpXS } from "@hitachivantara/uikit-react-icons";

const classes = {
  root: css({
    borderRadius: "16px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    backgroundColor: theme.colors.bgContainer,
    borderWidth: "1px",
    borderColor: theme.colors.borderSubtle,
    width: "100%",
    height: "100%",
  }),
  header: css({
    padding: theme.spacing("2px", "xs", "2px", "xs"),
    borderRadius: "16px 16px 0 0",
    borderBottom: `1px solid ${theme.colors.borderSubtle}`,
    display: "flex",
    flexDirection: "row",
    backgroundColor: theme.colors.bgContainer,
    alignItems: "center",
  }),
  titleContainer: css({
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    maxWidth: "80%",
  }),
  title: css({
    overflow: "hidden",
    textOverflow: "ellipsis",
  }),
  content: css({
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: theme.spacing("sm"),
    gap: theme.spacing("xs"),
  }),
  childless: css({
    padding: theme.spacing(0, 0, 0, "xs"),
    borderRadius: "16px",
    border: "unset",
  }),
  actions: css({
    marginLeft: "auto",
  }),
};

export type HierarchyData = LevelData | FactTableData;

export interface BaseLevelData {
  id: string;
  label: string;
  icon?: React.ReactNode;
  children?: HierarchyData[];
}

export interface LevelData extends BaseLevelData {
  actions?: HvListValue[];
  type: "level";
}

export interface FactTableData extends BaseLevelData {
  type: "table";
}

export interface LevelProps {
  id: string;
  title?: string;
  icon?: React.ReactNode;
  children?: React.ReactNode;
  actions?: HvListValue[];
  classes?: Record<string, string>;
  collapsible?: boolean;
  collapsed?: boolean;
}

export const Level = ({
  id: idProp,
  icon,
  title,
  children,
  actions = [],
  collapsible = false,
  collapsed = false,
  classes: classesProp,
}: LevelProps) => {
  const [showContent, setShowContent] = useState(!collapsed);

  const id = useUniqueId(idProp);

  const hasChildren = !!children;

  return (
    <div className={cx(classes.root, classesProp?.root)} id={id}>
      <div
        className={cx(classes.header, classesProp?.header, {
          [classes.childless]: !hasChildren,
        })}
      >
        <div className={classes.titleContainer}>
          {icon}
          <HvOverflowTooltip
            data={
              <HvTypography
                variant={hasChildren ? "title4" : "body"}
                component="p"
                className={classes.title}
              >
                {title}
              </HvTypography>
            }
          />
        </div>
        {actions && (
          <HvDropDownMenu
            dataList={actions}
            classes={{ root: classes.actions }}
          />
        )}
        {collapsible && (
          <HvButton
            icon
            onClick={() => setShowContent((p) => !p)}
            aria-label={showContent ? "Collapse" : "Expand"}
          >
            {showContent ? <DropUpXS /> : <DropDownXS />}
          </HvButton>
        )}
      </div>
      {hasChildren && showContent && (
        <div className={classes.content}>{children}</div>
      )}
    </div>
  );
};
