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
import { Handle, NodeToolbar, Position, type NodeProps } from "reactflow";
import {
  HvIconButton,
  HvTypography,
  useLabels,
  type ExtractNames,
  type HvBaseProps,
} from "@hitachivantara/uikit-react-core";
import { mergeStyles } from "@hitachivantara/uikit-react-utils";

import { useHvNode, type HvUseNodeParams } from "../hooks";
import type {
  HvFlowNodeInput,
  HvFlowNodeInputGroup,
  HvFlowNodeOutput,
  HvFlowNodeOutputGroup,
} from "../types";
import { staticClasses, useClasses } from "./BaseNode.styles";
import {
  isConnected,
  isInputGroup,
  isOutputGroup,
  renderedIcon,
} from "./utils";

export { staticClasses as flowBaseNodeClasses };

export type HvFlowBaseNodeClasses = ExtractNames<typeof useClasses>;

export const DEFAULT_LABELS = {
  outputsTitle: "Outputs",
  inputsTitle: "Inputs",
  deleteActionLabel: "Delete",
  duplicateActionLabel: "Duplicate",
};

export interface HvFlowBaseNodeProps<T = any>
  extends
    Omit<HvBaseProps, "id" | "color">,
    Omit<HvUseNodeParams, "id">,
    NodeProps<T> {
  /** Header items */
  headerItems?: React.ReactNode;
  /** The content of the node footer */
  footer?: React.ReactNode;
  /** Labels used on the node. */
  labels?: Partial<typeof DEFAULT_LABELS>;
  /** A Jss Object used to override or extend the styles applied to the component. */
  classes?: HvFlowBaseNodeClasses;
}

export const HvFlowBaseNode = ({
  id,
  title: titleProp,
  headerItems,
  icon: iconProp,
  color: colorProp,
  inputs: inputsProp,
  outputs: outputsProp,
  nodeActions: nodeActionsProp,
  footer,
  classes: classesProp,
  labels: labelsProp,
  className,
  children,
}: HvFlowBaseNodeProps<unknown>) => {
  const {
    toggleShowActions,
    getNodeToolbarProps,
    handleDefaultAction,
    nodeActions,
    title,
    icon,
    color,
    iconColor,
    inputEdges,
    inputs,
    outputEdges,
    outputs,
    node,
  } = useHvNode({
    id,
    title: titleProp,
    inputs: inputsProp,
    outputs: outputsProp,
    icon: iconProp,
    color: colorProp,
    labels: labelsProp,
    nodeActions: nodeActionsProp,
  });

  const labels = useLabels(DEFAULT_LABELS, labelsProp);

  const { classes, cx } = useClasses(classesProp);

  const renderOutput = (output: HvFlowNodeOutput) => {
    const edgeConnected = isConnected(id, "source", output.id!, outputEdges);

    return (
      <div className={classes.outputContainer} key={output.id}>
        <Handle
          type="source"
          isConnectableEnd={false}
          id={output.id}
          position={Position.Right}
          className={cx(classes.handle, {
            [classes.handleConnected]: edgeConnected,
          })}
        />
        {output.isMandatory && !edgeConnected && (
          <div className={classes.mandatory} />
        )}
        <HvTypography component="div">{output.label}</HvTypography>
      </div>
    );
  };

  const renderInput = (input: HvFlowNodeInput) => {
    const edgeConnected = isConnected(id, "target", input.id!, inputEdges);

    return (
      <div className={classes.inputContainer} key={input.id}>
        <Handle
          type="target"
          isConnectableStart={false}
          id={input.id}
          position={Position.Left}
          className={cx(classes.handle, {
            [classes.handleConnected]: edgeConnected,
          })}
        />
        <HvTypography component="div">{input.label}</HvTypography>
        {input.isMandatory && !edgeConnected && (
          <div className={classes.mandatory} />
        )}
      </div>
    );
  };

  if (!node) return null;

  return (
    <div
      style={mergeStyles(undefined, {
        "--node-color": color,
      })}
      className={cx(
        "nowheel", // Disables the default canvas pan behaviour when scrolling inside the node
        classes.root,
        className,
      )}
      onMouseEnter={toggleShowActions}
      onMouseLeave={toggleShowActions}
    >
      <NodeToolbar {...getNodeToolbarProps()}>
        {nodeActions?.map((action) => (
          <HvIconButton
            key={action.id}
            title={action.label}
            onClick={() => handleDefaultAction(action)}
          >
            {renderedIcon(action.icon)}
          </HvIconButton>
        ))}
      </NodeToolbar>
      <div className={classes.headerContainer}>
        <div
          style={mergeStyles(undefined, {
            "--icon-color": iconColor,
          })}
          className={classes.titleContainer}
        >
          {icon}
          <HvTypography
            component="p"
            variant="title4"
            className={classes.title}
          >
            {title}
          </HvTypography>
        </div>
        {headerItems && <div style={{ display: "flex" }}>{headerItems}</div>}
      </div>
      {children && <div className={classes.contentContainer}>{children}</div>}
      {inputs && inputs.length > 0 && (
        <>
          <div className={classes.inputsTitleContainer}>
            <HvTypography>{labels?.inputsTitle}</HvTypography>
          </div>
          <div className={classes.inputsContainer}>
            {inputs?.map((input, idx) => {
              if (!isInputGroup(input)) return renderInput(input);

              return (
                <div
                  className={classes.inputGroupContainer}
                  key={`group${idx}`}
                >
                  <HvTypography component="div" variant="label">
                    {input.label}
                  </HvTypography>
                  {(input as HvFlowNodeInputGroup).inputs.map((inp) =>
                    renderInput(inp),
                  )}
                </div>
              );
            })}
          </div>
        </>
      )}
      {outputs && outputs.length > 0 && (
        <>
          <div className={classes.outputsTitleContainer}>
            <HvTypography>{labels?.outputsTitle}</HvTypography>
          </div>
          <div className={classes.outputsContainer}>
            {outputs?.map((output, idx) => {
              if (!isOutputGroup(output)) {
                return renderOutput(output);
              }

              return (
                <div
                  className={classes.outputGroupContainer}
                  key={`group${idx}`}
                >
                  <HvTypography component="div" variant="label">
                    {output.label}
                  </HvTypography>
                  {(output as HvFlowNodeOutputGroup).outputs.map((out) => {
                    return renderOutput(out);
                  })}
                </div>
              );
            })}
          </div>
        </>
      )}
      {footer && <div className={classes.footerContainer}>{footer}</div>}
    </div>
  );
};
