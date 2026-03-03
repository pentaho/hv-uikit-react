import { useState } from "react";
import { HvSection, HvTypography } from "@hitachivantara/uikit-react-core";

export default function Demo() {
  // only one section allowed to be expanded at a time, so we need to manage the state of the sections
  const [expandedSection, setExpandedSection] = useState<string | null>(
    "section2",
  );

  return (
    <HvSection classes={{ root: "w-320px", content: "p-0" }}>
      <HvSection
        expandable
        expanded={expandedSection === "section1"}
        onToggle={(event, expanded) => {
          setExpandedSection(expanded ? "section1" : null);
        }}
        title="Section Title"
        classes={{
          root: "border-none rounded-b-none",
          header: "b-b-1 b-b-border",
          content: "p-t-xs bg-bgContainerSecondary b-b-1 b-b-border",
        }}
      >
        <HvTypography>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed tempor
          blandit ipsum quis sollicitudin. Aliquam erat volutpat. Praesent nisi
          nisl, sodales vitae blandit tincidunt, malesuada id sapien.
        </HvTypography>
      </HvSection>
      <HvSection
        expandable
        expanded={expandedSection === "section2"}
        onToggle={(event, expanded) => {
          setExpandedSection(expanded ? "section2" : null);
        }}
        title="Section Title"
        classes={{
          root: "border-none rounded-b-none",
          header: "b-b-1 b-b-border",
          content: "p-t-xs bg-bgContainerSecondary b-b-1 b-b-border",
        }}
      >
        <HvTypography>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed tempor
          blandit ipsum quis sollicitudin. Aliquam erat volutpat. Praesent nisi
          nisl, sodales vitae blandit tincidunt, malesuada id sapien.
        </HvTypography>
      </HvSection>
      <HvSection
        expandable
        expanded={expandedSection === "section3"}
        onToggle={(event, expanded) => {
          setExpandedSection(expanded ? "section3" : null);
        }}
        title="Section Title"
        classes={{
          root: "border-none rounded-b-none",
          header: expandedSection === "section3" ? "b-b-1 b-b-border" : "",
          content: "p-t-xs bg-bgContainerSecondary",
        }}
      >
        <HvTypography>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed tempor
          blandit ipsum quis sollicitudin. Aliquam erat volutpat. Praesent nisi
          nisl, sodales vitae blandit tincidunt, malesuada id sapien.
        </HvTypography>
      </HvSection>
    </HvSection>
  );
}
