import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  HvDotPagination,
  HvTypography,
  type HvDotPaginationProps,
} from "@pentaho/uikit-react-core";

const meta: Meta<typeof HvDotPagination> = {
  title: "Components/Dot Pagination",
  component: HvDotPagination,
};

export default meta;

const styles = {
  page: "text-center",
};

export const Main: StoryObj<HvDotPaginationProps> = {
  argTypes: {
    classes: { control: { disable: true } },
    unselectedIcon: { control: { disable: true } },
    selectedIcon: { control: { disable: true } },
  },
  render: () => {
    const [page, setPage] = useState<number>(0);
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
};
