import { useState } from "react";
import {
  ExtractNames,
  HvActionsGeneric,
  HvActionsGenericProps,
  HvButton,
  HvButtonProps,
  HvInlineEditor,
  HvTooltip,
  HvTypography,
  theme,
  useLabels,
} from "@hitachivantara/uikit-react-core";
import { DropDownXS, Info } from "@hitachivantara/uikit-react-icons";

import { useFlowContext, useFlowNode, useFlowNodeUtils } from "../hooks";
import { HvFlowNodeParam } from "../types";
import { HvFlowBaseNode, HvFlowBaseNodeProps } from "./BaseNode";
import { staticClasses, useClasses } from "./Node.styles";
import { ParamRenderer } from "./Parameters";

export { staticClasses as flowNodeClasses };

export type HvFlowNodeClasses = ExtractNames<typeof useClasses>;

const DEFAULT_LABELS = {
  collapseLabel: "Collapse",
  expandLabel: "Expand",
};

export interface HvFlowNodeProps<T = any> extends HvFlowBaseNodeProps<T> {
  /** Node description. */
  description?: string;
  /** Node actions. */
  actions?: HvActionsGenericProps["actions"];
  /** Node action callback. */
  onAction?: HvActionsGenericProps["onAction"];
  /** Whether the actions should be all icon buttons when visible. @default true */
  actionsIconOnly?: HvActionsGenericProps["iconOnly"];
  /** Node maximum number of actions visible. */
  maxVisibleActions?: HvActionsGenericProps["maxVisibleActions"];
  /** Node subtitle - this is typically the node "name" */
  subtitle?: string;
  /** Node group ID */
  groupId?: string;
  /** Node expanded */
  expanded?: boolean;
  /** Node parameters */
  params?: HvFlowNodeParam[];
  /** Props to be passed to the expand parameters button. */
  expandParamsButtonProps?: HvButtonProps;
  /** Labels used on the node. */
  labels?: HvFlowBaseNodeProps["labels"] & Partial<typeof DEFAULT_LABELS>;
  /** A Jss Object used to override or extend the styles applied to the component. */
  classes?: HvFlowNodeClasses;
  /** Remove the ability to customize the label of the Node */
  disableInlineEdit?: boolean;
}

export const HvFlowNode = ({
  id,
  type,
  headerItems,
  actions,
  onAction,
  maxVisibleActions = 1,
  expanded = false,
  actionsIconOnly = true,
  params,
  classes: classesProp,
  labels: labelsProps,
  children,
  expandParamsButtonProps,
  disableInlineEdit,
  title: titleProp,
  subtitle: subtitleProp,
  description,
  groupId,
  color: colorProp,
  icon: iconProp,
  ...props
}: HvFlowNodeProps<unknown>) => {
  const { classes } = useClasses(classesProp);
  const [showParams, setShowParams] = useState(expanded);
  const { nodeGroups, defaultActions } = useFlowContext();
  const labels = useLabels(DEFAULT_LABELS, labelsProps);
  const node = useFlowNode();
  const { setNodeData } = useFlowNodeUtils();

  const inlineEditorWidth =
    actions === undefined ||
    (Array.isArray(actions) && actions.length === 0) ||
    maxVisibleActions === 0
      ? "100%"
      : `calc(200px - calc(${maxVisibleActions} * 32px + ${theme.spacing(2)}))`;

  const nodeGroup = (groupId && nodeGroups && nodeGroups[groupId]) || undefined;

  const title = titleProp || nodeGroup?.label;
  const icon = iconProp || nodeGroup?.icon;
  const color = colorProp || nodeGroup?.color;
  const subtitle = subtitleProp || node?.data.nodeLabel;

  const hasParams = !!(params && params.length > 0);

  return (
    <HvFlowBaseNode
      id={id}
      type={type}
      title={title}
      icon={icon}
      color={color}
      nodeActions={defaultActions}
      classes={classes}
      headerItems={
        <>
          {headerItems}
          {description && (
            <HvTooltip title={description}>
              <Info color="textDark" />
            </HvTooltip>
          )}
          {hasParams && (
            <HvButton
              icon
              onClick={() => setShowParams((p) => !p)}
              aria-label={
                showParams ? labels?.collapseLabel : labels?.expandLabel
              }
              {...expandParamsButtonProps}
            >
              <DropDownXS rotate={showParams} color="textDark" />
            </HvButton>
          )}
        </>
      }
      labels={labels as HvFlowNodeProps["labels"]}
      {...props}
    >
      {(subtitle || actions) && (
        <div className={classes.subtitleContainer}>
          {subtitle &&
            (disableInlineEdit ? (
              <HvTypography className={classes.subtitle}>
                {subtitle}
              </HvTypography>
            ) : (
              <HvInlineEditor
                defaultValue={subtitle}
                showIcon
                style={{ width: inlineEditorWidth }}
                classes={{
                  root: classes.inlineEditRoot,
                  button: classes.inlineEditButton,
                }}
                onBlur={(evt, value) =>
                  setNodeData((prev) => ({ ...prev, nodeLabel: value }))
                }
              />
            ))}
          {actions && (
            <HvActionsGeneric
              className={classes.actions}
              classes={{ button: classes.actionsButton }}
              actions={actions}
              onAction={onAction}
              maxVisibleActions={maxVisibleActions}
              iconOnly={actionsIconOnly}
            />
          )}
        </div>
      )}
      {children}
      {showParams && params && (
        <div className={classes.paramsContainer}>
          <ParamRenderer params={params} data={node?.data} />
        </div>
      )}
    </HvFlowBaseNode>
  );
};
