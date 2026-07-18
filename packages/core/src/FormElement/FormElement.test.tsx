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
import { render, screen } from "@testing-library/react";

import { HvFormElement } from "./FormElement";
import { HvLabel } from "./Label";
import { HvWarningText } from "./WarningText";

describe("FormElement", () => {
  it("renders the required character", () => {
    render(
      <HvFormElement required>
        <HvLabel htmlFor="input" label="MY_LABEL" />
      </HvFormElement>,
    );

    expect(screen.getByText("MY_LABEL")).toBeInTheDocument();
    expect(screen.getByText(/\*/)).toBeInTheDocument();
  });

  it("renders the error message when status is invalid", () => {
    render(
      <HvFormElement status="invalid">
        <HvWarningText>MY_ERROR_MESSAGE</HvWarningText>
      </HvFormElement>,
    );

    expect(screen.getByText("MY_ERROR_MESSAGE")).toBeInTheDocument();
  });
});
