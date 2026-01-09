import { useState } from "react";
import { css } from "@emotion/css";
import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  HvPagination,
  HvPaginationProps,
  theme,
} from "@hitachivantara/uikit-react-core";

const classes = {
  root: css({
    display: "flex",
    flexWrap: "wrap",
    "&>span": {
      width: "100px",
      padding: "8px 12px",
      margin: "12px",
      textAlign: "center",
      borderRadius: "4px",
      background: theme.colors.bgContainer,
    },
  }),
};

const meta: Meta<typeof HvPagination> = {
  title: "Components/Pagination",
  component: HvPagination,
};
export default meta;

export const Main: StoryObj<HvPaginationProps> = {
  args: {
    showPageSizeOptions: true,
    showPageJump: true,
  },
  argTypes: {
    classes: { control: { disable: true } },
  },
  render: (args) => {
    const pageSizeOptions = [4, 6, 12, 24, 48, 2000];
    const data = [...Array(64).keys()];

    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(pageSizeOptions[2]);

    const numPages = Math.ceil(data.length / pageSize);

    return (
      <div>
        <div className={classes.root}>
          {data.slice(pageSize * page, pageSize * (page + 1)).map((i) => (
            <span key={i}>{`Item ${i + 1}`}</span>
          ))}
        </div>
        <HvPagination
          pages={numPages}
          page={page}
          canPrevious={page > 0}
          canNext={page < numPages - 1}
          pageSize={pageSize}
          pageSizeOptions={pageSizeOptions}
          onPageChange={setPage}
          onPageSizeChange={setPageSize}
          labels={{ pageSizeEntryName: "items" }}
          {...args}
        />
      </div>
    );
  },
};
