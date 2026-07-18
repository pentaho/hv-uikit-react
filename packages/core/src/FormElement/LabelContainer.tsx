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
  createClasses,
  useDefaultProps,
  type ExtractNames,
} from "@hitachivantara/uikit-react-utils";
import { theme } from "@hitachivantara/uikit-styles";

import { HvInfoMessage } from "./InfoMessage/InfoMessage";
import { HvLabel } from "./Label/Label";

const { useClasses } = createClasses("HvLabelContainer", {
  root: {
    display: "flex",
    alignItems: "center",
    gap: theme.space.xs,
    height: 24,
    marginBottom: theme.space.xxs,
  },
  label: {},
  description: {},
});

export interface HvLabelContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  classes?: ExtractNames<typeof useClasses>;
  label?: React.ReactNode;
  description?: React.ReactNode;
  inputId?: string;
  labelId?: string;
  descriptionId?: string;
  labelProps?: React.ComponentProps<typeof HvLabel>;
  descriptionProps?: React.ComponentProps<typeof HvInfoMessage>;
}

/**
 * A container for the label and description combo of form elements.
 * @internal @private
 */
export const HvLabelContainer = (props: HvLabelContainerProps) => {
  const {
    label,
    description,
    inputId,
    labelId,
    descriptionId,
    classes: classesProp,
    labelProps,
    descriptionProps,
    children,
    ...others
  } = useDefaultProps("HvLabelContainer", props);
  const { classes } = useClasses(classesProp, false);

  if (label == null && description == null && children == null) return null;

  return (
    <div className={classes.root} {...others}>
      {label != null && (
        <HvLabel
          id={labelId}
          className={classes.label}
          htmlFor={inputId}
          label={label}
          {...labelProps}
        />
      )}
      {description != null && (
        <HvInfoMessage
          disableGutter
          id={descriptionId}
          className={classes.description}
          {...descriptionProps}
        >
          {description}
        </HvInfoMessage>
      )}
      {children}
    </div>
  );
};
