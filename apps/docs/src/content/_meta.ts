import { MetaRecord } from "nextra";

export default {
  index: {
    type: "page",
    display: "hidden",
    theme: {
      layout: "full",
      timestamp: false,
    },
  },
  docs: {
    type: "page",
    title: "Docs",
  },
  components: {
    type: "page",
    title: "Components",
    theme: { layout: "full", toc: false },
  },
  charts: {
    type: "page",
    title: "Charts",
    theme: { layout: "full", toc: false },
  },
  "app-shell": {
    type: "page",
    title: "App Shell",
  },
  examples: {
    type: "page",
    title: "Examples",
    theme: {
      layout: "full",
      toc: false,
      breadcrumb: false,
      sidebar: false,
      timestamp: false,
    },
  },
  editor: {
    type: "page",
    title: "Theme Editor",
    theme: {
      layout: "full",
      toc: false,
      breadcrumb: false,
      sidebar: false,
      timestamp: false,
    },
  },
} satisfies MetaRecord;
