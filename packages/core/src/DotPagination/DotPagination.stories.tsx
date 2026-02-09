import { useState } from "react";
import {
  HvDotPagination,
  HvTypography,
} from "@hitachivantara/uikit-react-core";
import {
  CurrentStep,
  RadioButtonUnselected,
} from "@hitachivantara/uikit-react-icons";

import preview from "../../../../.storybook/preview";

const meta = preview.meta({
  title: "Components/Dot Pagination",
  component: HvDotPagination,
});

const styles = {
  page: "text-center",
};

export const Main = meta.story({
  argTypes: {
    classes: { control: { disable: true } },
    unselectedIcon: { control: { disable: true } },
    selectedIcon: { control: { disable: true } },
  },
  render: () => {
    const [page, setPage] = useState(0);
    const pages = [
      "This is page 1",
      "And this is page 2",
      "This is page 3",
      "This is page 4",
      "And finally, this is page 5",
    ];

    return (
      <div>
        <HvTypography className={styles.page}>{pages[page]}</HvTypography>
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
  },
});

export const CustomizedDotPagination = meta.story({
  parameters: {
    docs: {
      description: {
        story:
          "The `DotPagination` component was customized to be similar to the NEXT Design System 3 specifications. " +
          "Thus, the styling was overridden and the `unselectedIcon` and `selectedIcon` properties were provided.",
      },
    },
  },
  render: () => {
    const [page, setPage] = useState(0);
    const pages = [
      "This is page 1",
      "And this is page 2",
      "Now you can see page 3",
      "Look, it's page 4",
      "And finally, this is page 5",
    ];

    return (
      <div>
        <HvTypography className={styles.page}>{pages[page]}</HvTypography>
        <br />
        <HvDotPagination
          classes={{
            radio: "ml-0 size-32px hover:bg-bgPageSecondary hover:rounded-0",
          }}
          unselectedIcon={<RadioButtonUnselected size="XS" />}
          selectedIcon={<CurrentStep size="XS" />}
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
  },
});
