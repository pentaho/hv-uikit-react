/*! ******************************************************************************
 *
 * Pentaho
 *
 * Copyright (C) 2026 by Pentaho Canada Inc. : http://www.pentaho.com
 *
 * Use of this software is governed by the Business Source License included
 * in the LICENSE.TXT file.
 *
 * Change Date: 2030-06-15
 ******************************************************************************/
import type { Meta, StoryObj } from "@storybook/react-vite";
import { setupChromatic } from "@hitachivantara/internal";
import {
  HvCodeEditor,
  type HvCodeEditorProps,
} from "@hitachivantara/uikit-react-code-editor";

import { MainStory } from "./stories/Main";

const meta: Meta<typeof HvCodeEditor> = {
  title: "Components/Code Editor",
  component: HvCodeEditor,
};
export default meta;

export const Main: StoryObj<HvCodeEditorProps> = {
  parameters: {
    ...setupChromatic("default", 5000),
  },
  render: () => <MainStory />,
};
