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
    gap: theme.space.sm,
    "&>span": {
      width: "100px",
      padding: theme.space.xs,
      textAlign: "center",
      borderRadius: theme.radii.round,
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
    pageSizeOptions: [2, 4, 6, 12, 24, 48, 2000],
  },
  argTypes: {
    classes: { control: { disable: true } },
  },
  render: (args) => {
    const data = [...Array(256).keys()];

    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(args.pageSizeOptions?.[2] || 6);

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
          onPageChange={setPage}
          onPageSizeChange={setPageSize}
          labels={{ pageSizeEntryName: `of ${data.length}` }}
          {...args}
        />
      </div>
    );
  },
};
