import { css } from "@emotion/react";
import { theme } from "@hitachivantara/uikit-styles";

export const styles = css`
  .editor ul {
    padding-left: 1.5em;
  }
  .editor ol {
    padding-left: 1.5em;
  }
  .text-bold {
    font-weight: bold;
  }
  .text-italic {
    font-style: italic;
  }
  .text-underline {
    text-decoration: underline;
  }
  .text-strikethrough {
    text-decoration: line-through;
  }
  .text-code {
    font-family: monospace;
    background: #eee;
    padding: 0.2em 0.4em;
    border-radius: 4px;
  }
  .text-left {
    text-align: left;
  }
  .text-center {
    text-align: center;
  }
  .text-right {
    text-align: right;
  }
  .text-justify {
    text-align: justify;
  }
  .editor-link  {
    color: blue;
    text-decoration: underline;
    cursor: pointer;
  }
  h1 {
    ${theme.typography.display}
  }
  h2 {
    ${theme.typography.title1}
  }
  h3 {
    ${theme.typography.title2}
  }
`;
