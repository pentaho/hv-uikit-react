// the page.evaluate callbacks run in the browser
/// <reference lib="dom" />
/// <reference lib="dom.iterable" />
/* eslint-disable no-await-in-loop -- the shots and their steps run one after another */
/**
 * Screenshots of a running app or plugin for its design review, all in one browser session: `uikit-cli shots` (the file's
 * format and steps are in its --help).
 */
import fs from "node:fs";
import path from "node:path";
import { Command } from "commander";
// a type only: Playwright is the project's to install, not a dependency of the CLI
import type { Browser, Page } from "playwright";

interface Step {
  /** `in: "dialog"`: only inside an open dialog, and skipped when none is open (a confirmation some pages ask) */
  click?:
    | string
    /** `nth`: which of the matches, from 0 (-1 the last); a name may be left out when the page's own data names them */
    /** `optional`: skipped when the control is missing or disabled (a form that disables Save while a field is invalid) */
    | {
        role: string;
        name?: string;
        nth?: number;
        in?: "dialog";
        optional?: true;
      }
    /** visible text that contains this, the first match: a name the page made up around a known word */
    | { text: string };
  fill?: [string, string];
  press?: string;
  wait?: number;
}

export interface Shot {
  name: string;
  url: string;
  width?: number;
  dark?: boolean;
  /** What to wait for before the steps (a CSS or Playwright selector, `text=Users` to be sure it's the right page); default `h1`. */
  waitFor?: string;
  steps?: Step[];
}

const HEIGHT = 900;
/** The tallest a shot gets. */
const MAX_HEIGHT = 12_000;

/**
 * Only the project's own dev server: `npm run shots` runs without a permission prompt, so it must not be a way to load,
 * or send data to, any other page.
 */
function isLocal(url: string) {
  try {
    const { protocol, hostname } = new URL(url);
    return (
      /^https?:$/.test(protocol) &&
      ["localhost", "127.0.0.1", "[::1]"].includes(hostname)
    );
  } catch {
    return false;
  }
}

/** A shots file's problems, one per line: empty when it's valid. */
export function shotsProblems(shots: unknown): string[] {
  if (!Array.isArray(shots)) return ["a list of shots is expected"];
  return shots.flatMap((shot: Partial<Shot>, index) => {
    const at = `shot ${index + 1}`;
    const problems: string[] = [];
    if (typeof shot?.name !== "string" || !/^[\w.-]+$/.test(shot.name))
      problems.push(`${at}: a file-safe name, like 01-list`);
    if (typeof shot?.url !== "string" || !isLocal(shot.url))
      problems.push(
        `${at}: a url on this machine, like http://localhost:5173/<route>`,
      );
    for (const step of shot?.steps ?? [])
      if (
        !step ||
        typeof step !== "object" ||
        !["click", "fill", "press", "wait"].some((key) => key in step)
      )
        problems.push(`${at}: unknown step ${JSON.stringify(step)}`);
    return problems;
  });
}

