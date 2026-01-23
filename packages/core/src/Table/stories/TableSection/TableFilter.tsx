import { useMemo, useRef, useState } from "react";
import { css, keyframes } from "@emotion/css";
import {
  baseDropdownClasses,
  HvButton,
  HvCheckBox,
  HvFilterGroup,
  HvFilterGroupProps,
  HvFilterGroupValue,
  HvInput,
  HvPagination,
  HvTable,
  HvTableBody,
  HvTableCell,
  HvTableColumnConfig,
  HvTableContainer,
  HvTableHead,
  HvTableHeader,
  HvTableRow,
  HvTableSection,
  HvTypography,
  theme,
  useHvFilters,
  useHvGlobalFilter,
  useHvPagination,
  useHvTable,
} from "@hitachivantara/uikit-react-core";
import { Add, Close, Filters } from "@hitachivantara/uikit-react-icons";

import { AssetEvent, getColumns, makeData } from "../storiesUtils";

const EmptyRow = () => (
  <HvTableRow>
    <HvTableCell colSpan={100} />
  </HvTableRow>
);

const slide = keyframes({
  "0%": { maxHeight: 0 },
  "100%": { maxHeight: 300 },
});

const classes = {
  filtersContainer: css({
    display: "flex",
    width: "100%",
    backgroundColor: theme.colors.warningDimmed,
    border: `1px solid ${theme.colors.bgPageSecondary}`,
    overflow: "hidden",
    animation: `${slide} 1.5s ease-in-out`,
  }),
  filters: css({
    display: "flex",
    width: "100%",
    padding: theme.space.xs,
    justifyContent: "space-between",
    alignItems: "center",
  }),
  gemsContainer: css({
    display: "flex",
    width: "100%",
    justifyContent: "flex-start",
    padding: `0px ${theme.space.xs}`,
    flexWrap: "wrap",
    gap: theme.space.xs,
  }),
  filterHeader: css({
    borderColor: "transparent",
    "&:hover": {
      borderColor: "transparent",
      backgroundColor: theme.colors.bgHover,
    },
    "&:focus-visible": {
      borderColor: "transparent",
    },
    [`&.${baseDropdownClasses.headerOpen}`]: {
      borderColor: theme.colors.text,
      "&:hover": {
        borderColor: theme.colors.text,
      },
    },
  }),
};

const data = makeData(50);

const filters: HvFilterGroupProps["filters"] = [
  {
    id: "status",
    name: "Status",
    data: [
      { id: "closed", name: "Closed" },
      { id: "open", name: "Open" },
    ],
  },
  {
    id: "severity",
    name: "Severity",
    data: [
      {
        id: "critical",
        name: "Critical",
      },
      { id: "major", name: "Major" },
      { id: "average", name: "Average" },
      { id: "minor", name: "Minor" },
    ],
  },
  {
    id: "priority",
    name: "Priority",
    data: [
      {
        id: "high",
        name: "High",
      },
      { id: "medium", name: "Medium" },
      { id: "low", name: "Low" },
    ],
  },
];

