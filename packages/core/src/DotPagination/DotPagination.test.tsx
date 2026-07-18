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
import { useState } from "react";
import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { HvDotPagination } from "./DotPagination";

const Pagination = ({ page }: { page: number }) => (
  <HvDotPagination
    page={page}
    pages={3}
    getItemAriaLabel={(pageNumber) => {
      switch (pageNumber) {
        case 0:
          return "first page button aria-label";
        case 2:
          return "last page button aria-label";
        default:
          return `${pageNumber + 1} page aria-label`;
      }
    }}
    role="navigation"
  />
);

const PaginationWithState = () => {
  const [page, setPage] = useState<number>(0);
  const pages = ["Page 1", "Page 2", "Page 3", "Page 4", "Page 5"];

  return (
    <div>
      <div>
        <span>{pages[page]}</span>
      </div>
      <br />
      <HvDotPagination
        page={page}
        pages={pages.length}
        onPageChange={(_, value) => setPage(value)}
        getItemAriaLabel={(pageNumber) => {
          switch (pageNumber) {
            case 0:
              return "first page button aria-label";
            case 4:
              return "last page button aria-label";
            default:
              return `${pageNumber + 1} page aria-label`;
          }
        }}
        role="navigation"
        aria-label="Example Dot Navigation"
      />
    </div>
  );
};

describe("DotPagination", () => {
  it("should have dot navigation on the first page", async () => {
    const { getByLabelText, findByRole } = render(<Pagination page={0} />);

    const dotPagination = await findByRole("navigation");

    expect(dotPagination).toBeInTheDocument();

    // Check if all buttons are present, have the right aria label and get their reference
    const radioButton1 = getByLabelText("first page button aria-label");
    const radioButton2 = getByLabelText("2 page aria-label");
    const radioButton3 = getByLabelText("last page button aria-label");

    expect(radioButton1).toBeInTheDocument();
    expect(radioButton2).toBeInTheDocument();
    expect(radioButton3).toBeInTheDocument();

    expect(radioButton1).toBeChecked();
    expect(radioButton2).not.toBeChecked();
    expect(radioButton3).not.toBeChecked();
  });

  it("should have dot navigation on the second page", async () => {
    const { getByLabelText, findByRole } = render(<Pagination page={1} />);

    const dotPagination = await findByRole("navigation");

    expect(dotPagination).toBeInTheDocument();

    // Check if all buttons are present, have the right aria label and get their reference
    const radioButton1 = getByLabelText("first page button aria-label");
    const radioButton2 = getByLabelText("2 page aria-label");
    const radioButton3 = getByLabelText("last page button aria-label");

    expect(radioButton1).toBeInTheDocument();
    expect(radioButton2).toBeInTheDocument();
    expect(radioButton3).toBeInTheDocument();

    expect(radioButton1).not.toBeChecked();
    expect(radioButton2).toBeChecked();
    expect(radioButton3).not.toBeChecked();
  });

  it("should have dot navigation on the last page", async () => {
    const { getByLabelText, findByRole } = render(<Pagination page={2} />);

    const dotPagination = await findByRole("navigation");

    expect(dotPagination).toBeInTheDocument();

    // Check if all buttons are present, have the right aria label and get their reference
    const radioButton1 = getByLabelText("first page button aria-label");
    const radioButton2 = getByLabelText("2 page aria-label");
    const radioButton3 = getByLabelText("last page button aria-label");

    expect(radioButton1).toBeInTheDocument();
    expect(radioButton2).toBeInTheDocument();
    expect(radioButton3).toBeInTheDocument();

    expect(radioButton1).not.toBeChecked();
    expect(radioButton2).not.toBeChecked();
    expect(radioButton3).toBeChecked();
  });

  it("should have dot navigation on all pages", async () => {
    const { getByLabelText, findByRole, findByText } = render(
      <PaginationWithState />,
    );

    const dotPagination = await findByRole("navigation");

    expect(dotPagination).toBeInTheDocument();

    // Check if all buttons are present, have the right aria label and get their reference
    const radioButton1 = getByLabelText("first page button aria-label");
    const radioButton2 = getByLabelText("2 page aria-label");
    const radioButton3 = getByLabelText("3 page aria-label");
    const radioButton4 = getByLabelText("4 page aria-label");
    const radioButton5 = getByLabelText("last page button aria-label");

    expect(radioButton1).toBeInTheDocument();
    expect(radioButton2).toBeInTheDocument();
    expect(radioButton3).toBeInTheDocument();
    expect(radioButton4).toBeInTheDocument();
    expect(radioButton5).toBeInTheDocument();

    await userEvent.click(radioButton1);
    await findByText("Page 1");

    expect(radioButton1).toBeChecked();
    expect(radioButton2).not.toBeChecked();
    expect(radioButton3).not.toBeChecked();
    expect(radioButton4).not.toBeChecked();
    expect(radioButton5).not.toBeChecked();

    await userEvent.click(radioButton2);
    await findByText("Page 2");

    expect(radioButton1).not.toBeChecked();
    expect(radioButton2).toBeChecked();
    expect(radioButton3).not.toBeChecked();
    expect(radioButton4).not.toBeChecked();
    expect(radioButton5).not.toBeChecked();

    await userEvent.click(radioButton3);
    await findByText("Page 3");

    expect(radioButton1).not.toBeChecked();
    expect(radioButton2).not.toBeChecked();
    expect(radioButton3).toBeChecked();
    expect(radioButton4).not.toBeChecked();
    expect(radioButton5).not.toBeChecked();

    await userEvent.click(radioButton4);
    await findByText("Page 4");

    expect(radioButton1).not.toBeChecked();
    expect(radioButton2).not.toBeChecked();
    expect(radioButton3).not.toBeChecked();
    expect(radioButton4).toBeChecked();
    expect(radioButton5).not.toBeChecked();

    await userEvent.click(radioButton5);
    await findByText("Page 5");

    expect(radioButton1).not.toBeChecked();
    expect(radioButton2).not.toBeChecked();
    expect(radioButton3).not.toBeChecked();
    expect(radioButton4).not.toBeChecked();
    expect(radioButton5).toBeChecked();
  });
});
