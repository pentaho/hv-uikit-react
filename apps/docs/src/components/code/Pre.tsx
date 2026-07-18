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
import { isValidElement } from "react";
import { Pre as NextraPre } from "nextra/components";

import { CodeBlock } from "./CodeBlock";

interface PreProps extends React.ComponentProps<"pre"> {
  live?: boolean;
}

export const Pre = ({ live, children, ...props }: PreProps) => {
  if (live && isValidElement(children)) {
    const code = children.props.children || "";
    return <CodeBlock code={code} layout="expandable" />;
  }

  return <NextraPre {...props}>{children}</NextraPre>;
};