async function run(page: Page, step: Step) {
  if (typeof step.click === "string")
    await page.getByText(step.click, { exact: true }).first().click();
  else if (step.click && "text" in step.click)
    await page.getByText(step.click.text).first().click();
  else if (step.click) {
    // the exact name first ("Select" isn't "Select all"); a name that only contains it when none matches exactly
    const { role, name, nth = 0 } = step.click;
    const scope =
      step.click.in === "dialog"
        ? page.locator('[role="dialog"], [role="alertdialog"]')
        : page;
    const byRole = (exact: boolean) =>
      scope.getByRole(
        role as Parameters<Page["getByRole"]>[0],
        name === undefined ? {} : { name, exact },
      );
    const exact = byRole(true);
    const target =
      name === undefined || (await exact.count()) ? exact : byRole(false);
    const count = await target.count();
    const exists = nth >= 0 ? count > nth : count >= -nth;
    if (step.click.optional) {
      // skipped when the control isn't there, or is there but disabled (a Save a form disables while invalid)
      if (exists && (await target.nth(nth).isEnabled()))
        await target.nth(nth).click();
    } else if (step.click.in !== "dialog" || exists)
      await target.nth(nth).click();
  }
  if (step.fill) {
    // the exact label first; one that contains it when none matches ("Port" in a required field's "Port *")
    const exact = page.getByLabel(step.fill[0], { exact: true });
    const field = (await exact.count()) ? exact : page.getByLabel(step.fill[0]);
    await field.first().fill(step.fill[1]);
  }
  if (step.press) await page.keyboard.press(step.press);
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

/** Chromium from Playwright, else the machine's Chrome; why it can't, as an error. */
async function launch(): Promise<Browser> {
  let chromium;
  try {
    ({ chromium } = await import("playwright"));
  } catch {
    throw new Error(
      "screenshots need Playwright: npm install -D playwright && npx playwright install chromium",
    );
  }
  try {
    return await chromium.launch();
  } catch (error) {
    return chromium.launch({ channel: "chrome" }).catch(() => {
      throw new Error(
        `no browser for the screenshots (npx playwright install chromium): ${(error as Error).message.split("\n")[0]}`,
        { cause: error },
      );
    });
  }
}

/** Takes every shot into `out`; the names of those that failed. */
export async function takeShots(shots: Shot[], out: string): Promise<string[]> {
  const problems = shotsProblems(shots);
  if (problems.length) throw new Error(problems.join("\n"));
  fs.mkdirSync(out, { recursive: true });

  const browser = await launch();
  const failed: string[] = [];
  try {
    for (const shot of shots) {
      const width = shot.width ?? 1440;
      const context = await browser.newContext({
        viewport: { width, height: HEIGHT },
        colorScheme: shot.dark ? "dark" : "light",
      });
      // the App Shell's color mode, as its header switch stores it
      if (shot.dark)
        await context.addInitScript(() =>
          localStorage.setItem("hv/user-preferences/color-mode", "dark"),
        );
      const page = await context.newPage();
      const errors: string[] = [];
      page.on("pageerror", (error) => errors.push(error.message));
      const png = path.join(out, `${shot.name}.png`);
      try {
        await page.goto(shot.url, { waitUntil: "load" });
        await page
          .locator(shot.waitFor ?? "h1")
          .first()
          .waitFor({ timeout: 30_000 });
        // once the page is up, a step whose target never shows fails fast, not after Playwright's 30 s
        page.setDefaultTimeout(5000);
        for (const step of shot.steps ?? []) await run(page, step);
        // the App Shell scrolls its main panel, not the page: grow the viewport until nothing is left to scroll
        const extra = await overflowOf(page);
        if (extra > 0) {
          await page.setViewportSize({
            width,
            height: Math.min(HEIGHT + extra, MAX_HEIGHT),
          });
          await page.waitForTimeout(200);
        }
        await page.screenshot({ path: png, fullPage: true });
        console.log(
          `saved ${png}${errors.length ? `; page errors: ${errors.join(" | ")}` : ""}`,
        );
      } catch (error) {
        failed.push(shot.name);
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
  return failed;
}

export const shotsCommand = new Command("shots")
  .argument("[file]", "the shots to take", "review/shots.json")
  .description(
    "Screenshot a running app's pages and states for review, in one browser session",
  )
  .option("--out <dir>", "where the PNGs go", "review")
  .addHelpText(
    "after",
    `
The file: [{ "name": "01-list", "url": "http://localhost:5173/<route>", "width"?: 390, "dark"?: true, "steps"?: [...] }]
Each shot waits for the page's h1 (or its "waitFor": "text=Users" makes sure it's the right page), runs its steps,
then is saved at full height as <out>/<name>.png; a step's target has 5 s to show. Steps:
  { "click": "Delete" }  { "click": { "role": "checkbox", "name": "Select row" } }  { "fill": ["Label", "text"] }
  { "press": "Escape" }  { "wait": 500 }
A click by text matches exactly; a fill by label too, else the first label that contains it ("Port" for "Port *").
A click by role matches the exact accessible name, else the first name that contains it (so "Select" picks "Select",
not "Select all", when both exist). With "in": "dialog" it looks only in an open dialog and is skipped when none is
open: { "click": { "role": "button", "name": "Retry", "in": "dialog" } } confirms a page's confirmation, if it asks
one. "nth" picks one of the matches, from 0, and -1 the last; with no "name", of every element with that role:
{ "click": { "role": "option", "nth": -1 } } picks an open list's last option, whatever the data names it.
"optional": true skips a click whose control is missing or disabled, as a Save a form disables while a field is invalid.
{ "click": { "text": "customers" } } clicks the first visible text that contains it.`,
  )
  .action(async (file: string, options: { out: string }) => {
    const shots = JSON.parse(fs.readFileSync(path.resolve(file), "utf8"));
    if ((await takeShots(shots, path.resolve(options.out))).length)
      process.exitCode = 1;
  });
