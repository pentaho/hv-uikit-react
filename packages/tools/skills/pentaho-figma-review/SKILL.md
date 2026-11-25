---
name: pentaho-figma-review
description: Review Pentaho screens in Figma against the UI Kit - components from the Pentaho UI library, tokens used for what they mean, the content and accessibility rules, and whether each part can be built with the UI Kit. Use when someone asks to review, check, audit or QA a Figma design, frame or mock-up. Values not on a token are Figma's Check designs' job; to design screens, pentaho-figma-screens.
license: Apache-2.0
compatibility: Needs a Figma MCP server with read access to the file, and @pentaho/uikit-tools installed in the project.
---

# Review Pentaho screens in Figma

**Working with the person.** Usually a designer: talk in their words and name layers as Figma shows them, not ids
or code. Review only; change the file only when they ask, and then only what they asked.

**Tools.** Figma's MCP server to read the frames: their layers, the components they're instances of, the variables
and text styles bound to them, a screenshot of each. The UI Kit tools for the system (or the `hv-uikit` MCP server):
`npx --no-install uikit-tools rules` and `rule <id>`, `info <Component> --spec`, `tokens <word>`.

## 1. What to review

The frames the person names (a link or the selection). Read the rules first, `principles`, `tokens`, `content` and
`accessibility` above all: they are what the review checks. Look at each frame's screenshot before judging it.

## 2. Values not on a token

Don't review these by hand: Figma's **Check designs** (right-click the frame › Check designs) finds them and binds
each to its variable. Say how many layers it would flag, if you saw any, and ask the designer to run it. Where it
can't run (an agent), count the fills, strokes, spacings and radii not bound to a variable instead.

## 3. What only a review sees

- **Components:** every control is an instance from the Pentaho UI library: not detached, not drawn by hand, not
  from another library, and not one the UI Kit marks deprecated. Each part maps to a UI Kit component
  (`info`); a part none covers is a design-system gap, not an error: count the `GAP: …` layers and name each.
- **Tokens for what they mean:** rule `tokens/surfaces-and-text`, and each token's uses (`tokens <word>`). The page on `bgPage`, cards and panels on `bgContainer`; `primary` for the action only; status colors always
  with a label or icon; secondary text `textSubtle` on containers, `text` on the page. A token bound to the wrong role is a finding even when the
  color looks right.
- **Content:** rule `content`: sentence case; buttons say what they do with a verb; messages say what happened,
  then what to do; no exclamation marks or emoji.
- **Accessibility:** rule `accessibility/contrast-and-names`: text meets WCAG AA in Light and in Dark (read the
  bound variables' values in both modes); every icon-only button has a label; state is never color alone.
- **States:** rule `components/data-states`: a list or form has its loading, empty and error frames, or the
  hand-off says why not.
- **The app frame,** for a whole screen: the Header on top, the view padded `space.md`, its title `title2`.

## 4. Report

Per frame, the findings that matter most first, each with the layer, what's wrong and the fix in one line. Then what
is fine, briefly, and the design-system gaps. Don't pad: a clean frame gets one line.

**Fixing, when asked:** only certain fixes (a token for the right role, sentence case, a swap to the library
component), each one reported. Anything a designer should decide stays a finding.
