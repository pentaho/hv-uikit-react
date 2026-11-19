#!/usr/bin/env node
/* eslint-disable no-await-in-loop -- the shots and their steps run one after another */
/**
 * Screenshots of a running plugin for its design review, all in one browser session.
 *
 * Usage: node packages/cli/trials/screenshot.ts <shots.json> [--out <dir>]   (default: review/)
 *
 * shots.json is a list of `{ "name", "url", "width"?, "steps"? }`; each is saved as <out>/<name>.png, at the full
 * height of the page or of the App Shell's scrolling container. Before the steps, it waits for the page's h1. Steps:
 *
 *   { "click": "Delete" }                                       the element with exactly this text
 *   { "click": { "role": "checkbox", "name": "Select row" } }   by role and accessible name
 *   { "fill": ["Host", "db.example.com"] }                      the field with exactly this label
 *   { "press": "Escape" }                                       a key
 *   { "scroll": "End" }                                         the scrolling container to its end ("Home": top)
 *   { "wait": 500 }                                             milliseconds, after any step (default 300)
 */
import fs from "node:fs";
import path from "node:path";
import { parseArgs } from "node:util";
import { chromium, type Page } from "@playwright/test";

export interface Step {
  click?: string | { role: string; name: string };
  fill?: [string, string];
  press?: string;
  scroll?: "End" | "Home";
  wait?: number;
}

export interface Shot {
  name: string;
  url: string;
  width?: number;
  steps?: Step[];
}

const HEIGHT = 900;
/** The tallest a shot gets. */
const MAX_HEIGHT = 12_000;

/** A shots file's problems, one per line: empty when it's valid. */
export function shotsProblems(shots: unknown): string[] {
  if (!Array.isArray(shots)) return ["a list of shots is expected"];
  return shots.flatMap((shot: Partial<Shot>, index) => {
    const at = `shot ${index + 1}`;
    const problems: string[] = [];
    if (typeof shot?.name !== "string" || !/^[\w.-]+$/.test(shot.name))
      problems.push(`${at}: a file-safe name, like 01-list`);
    if (typeof shot?.url !== "string") problems.push(`${at}: a url`);
    for (const step of shot?.steps ?? [])
      if (
        !["click", "fill", "press", "scroll", "wait"].some((key) => key in step)
      )
        problems.push(`${at}: unknown step ${JSON.stringify(step)}`);
    return problems;
  });
}

async function run(page: Page, step: Step) {
  if (typeof step.click === "string")
    await page.getByText(step.click, { exact: true }).first().click();
  else if (step.click)
    await page
      .getByRole(step.click.role as Parameters<Page["getByRole"]>[0], {
        name: step.click.name,
      })
      .first()
      .click();
  if (step.fill)
    await page
      .getByLabel(step.fill[0], { exact: true })
      .first()
      .fill(step.fill[1]);
  if (step.press) await page.keyboard.press(step.press);
  if (step.scroll)
    await page.evaluate((end) => {
      const scroller = scrollerOf(document);
      scroller.scrollTop = end ? scroller.scrollHeight : 0;
      function scrollerOf(doc: Document): Element {
        // the element with the most to scroll: the App Shell's container, else the page
        let best: Element = doc.scrollingElement ?? doc.documentElement;
        let most = best.scrollHeight - best.clientHeight;
        for (const element of doc.querySelectorAll("*")) {
          const overflow = getComputedStyle(element).overflowY;
          const extra = element.scrollHeight - element.clientHeight;
          if ((overflow === "auto" || overflow === "scroll") && extra > most) {
            best = element;
            most = extra;
          }
        }
        return best;
      }
    }, step.scroll === "End");
  await page.waitForTimeout(step.wait ?? 300);
}

/** How much taller than the viewport the content is, in the page or in its scrolling container. */
const overflowOf = (page: Page) =>
  page.evaluate(() => {
    let most = 0;
    for (const element of [
      document.documentElement,
      ...document.querySelectorAll("*"),
    ]) {
      const overflow = getComputedStyle(element).overflowY;
      const scrolls =
        element === document.documentElement ||
        overflow === "auto" ||
        overflow === "scroll";
      if (scrolls)
        most = Math.max(most, element.scrollHeight - element.clientHeight);
    }
    return most;
  });

async function main(): Promise<number> {
  const { values, positionals } = parseArgs({
    allowPositionals: true,
    options: { out: { type: "string" }, help: { type: "boolean" } },
  });
  if (values.help || positionals.length !== 1) {
    console.log(
      "Usage: node screenshot.ts <shots.json> [--out <dir>]  (see the file's header for shots.json)",
    );
    return values.help ? 0 : 2;
  }
  const shots = JSON.parse(fs.readFileSync(positionals[0], "utf8")) as Shot[];
  const problems = shotsProblems(shots);
  if (problems.length) {
    console.error(problems.join("\n"));
    return 2;
  }
  const out = path.resolve(values.out ?? "review");
  fs.mkdirSync(out, { recursive: true });

  const browser = await chromium.launch();
  let failed = 0;
  try {
    for (const shot of shots) {
      const width = shot.width ?? 1440;
      const context = await browser.newContext({
        viewport: { width, height: HEIGHT },
      });
      const page = await context.newPage();
      const errors: string[] = [];
      page.on("pageerror", (error) => errors.push(error.message));
      const file = path.join(out, `${shot.name}.png`);
      try {
        await page.goto(shot.url, { waitUntil: "load" });
        await page.locator("h1").first().waitFor({ timeout: 30_000 });
        for (const step of shot.steps ?? []) await run(page, step);
        // the App Shell scrolls an inner container: grow the viewport until nothing is left to scroll
        const extra = await overflowOf(page);
        if (extra > 0) {
          await page.setViewportSize({
            width,
            height: Math.min(HEIGHT + extra, MAX_HEIGHT),
          });
          await page.waitForTimeout(200);
        }
        await page.screenshot({ path: file, fullPage: true });
        console.log(
          `saved ${file}${errors.length ? `; page errors: ${errors.join(" | ")}` : ""}`,
        );
      } catch (error) {
        failed += 1;
        console.error(
          `${shot.name}: ${(error as Error).message.split("\n")[0]}`,
        );
      } finally {
        await context.close();
      }
    }
  } finally {
    await browser.close();
  }
  return failed ? 1 : 0;
}

if (import.meta.filename === process.argv[1]) process.exitCode = await main();
