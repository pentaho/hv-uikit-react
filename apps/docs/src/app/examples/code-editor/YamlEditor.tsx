import { useState } from "react";
import { HvCodeEditor } from "@hitachivantara/uikit-react-code-editor";
import {
  HvIconButton,
  HvIconContainer,
  HvSection,
  HvTypography,
} from "@hitachivantara/uikit-react-core";

const defaultValue = `name: build-and-deploy

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Set up Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment: production
    steps:
      - name: Deploy to production
        run: npm run deploy
        env:
          DEPLOY_TOKEN: \${{ secrets.DEPLOY_TOKEN }}
`;

export default function Demo() {
  const [value, setValue] = useState(defaultValue);

  return (
    <HvSection
      title={<HvTypography variant="title4">example.yaml</HvTypography>}
      actions={
        <HvIconButton title="Settings">
          <HvIconContainer>
            <div className="i-ph-gear" />
          </HvIconContainer>
        </HvIconButton>
      }
      classes={{
        content: "p-0",
      }}
    >
      <HvCodeEditor
        height={340}
        language="yaml"
        value={value}
        onChange={(val) => setValue(val ?? "")}
        beforeMount={(monaco) => {
          // "type.yaml" is the token Monaco assigns to YAML keys (part before ":")
          monaco.editor.defineTheme("yaml-keys-light", {
            base: "vs",
            inherit: true,
            rules: [{ token: "type.yaml", foreground: "CC0000" }],
            colors: {},
          });
          monaco.editor.defineTheme("yaml-keys-dark", {
            base: "vs-dark",
            inherit: true,
            rules: [{ token: "type.yaml", foreground: "FF6666" }],
            colors: {},
          });
        }}
        onMount={(editor) => {
          const mq = window.matchMedia("(prefers-color-scheme: dark)");
          const applyTheme = (dark: boolean) =>
            editor.updateOptions({
              theme: dark ? "yaml-keys-dark" : "yaml-keys-light",
            });
          applyTheme(mq.matches);
          mq.addEventListener("change", (e) => applyTheme(e.matches));
        }}
      />
    </HvSection>
  );
}
