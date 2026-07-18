/*! ******************************************************************************
 *
 * Pentaho
 *
 * Copyright (C) 2026 by Pentaho Canada Inc. : http://www.pentaho.com
 *
 * Use of this software is governed by the Business Source License included
 * in the LICENSE.TXT file.
 *
 * Change Date: 2030-06-15
 ******************************************************************************/
import { useUniqueId } from "@dnd-kit/utilities";
import { css } from "@emotion/css";
import {
  HvOverflowTooltip,
  HvTypography,
  theme,
} from "@hitachivantara/uikit-react-core";
import { Preview, Table } from "@hitachivantara/uikit-react-icons";

const classes = {
  root: css({
    borderRadius: theme.radii.round,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    backgroundColor: theme.colors.primaryDimmed,
    borderWidth: "1px",
    borderColor: theme.colors.primaryDimmed,
    width: "100%",
    height: "100%",
  }),
  header: css({
    paddingLeft: theme.spacing("xs"),
    borderRadius: `${theme.radii.round} ${theme.radii.round} 0 0`,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  }),
  titleContainer: css({
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    overflow: "hidden",
    textOverflow: "ellipsis",
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
};

export interface FactTableProps {
  id: string;
  title?: string;
  icon?: React.ReactNode;
  children?: React.ReactNode;
}

export const FactTable = ({
  id: idProp,
  title,
  icon = <Table />,
  children,
}: FactTableProps) => {
  const id = useUniqueId(idProp);

  const hasChildren = !!children;

  return (
    <div className={classes.root} id={id}>
      <div className={classes.header}>
        <div className={classes.titleContainer}>
          {icon}
          <HvOverflowTooltip
            data={
              <HvTypography
                variant="title4"
                component="p"
                className={classes.title}
              >
                {title}
              </HvTypography>
            }
          />
        </div>
        <Preview color={theme.colors.primary} />
      </div>
      {hasChildren && <div className={classes.content}>{children}</div>}
    </div>
  );
};
