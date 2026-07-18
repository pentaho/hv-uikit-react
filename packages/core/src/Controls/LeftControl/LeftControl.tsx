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
import { useContext } from "react";
import type { ExtractNames } from "@hitachivantara/uikit-react-utils";

import { HvInput, type HvInputProps } from "../../Input";
import type { HvBaseProps } from "../../types/generic";
import { HvControlsContext } from "../context/ControlsContext";
import { staticClasses, useClasses } from "./LeftControl.styles";

export { staticClasses as leftControlClasses };

export type HvLeftControlClasses = ExtractNames<typeof useClasses>;

export interface HvLeftControlProps extends HvBaseProps {
  /** if `true` the hide sort by dropdown is not rendered */
  hideSearch?: boolean;
  /** placeholder of the input */
  placeholder?: string;
  /** Callback called when a search action occurs */
  onSearch?: (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    value: string,
  ) => void;
  /** Extra props passed to input */
  searchProps?: HvInputProps;
  /** A Jss Object used to override or extend the styles applied to the component. */
  classes?: HvLeftControlClasses;
}

export const HvLeftControl = ({
  id,
  classes: classesProp,
  className,
  children,
  placeholder = "Search",
  onSearch,
  hideSearch = false,
  searchProps,
  ...others
}: HvLeftControlProps) => {
  const { classes, cx } = useClasses(classesProp);

  const { onSearch: onSearchHandler } = useContext(HvControlsContext);

  const onChangeFilter: HvInputProps["onChange"] = (e, value) => {
    onSearch?.(e, value);
    onSearchHandler?.(value);
  };

  return (
    <div id={id} className={cx(classes.root, className)} {...others}>
      {!hideSearch && (
        <HvInput
          type="search"
          placeholder={placeholder}
          onChange={onChangeFilter}
          {...searchProps}
        />
      )}
      {children}
    </div>
  );
};
