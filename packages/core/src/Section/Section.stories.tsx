import { HvTypography } from "@hitachivantara/uikit-react-core";

import preview from "../../../../.storybook/preview";
import { HvButton } from "../Button";
import { HvSection } from "./Section";

const meta = preview.meta({
  title: "Components/Section",
  component: HvSection,
});

export const Main = meta.story({
  args: {
    title: "Section Title",
    raisedHeader: false,
    expandable: false,
    defaultExpanded: true,
  },
  argTypes: {
    classes: { control: { disable: true } },
  },
  render: ({ title, ...others }) => {
    const wrappedTitle = <HvTypography variant="title4">{title}</HvTypography>;
    return (
      <HvSection title={wrappedTitle} {...others}>
        <HvTypography>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed tempor
          blandit ipsum quis sollicitudin. Aliquam erat volutpat. Praesent nisi
          nisl, sodales vitae blandit tincidunt, malesuada id sapien. Nulla
          dapibus accumsan est, a pharetra velit consequat et. Nullam iaculis
          justo sed urna condimentum ultricies. Integer nec interdum tortor.
          Nulla molestie nibh in elit congue malesuada. Donec fringilla volutpat
          sapien id maximus. Vestibulum faucibus pellentesque ex, non gravida
          dui pharetra quis. Nulla facilisi. Suspendisse erat nisl, mollis ut
          est nec, malesuada feugiat orci. Vivamus dignissim nibh id lacinia
          vehicula. Nullam lobortis scelerisque dui, non suscipit sapien
          tincidunt at. Vivamus ut orci imperdiet, volutpat mauris in, sagittis
          mi. Donec pulvinar nibh sit amet neque tristique, vitae gravida ipsum
          dapibus. Donec a eros commodo, tincidunt nunc dictum, ullamcorper
          quam.
        </HvTypography>
      </HvSection>
    );
  },
});

export const Test = meta.story({
  decorators: [(Story) => <div className="grid gap-sm">{Story()}</div>],
  render: () => (
    <>
      <HvSection
        title={<HvTypography variant="title4">My Section</HvTypography>}
        actions={<HvButton variant="primaryGhost">Action</HvButton>}
      >
        <HvTypography>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed tempor
          blandit ipsum quis sollicitudin. Aliquam erat volutpat. Praesent nisi
          nisl, sodales vitae blandit tincidunt, malesuada id sapien. Nulla
          dapibus accumsan est, a pharetra velit consequat et. Nullam iaculis
          justo sed urna condimentum ultricies. Integer nec interdum tortor.
          Nulla molestie nibh in elit congue malesuada. Donec fringilla volutpat
          sapien id maximus. Vestibulum faucibus pellentesque ex, non gravida
          dui pharetra quis.
        </HvTypography>
      </HvSection>
      <HvSection>
        <HvTypography>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed tempor
          blandit ipsum quis sollicitudin. Aliquam erat volutpat. Praesent nisi
          nisl, sodales vitae blandit tincidunt, malesuada id sapien. Nulla
          dapibus accumsan est, a pharetra velit consequat et.
        </HvTypography>
      </HvSection>
      <HvSection expandable title="My Section">
        <HvTypography>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed tempor
          blandit ipsum quis sollicitudin. Aliquam erat volutpat. Praesent nisi
          nisl, sodales vitae blandit tincidunt, malesuada id sapien. Nulla
          dapibus accumsan est, a pharetra velit consequat et.
        </HvTypography>
      </HvSection>
      <HvSection
        raisedHeader
        expandable
        expandableHeader
        title="My Section"
        actions={<HvButton variant="primaryGhost">Action</HvButton>}
      >
        <HvTypography>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed tempor
          blandit ipsum quis sollicitudin. Aliquam erat volutpat. Praesent nisi
          nisl, sodales vitae blandit tincidunt, malesuada id sapien. Nulla
          dapibus accumsan est, a pharetra velit consequat et.
        </HvTypography>
      </HvSection>
      <HvSection
        expandable
        expanded={false}
        title="My Section"
        actions={<HvButton variant="primaryGhost">Action</HvButton>}
      >
        <HvTypography>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed tempor
          blandit ipsum quis sollicitudin. Aliquam erat volutpat. Praesent nisi
          nisl, sodales vitae blandit tincidunt, malesuada id sapien. Nulla
          dapibus accumsan est, a pharetra velit consequat et.
        </HvTypography>
      </HvSection>
    </>
  ),
});
