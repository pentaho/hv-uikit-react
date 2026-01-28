import { renderStory, setupChromatic } from "@hitachivantara/internal";
import { HvSimpleGrid } from "@hitachivantara/uikit-react-core";

import preview from "../../../../.storybook/preview";
import { Variants as BladeVariantsStory } from "../Blade/Blade.stories";
import { Main as BladesMainStory } from "../Blades/Blades.stories";
import { Main as DashboardMainStory } from "../Dashboard/Dashboard.stories";
import { Variants as StepNavigationVariantsStory } from "../StepNavigation/StepNavigation.stories";

/** Visual tests for components from the Lab package */
const meta = preview.meta({
  title: "Tests/Lab",
  tags: ["skipTestRunner"],
});

/**
 * Visual tests for:
 * - Blade
 * - Blades
 * - Dashboard
 * - Step navigation
 */
export const Test = meta.story({
  parameters: {
    ...setupChromatic("all", 5000),
  },
  render: (args, context: any) => (
    <>
      <HvSimpleGrid
        cols={2}
        style={{ alignItems: "start", justifyContent: "start" }}
      >
        {renderStory(DashboardMainStory, context)}
        {renderStory(BladesMainStory, context)}
        {renderStory(BladeVariantsStory, context)}
      </HvSimpleGrid>
      {renderStory(StepNavigationVariantsStory, context)}
    </>
  ),
});
