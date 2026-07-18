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
import { Suspense } from "react";
import { render } from "@testing-library/react";

import IconUiKit from "./IconUiKit";

describe("<IconUiKit /> renders properly", () => {
  it("should have an `IconUiKit` component", () => {
    const { container } = render(
      <Suspense fallback={<div>loading</div>}>
        <IconUiKit name="Open" />
      </Suspense>,
    );

    expect(container.querySelector("[data-name=Open] svg")).toBeInTheDocument();
  });
});
