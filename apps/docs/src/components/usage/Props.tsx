import { Fragment, useState } from "react";
import type { PropItem } from "react-docgen-typescript";
import { clsx } from "clsx";
import Link from "next/link";
import {
  HvEmptyState,
  HvInput,
  HvTable,
  HvTableBody,
  HvTableCell,
  HvTableContainer,
  HvTableHead,
  HvTableHeader,
  HvTableRow,
  HvTypography,
  type HvTableColumnConfig,
} from "@hitachivantara/uikit-react-core";
import { Ban } from "@hitachivantara/uikit-react-icons";

import { ComponentMeta } from "../../utils/component";

type PropsTableProps = {
  title: string;
  propsObj: Record<string, PropItem>;
};

const classes = {
  row: "border-b !bg-transparent",
  linkHash: "after:content-['_#'] after:opacity-0 hover:after:opacity-40",
};

// Utility function to reorder props by required status and alphabetical order
const reorderProps = (props: Record<string, PropItem>) =>
  Object.fromEntries(
    Object.entries(props).toSorted(([keyA, a], [keyB, b]) => {
      const aDeprecated =
        a.description?.toLowerCase().includes("deprecated") ?? false;
      const bDeprecated =
        b.description?.toLowerCase().includes("deprecated") ?? false;

      if (aDeprecated !== bDeprecated) {
        return aDeprecated ? 1 : -1;
      }

      if (a.required !== b.required) {
        return a.required ? -1 : 1;
      }

      return keyA.localeCompare(keyB);
    }),
  );

const columns: HvTableColumnConfig<PropItem, string>[] = [
  { Header: "Name", accessor: "name" },
  { Header: "Type", accessor: "type" },
  { Header: "Description", accessor: "description" },
];

const EmptyStateRow = () => (
  <HvTableRow className={classes.row}>
    <HvTableCell colSpan={3} style={{ height: 64 }}>
      <HvEmptyState message="No data to display." icon={<Ban />} />
    </HvTableCell>
  </HvTableRow>
);

const makeLink = (...args: string[]) =>
  args.map((s) => s.toLowerCase().replace(/\s/g, "-")).join("-");

const PropsTable = ({ title, propsObj }: PropsTableProps) => {
  return (
    <HvTable>
      <HvTableHead>
        <HvTableRow className={classes.row}>
          {columns.map((col, i) => (
            <HvTableHeader
              key={col.Header}
              className={`!bg-transparent ${i === 0 ? "!pl-xs" : ""}`}
            >
              {col.Header}
            </HvTableHeader>
          ))}
        </HvTableRow>
      </HvTableHead>
      <HvTableBody>
        {Object.keys(propsObj).length === 0 ? (
          <EmptyStateRow />
        ) : (
          Object.entries(propsObj).map(([key, propItem]) => (
            <HvTableRow
              key={key}
              id={makeLink(title, propItem.name)}
              className={classes.row}
            >
              <HvTableCell className="!pl-xs w-[25%]">
                <a
                  href={`#${makeLink(title, propItem.name)}`}
                  className={classes.linkHash}
                >
                  <code>
                    {propItem.description.includes("deprecated") ? (
                      <s>{key}</s>
                    ) : (
                      key
                    )}
                  </code>
                  {propItem.required && (
                    <code className="text-negative">*</code>
                  )}
                </a>
              </HvTableCell>
              <HvTableCell className="w-[30%]">
                {propItem.name === "classes" ? (
                  <HvTypography link component={Link} href="?tab=classes">
                    see classes docs
                  </HvTypography>
                ) : (
                  <pre className="whitespace-pre-wrap break-words !text-[12px] text-primaryStrong">
                    {propItem.type?.name}
                  </pre>
                )}
              </HvTableCell>
              <HvTableCell>
                {propItem.description?.split(/(`[^`]+`)/g).map((part) =>
                  part.startsWith("`") && part.endsWith("`") ? (
                    <code className="nextra-code">{part.slice(1, -1)}</code>
                  ) : (
                    part.split("@deprecated").map((part, index) => (
                      <Fragment>
                        {index > 0 && <br />}
                        {index === 0 ? part : `@deprecated${part}`}
                      </Fragment>
                    ))
                  ),
                )}
              </HvTableCell>
            </HvTableRow>
          ))
        )}
      </HvTableBody>
    </HvTable>
  );
};

const PropsTableContainer = ({ title, propsObj }: PropsTableProps) => {
  const id = makeLink(title);
  return (
    <div className="grid" id={id}>
      <HvTypography
        variant="title3"
        className={clsx("mt-md mb-md", classes.linkHash)}
        component="a"
        href={`#${id}`}
      >
        <code className="nextra-code">{title}</code> props
      </HvTypography>
      <HvTableContainer>
        <PropsTable title={title} propsObj={propsObj} />
      </HvTableContainer>
    </div>
  );
};

// Main Props Component
export const Props = ({ meta }: { meta: ComponentMeta }) => {
  const { docgen, subComponentsDocgen = {} } = meta;
  const [searchTerm, setSearchTerm] = useState("");

  // Process main component props
  const orderedMainProps = reorderProps(docgen?.props || {});

  // Process sub-component props
  const orderedSubComponents = Object.fromEntries(
    Object.entries(subComponentsDocgen).map(
      ([subComponent, subComponentDocgen]) => [
        subComponent,
        reorderProps(
          (subComponentDocgen as { props: Record<string, PropItem> }).props,
        ),
      ],
    ),
  );

  // Filter props by search term
  const filterProps = (props: Record<string, PropItem>, search: string) =>
    Object.fromEntries(
      Object.entries(props).filter(([key]) =>
        key.toLowerCase().includes(search.toLowerCase()),
      ),
    );

  const filteredMainProps = filterProps(orderedMainProps, searchTerm);
  const filteredSubComponents = Object.fromEntries(
    Object.entries(orderedSubComponents).map(([subComponent, props]) => [
      subComponent,
      filterProps(props, searchTerm),
    ]),
  );

  return (
    <div className="grid">
      <HvInput
        type="search"
        placeholder="Search prop"
        onChange={(_, value) => setSearchTerm(value)}
      />
      <PropsTableContainer
        title={meta.docgen.displayName || meta.component}
        propsObj={filteredMainProps}
      />
      {Object.entries(filteredSubComponents).map(([subComponent, props]) => (
        <PropsTableContainer
          key={subComponent}
          title={
            (subComponentsDocgen[subComponent] as React.FC)?.displayName ||
            subComponent
          }
          propsObj={props}
        />
      ))}
    </div>
  );
};
