import { render, screen, within } from "@testing-library/react";

import {
  HvTable,
  HvTableBody,
  HvTableCell,
  HvTableContainer,
  HvTableHead,
  HvTableHeader,
  HvTableRow,
} from ".";

describe("Table", () => {
  it("renders the correct elements and roles", () => {
    const NUM_ROWS = 6;
    const NUM_COLS = 3;
    render(
      <HvTableContainer>
        <HvTable>
          <HvTableHead>
            <HvTableRow>
              {[...Array(NUM_COLS).keys()].map((id) => (
                <HvTableHeader key={id}>{`Sample Header ${id}`}</HvTableHeader>
              ))}
            </HvTableRow>
          </HvTableHead>
          <HvTableBody>
            {[...Array(NUM_ROWS).keys()].map((id) => (
              <HvTableRow key={id}>
                {[...Array(NUM_COLS).keys()].map((id2) => (
                  <HvTableCell key={id2}>{`Sample Cell ${id2}`}</HvTableCell>
                ))}
              </HvTableRow>
            ))}
          </HvTableBody>
        </HvTable>
      </HvTableContainer>,
    );

    expect(screen.getByRole("table")).toBeInTheDocument();

    const rowGroups = screen.getAllByRole("rowgroup");
    expect(rowGroups.length).toBe(2); // thead & tbody

    const headerRows = within(rowGroups[0]).getAllByRole("row");
    expect(headerRows.length).toBe(1);

    const headerCells = within(headerRows[0]).getAllByRole("columnheader");
    expect(headerCells.length).toBe(NUM_COLS);

    const bodyRows = within(rowGroups[1]).getAllByRole("row");
    expect(bodyRows.length).toBe(NUM_ROWS);

    const bodyCells = within(bodyRows[0]).getAllByRole("cell");
    expect(bodyCells.length).toBe(NUM_COLS);

    expect(screen.getAllByRole("cell").length).toBe(NUM_COLS * NUM_ROWS);
  });
});

describe("Table ListRow", () => {
  const NUM_ROWS = 6;
  const NUM_COLS = 3;

  const ListRow = () => (
    <HvTableContainer>
      <HvTable variant="listrow">
        <HvTableHead>
          <HvTableRow>
            {[...Array(NUM_COLS).keys()].map((id) => (
              <HvTableHeader key={id}>{`Sample Header ${id}`}</HvTableHeader>
            ))}
          </HvTableRow>
        </HvTableHead>
        <HvTableBody withNavigation>
          {[...Array(NUM_ROWS).keys()].map((id) => (
            <HvTableRow key={id}>
              {[...Array(NUM_COLS).keys()].map((id2) => (
                <HvTableCell key={id2}>{`Sample Cell ${id2}`}</HvTableCell>
              ))}
            </HvTableRow>
          ))}
        </HvTableBody>
      </HvTable>
    </HvTableContainer>
  );

  it("renders the rows and cells", () => {
    render(<ListRow />);

    expect(screen.getAllByRole("rowgroup").length).toBe(2); // thead & tbody
    expect(screen.getAllByRole("row").length).toBe(NUM_ROWS + 1);
    expect(screen.getAllByRole("columnheader").length).toBe(NUM_COLS);
    expect(screen.getAllByRole("cell").length).toBe(NUM_COLS * NUM_ROWS);
  });

  it("renders the list row variant", () => {
    render(<ListRow />);
    const rows = screen.getAllByRole("row");
    rows.forEach((element, index) => {
      expect(element.className).toMatch(
        index !== 0 ? /HvTableRow-variantList/ : /HvTableRow-variantListHead/,
      );
    });
  });
});

describe("Header Only Table", () => {
  it("renders single row and its cells", () => {
    const NUM_COLS = 6;

    render(
      <HvTableContainer>
        <HvTable>
          <HvTableHead>
            <HvTableRow>
              {[...Array(NUM_COLS).keys()].map((id) => (
                <HvTableHeader key={id}>{`Header ${id}`}</HvTableHeader>
              ))}
            </HvTableRow>
          </HvTableHead>
          <HvTableBody>{null}</HvTableBody>
        </HvTable>
      </HvTableContainer>,
    );

    expect(screen.getAllByRole("row").length).toBe(1);
    expect(screen.getAllByRole("columnheader").length).toBe(NUM_COLS);
  });
});
