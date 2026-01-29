import { clsx } from "clsx";
import Link from "next/link";
import {
  HvIconContainer,
  HvTypography,
} from "@hitachivantara/uikit-react-core";

import canvas from "./canvas/page.mdx?raw";
import cards from "./cards/page.mdx?raw";
import charts from "./charts/page.mdx?raw";
import dialogs from "./dialogs/page.mdx?raw";
import dnd from "./dnd/page.mdx?raw";
import inputs from "./inputs/page.mdx?raw";
import kpis from "./kpis/page.mdx?raw";
import login from "./login/page.mdx?raw";
import menus from "./menus/page.mdx?raw";
import notifications from "./notifications/page.mdx?raw";
import switches from "./switches/page.mdx?raw";
import tables from "./tables/page.mdx?raw";
import tabs from "./tabs/page.mdx?raw";
import tags from "./tags/page.mdx?raw";

/**
 * Extracts the number of CodeBlock components in the given file content.
 */
const countCodeBlocks = (fileContent: string): number => {
  const codeBlockRegex = /(<CodeBlock|CodeBlock,)/g;
  const matches = fileContent?.match?.(codeBlockRegex);
  return matches ? matches.length : 0;
};

const sections = [
  { slug: "canvas", title: "Canvas", total: countCodeBlocks(canvas) },
  { slug: "cards", title: "Cards", total: countCodeBlocks(cards) },
  { slug: "charts", title: "Charts", total: countCodeBlocks(charts) },
  { slug: "dialogs", title: "Dialogs", total: countCodeBlocks(dialogs) },
  { slug: "dnd", title: "Drag and Drop", total: countCodeBlocks(dnd) },
  { slug: "inputs", title: "Inputs", total: countCodeBlocks(inputs) },
  { slug: "kpis", title: "KPIs", total: countCodeBlocks(kpis) },
  { slug: "login", title: "Login", total: countCodeBlocks(login) },
  { slug: "menus", title: "Menus", total: countCodeBlocks(menus) },
  {
    slug: "notifications",
    title: "Notifications",
    total: countCodeBlocks(notifications),
  },
  { slug: "switches", title: "Switches", total: countCodeBlocks(switches) },
  { slug: "tables", title: "Tables", total: countCodeBlocks(tables) },
  { slug: "tabs", title: "Tabs", total: countCodeBlocks(tabs) },
  { slug: "tags", title: "Tags", total: countCodeBlocks(tags) },
] as const;

type Slug = (typeof sections)[number]["slug"];

const getSectionIcon = (title: Slug) => {
  switch (title) {
    case "tables":
      return <div className="i-ph-table" />;
    case "charts":
      return <div className="i-ph-chart-bar" />;
    case "inputs":
      return <div className="i-ph-text-a-underline" />;
    case "kpis":
      return <div className="i-ph-speedometer" />;
    case "dnd":
      return <div className="i-ph-hand-swipe-right" />;
    case "canvas":
      return <div className="i-ph-flow-arrow" />;
    case "login":
      return <div className="i-ph-lock-open" />;
    case "menus":
      return <div className="i-ph-list" />;
    case "switches":
      return <div className="i-ph-toggle-left" />;
    case "tags":
      return <div className="i-ph-tag-simple" />;
    case "cards":
      return <div className="i-ph-squares-four" />;
    case "dialogs":
      return <div className="i-ph-browser" />;
    case "tabs":
      return <div className="i-ph-tabs" />;
    case "notifications":
      return <div className="i-ph-bell-ringing" />;
    default:
      return null;
  }
};

/**
 * The `Examples` component displays a collection of categorized sections
 * with details about the number of components in each category.
 */
export default function ExamplesPage() {
  return (
    <div className="max-w-6xl mx-auto px-sm md:px-md py-lg md:py-xl">
      {/* Page Header */}
      <div className="mb-lg md:mb-xl md:text-center">
        <HvTypography
          variant="title1"
          className={clsx(
            "text-[2.1em] leading-[1.3em] mb-md",
            "max-sm:text-[1.5rem] max-sm:leading-[2.2rem] max-sm:mb-sm",
          )}
        >
          Building blocks to streamline <br />
          your development workflow.
        </HvTypography>
        <HvTypography className="text-md max-w-3xl mx-auto">
          Find more on our{" "}
          <HvTypography
            variant="captionLabel"
            className="color-primary hover:underline"
            component="a"
            href="https://stackblitz.com/orgs/github/lumada-design/collections"
            target="_blank"
            rel="noopener noreferrer"
          >
            StackBlitz collection
          </HvTypography>
        </HvTypography>
      </div>

      {/* Section Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-sm">
        {sections.map((section) => (
          <Link
            key={section.slug}
            href={`/examples/${section.slug}`}
            className="hover:bg-bgContainer rounded-round p-xs text-center"
          >
            {/* Placeholder for section preview */}
            <div
              className={clsx(
                "h-160px bg-bgContainer border border-borderSubtle",
                "rounded-round mb-xs flex items-center justify-center",
              )}
            >
              <HvIconContainer color="textSubtle" size="xl">
                {getSectionIcon(section.slug)}
              </HvIconContainer>
            </div>
            {/* Section Title */}
            <HvTypography variant="label" className="font-semibold">
              {section.title}
            </HvTypography>
            {/* Component Count */}
            <HvTypography variant="caption1">
              {section.total} examples
            </HvTypography>
          </Link>
        ))}
      </div>
    </div>
  );
}