export const TableFilter = () => {
  const filterRef = useRef<HTMLDivElement>(null);

  const [selectedFilters, setSelectedFilters] = useState<HvFilterGroupValue>();
  const [checked, setChecked] = useState(true);

  const columns: HvTableColumnConfig<AssetEvent>[] = useMemo(() => {
    const cols = getColumns();

    if (checked) {
      return cols.map((col) => ({
        ...col,
        // Overriding default table filter
        filter: (rows, columnIds, filterValues) => {
          if (
            !Array.isArray(filterValues) ||
            !filterValues ||
            (Array.isArray(filterValues) && filterValues.length === 0)
          ) {
            return rows;
          }

          return rows.filter((row) =>
            filterValues.includes(row.values[columnIds[0]]),
          );
        },
      }));
    }

    return cols;
  }, [checked]);

  const processedFilters = useMemo(
    () =>
      selectedFilters?.flatMap((categoryArray, idx) =>
        categoryArray?.map((value) => ({
          category: {
            label: filters[idx].name,
            id: filters[idx].id,
          },
          value: {
            label: filters[idx].data.find((x) => x.id === value)?.name,
            id: value,
          },
        })),
      ),
    [selectedFilters],
  );

  const table = useHvTable<AssetEvent>(
    { columns, data },
    useHvFilters,
    useHvGlobalFilter,
    useHvPagination,
  );

  const renderTableRow = (i: number) => {
    const row = table.page[i];

    if (!row) return <EmptyRow key={i} />;

    table.prepareRow(row);

    return (
      <HvTableRow {...row.getRowProps()}>
        {row.cells.map((cell) => (
          <HvTableCell {...cell.getCellProps()} key={cell.getCellProps().key}>
            {cell.render("Cell")}
          </HvTableCell>
        ))}
      </HvTableRow>
    );
  };

  const handleFilters = (arrays?: HvFilterGroupValue) => {
    setSelectedFilters(arrays);
    const newFilters =
      arrays?.flatMap((array, idx) => ({
        id: filters[idx].id,
        value: array
          .map((x) => filters[idx].data.find((i) => i.id === x)?.name)
          .filter(Boolean),
      })) || [];
    table.setAllFilters?.(newFilters);
  };

  return (
    <>
      <HvCheckBox
        checked={checked}
        onChange={(event, bool) => setChecked(bool)}
        label="Multiple column filters"
      />
      <br />
      <br />
      <HvTableSection
        raisedHeader
        title={<HvTypography variant="title4">Event Registry</HvTypography>}
        actions={
          <>
            <HvInput
              type="search"
              placeholder="Search all columns"
              onChange={(e, v) => table.setGlobalFilter?.(v)}
            />
            <HvFilterGroup
              ref={filterRef}
              filters={filters}
              disablePortal={false}
              value={selectedFilters}
              onChange={(event, value) => handleFilters(value)}
              aria-label="Filters"
              filterContentProps={{
                adornment: <Filters aria-hidden />,
                placeholder: null,
                classes: {
                  header: classes.filterHeader,
                },
              }}
            />
          </>
        }
      >
        {processedFilters && processedFilters.length > 0 && (
          <div className={classes.filtersContainer}>
            <div className={classes.filters}>
              <HvButton
                variant="primaryGhost"
                startIcon={<Add />}
                onClick={() => filterRef.current?.click()}
              >
                Add Filter
              </HvButton>
              <div className={classes.gemsContainer}>
                {processedFilters.map(({ category, value }) => (
                  <HvButton
                    key={`gem-${category.id}-${value.id}`}
                    startIcon={<Close />}
                    variant="secondarySubtle"
                    onClick={() => {
                      const newFilters = selectedFilters?.map((array, idx) =>
                        idx === filters.findIndex((x) => x.id === category.id)
                          ? array.filter((x) => x !== value.id)
                          : array,
                      );
                      handleFilters(newFilters);
                    }}
                    aria-label={`Clear filter ${category.label}: ${value.label}`}
                  >
                    {category.label}: {value.label}
                  </HvButton>
                ))}
              </div>
              <HvButton
                variant="secondaryGhost"
                onClick={() => handleFilters(undefined)}
              >
                Clear
              </HvButton>
            </div>
          </div>
        )}
        <HvTableContainer>
          <HvTable {...table.getTableProps()}>
            <HvTableHead {...table.getTableHeadProps?.()}>
              {table.headerGroups.map((headerGroup) => (
                <HvTableRow
                  {...headerGroup.getHeaderGroupProps()}
                  key={headerGroup.getHeaderGroupProps().key}
                >
                  {headerGroup.headers.map((col) => (
                    <HvTableHeader
                      {...col.getHeaderProps()}
                      key={col.getHeaderProps().key}
                    >
                      {col.render("Header")}
                    </HvTableHeader>
                  ))}
                </HvTableRow>
              ))}
            </HvTableHead>
            <HvTableBody {...table.getTableBodyProps()}>
              {data.length === 0 ? (
                <EmptyRow />
              ) : (
                [...Array(table.state.pageSize ?? 0).keys()].map(renderTableRow)
              )}
            </HvTableBody>
          </HvTable>
        </HvTableContainer>
        {table.page.length > 0 && (
          <HvPagination
            {...table.getHvPaginationProps?.()}
            labels={{ pageSizeEntryName: `of ${data.length}` }}
          />
        )}
      </HvTableSection>
    </>
  );
};
