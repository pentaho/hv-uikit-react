import { useState } from "react";
import {
  HvButton,
  HvSection,
  HvTypography,
} from "@hitachivantara/uikit-react-core";

export default function Demo() {
  // only one section allowed to be expanded at a time, so we need to manage the state of the sections
  const [expandedSection, setExpandedSection] = useState<string | null>(
    "section2",
  );

  return (
    <div className="flex flex-col gap-sm w-320px">
      <HvSection
        expandable
        expanded={expandedSection === "section1"}
        title={<HvTypography variant="title4">My Section</HvTypography>}
        actions={<HvButton variant="primaryGhost">Action</HvButton>}
        onToggle={(event, expanded) => {
          setExpandedSection(expanded ? "section1" : null);
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
        title={<HvTypography variant="title4">My Section</HvTypography>}
        actions={<HvButton variant="primaryGhost">Action</HvButton>}
        onToggle={(event, expanded) => {
          setExpandedSection(expanded ? "section2" : null);
        }}
      >
        <HvTypography>
          Nulla dapibus accumsan est, a pharetra velit consequat et. Nullam
          iaculis justo sed urna condimentum ultricies. Integer nec interdum
          tortor. Nulla molestie nibh in elit congue malesuada. Donec fringilla
          volutpat sapien id maximus. Vestibulum faucibus pellentesque ex, non
          gravida dui pharetra quis.
        </HvTypography>
      </HvSection>
      <HvSection
        expandable
        expanded={expandedSection === "section3"}
        title={<HvTypography variant="title4">My Section</HvTypography>}
        actions={<HvButton variant="primaryGhost">Action</HvButton>}
        onToggle={(event, expanded) => {
          setExpandedSection(expanded ? "section3" : null);
        }}
      >
        <HvTypography>
          Nulla dapibus accumsan est, a pharetra velit consequat et. Nullam
          iaculis justo sed urna condimentum ultricies. Integer nec interdum
          tortor. Nulla molestie nibh in elit congue malesuada. Donec fringilla
          volutpat sapien id maximus. Vestibulum faucibus pellentesque ex, non
          gravida dui pharetra quis.
        </HvTypography>
      </HvSection>
    </div>
  );
}
