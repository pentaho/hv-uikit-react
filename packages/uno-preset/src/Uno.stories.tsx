import { setupChromatic } from "@hitachivantara/internal";
import { HvTypography } from "@hitachivantara/uikit-react-core";

import preview from "../../../.storybook/preview";

const meta = preview.meta({
  title: "Tests/Uno",
});

export const Test = meta.story({
  parameters: {
    ...setupChromatic(["DS5 dawn", "DS5 wicked", "Pentaho wicked"]),
    docs: { disable: true },
  },
  render: () => (
    <>
      <HvTypography variant="title4">Z-Index & Colors</HvTypography>
      <section className="flex bg-default [&>div]:-mr-2">
        <div className="size-12 bg-positive z-modal" />
        <div className="size-11 bg-warning z-docked" />
        <div className="size-10 bg-warningDeep z-8" />
        <div className="size-9 bg-textDark" />
        <div className="size-8 bg-negative -z-1" />
      </section>
      <br />
      <HvTypography variant="title4">Radius & Spacing</HvTypography>
      <section className="flex gap-xs">
        {[
          "rounded-none m-1",
          "rounded-round m-xxs",
          "rounded-large my-sm",
          "rounded mr-md",
          "rounded-2",
          "rounded-full",
        ].map((classes) => (
          <div key={classes} className="bg-text p-xs">
            <div className={`size-64px bg-primary ${classes}`} />
          </div>
        ))}
      </section>
      <br />
      <HvTypography variant="title4">Text & icons</HvTypography>
      <section>
        <div className="flex gap-xxs items-center text-warning">
          <div className="i-ph-database" />
          <span>Text goes here</span>
        </div>
      </section>
    </>
  ),
});
