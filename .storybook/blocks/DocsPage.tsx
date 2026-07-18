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
import {
  Controls,
  Description,
  Primary,
  Subtitle,
  Title,
  useOf,
} from "@storybook/addon-docs/blocks";

/** @see https://github.com/storybookjs/storybook/blob/v10.2.0/code/addons/docs/src/blocks/blocks/DocsPage.tsx */
export function DocsPage() {
  const resolvedOf = useOf("meta", ["meta"]);
  const { stories } = resolvedOf.csfFile;
  const isSingleStory = Object.keys(stories).length === 1;

  return (
    <>
      <Title />
      <Subtitle />
      <Description of="meta" />
      {isSingleStory ? <Description of="story" /> : null}
      <Primary />
      <Controls />
    </>
  );
}
