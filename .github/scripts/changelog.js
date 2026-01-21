#!/usr/bin/env node
import { generate } from "changelogithub";

function sanitize(str = "") {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function cleanupMd(str = "") {
  const cleanMd = str.replace(/&nbsp;/g, "").replace(/<\/?samp>/g, "");
  return sanitize(cleanMd);
}

async function main() {
  const [currentVersion, newVersion] = process.argv.slice(2);
  if (!currentVersion) throw new Error("currentVersion arg is required");
  if (!newVersion) throw new Error("newVersion arg is required");

  const { md } = await generate({
    repo: "pentaho/hv-uikit-react",
    from: currentVersion,
    to: newVersion,
    dry: true,
    group: false,
    emoji: true,
  });

  const text = cleanupMd(md)
    // cleanup commit links
    .replace(/ - by .+$/gm, ".")
    // convert markdown to slack format
    .replace(/^#+ (.+)$/gm, "*$1*")
    .replace(/^- /gm, "• ")
    .replaceAll("**", "*")
    .replace(/\[(.*?)\]\((https?:\/\/[^\s)]+)\)/g, "<$2|$1>")
    // cleanup newlines
    .replace(/\n/g, "\n");

  const releaseUrl = `https://github.com/pentaho/hv-uikit-react/releases/tag/${newVersion}`;
  const mdSections = [
    `*<${releaseUrl}|UI-Kit \`${newVersion}\` released>*`,
    text,
  ];
  const output = mdSections.map((text) => ({
    type: "section",
    text: { type: "mrkdwn", text },
  }));

  console.info(JSON.stringify(output));
}

main();
