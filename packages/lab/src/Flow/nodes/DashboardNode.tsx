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
import {
  HvButton,
  HvDialog,
  HvDialogActions,
  HvDialogContent,
  HvDialogTitle,
  HvEmptyState,
  useLabels,
  type ExtractNames,
  type HvDialogProps,
} from "@hitachivantara/uikit-react-core";
import { Info } from "@hitachivantara/uikit-react-icons";

import { HvDashboard, type HvDashboardProps } from "../../Dashboard";
import { HvFlowNode, type HvFlowNodeProps } from "../Node";
import { staticClasses, useClasses } from "./DashboardNode.styles";

export { staticClasses as hvDashboardNodeClasses };

const DEFAULT_LABELS = {
  emptyMessage: "No visualizations connected to the dashboard.",
  dialogTitle: "Configure dashboard",
  dialogSubtitle: "Please configure the layout of your dashboard as needed.",
  dialogApply: "Apply",
  dialogCancel: "Cancel",
};

export type HvDashboardNodeClasses = ExtractNames<typeof useClasses>;

export interface HvDashboardNodeProps
  extends
    HvFlowNodeProps,
    Pick<HvDialogProps, "open" | "onClose">,
    Pick<HvDashboardProps, "layout"> {
  classes?: HvDashboardNodeClasses;
  labels?: HvFlowNodeProps["labels"] & Partial<typeof DEFAULT_LABELS>;
  previewItems?: React.ReactNode;
  onApply?: () => void;
  onCancel?: () => void;
  dashboardProps?: Omit<HvDashboardProps, "children">;
  dialogProps?: HvDialogProps;
}

/** @deprecated no longer supported. Instead create a custom node with `HvDialog` + `HvDashboard` */
export const HvDashboardNode = (props: HvDashboardNodeProps) => {
  const {
    id,
    open,
    layout,
    labels: labelsProp,
    classes: classesProp,
    previewItems,
    children,
    dialogProps,
    dashboardProps,
    onApply,
    onCancel,
    onClose,
    ...others
  } = props;
  const labels = useLabels(DEFAULT_LABELS, labelsProp);
  const { classes } = useClasses(classesProp);

  return (
    <HvFlowNode
      id={id}
      classes={classes}
      labels={labels as HvDashboardNodeProps["labels"]}
      {...others}
    >
      {children}
      <HvDialog
        open={open}
        maxWidth="lg"
        fullWidth
        onClose={onClose}
        {...dialogProps}
      >
        <HvDialogTitle variant="info">{labels?.dialogTitle}</HvDialogTitle>
        <HvDialogContent indentContent>
          {labels?.dialogSubtitle}
          {layout && layout?.length > 0 ? (
            <HvDashboard
              cols={12}
              layout={layout}
              compactType="vertical"
              rowHeight={80}
              margin={[16, 16]}
              containerPadding={[0, 16]}
              {...dashboardProps}
            >
              {previewItems}
            </HvDashboard>
          ) : (
            <HvEmptyState
              className={classes.empty}
              icon={<Info />}
              message={labels?.emptyMessage}
            />
          )}
        </HvDialogContent>
        <HvDialogActions>
          <HvButton variant="primary" onClick={onApply}>
            {labels?.dialogApply}
          </HvButton>
          <HvButton variant="secondarySubtle" onClick={onCancel}>
            {labels?.dialogCancel}
          </HvButton>
        </HvDialogActions>
      </HvDialog>
    </HvFlowNode>
  );
};
