// The plugin redraws only what it made: a designer's same-named frame, and their sections, are left as they are.
import { expect, test } from "vitest";

import { NS } from "../src/plugin/apply.ts";
import { framesNamed, merge } from "../src/plugin/page.ts";

/** A node as far as the page code reads it: a name, a type, children, and the plugin's mark. */
class Fake {
  children: Fake[] = [];
  parent?: Fake;
  name: string;
  type: string;
  marked: boolean;
  constructor(name: string, type = "FRAME", marked = false) {
    this.name = name;
    this.type = type;
    this.marked = marked;
  }
  getSharedPluginData(ns: string, key: string) {
    return ns === NS && key === "template" && this.marked ? "1" : "";
  }
  findChild(match: (n: Fake) => boolean) {
    return this.children.find(match) ?? null;
  }
  insertChild(i: number, n: Fake) {
    n.parent?.children.splice(n.parent.children.indexOf(n), 1);
    this.children.splice(i, 0, n);
    n.parent = this;
  }
  remove() {
    this.parent?.children.splice(this.parent.children.indexOf(this), 1);
  }
  with(...children: Fake[]) {
    for (const c of children) this.insertChild(this.children.length, c);
    return this;
  }
}
const NAME = "Button — documentation";

test("a same-named frame the plugin didn't make is never the one it updates", () => {
  const theirs = new Fake(NAME);
  const page = new Fake("Button", "PAGE").with(theirs);
  expect(framesNamed(page as never, NAME)).toEqual({
    old: undefined,
    theirs: [NAME],
  });

  const mine = new Fake(NAME, "FRAME", true);
  page.with(mine);
  expect(framesNamed(page as never, NAME)).toEqual({
    old: mine,
    theirs: [NAME],
  });
});

test("merging replaces the sections it made and keeps a designer's, untouched", () => {
  const designers = new Fake("Usage");
  const old = new Fake(NAME, "FRAME", true).with(
    new Fake("Header", "FRAME", true),
    designers,
  );
  const fresh = new Fake(NAME).with(
    new Fake("Header", "FRAME", true),
    new Fake("Usage", "FRAME", true),
  );
  const page = new Fake("Button", "PAGE").with(old, fresh);

  expect(merge(old as never, fresh as never)).toEqual(["Usage"]);
  expect(old.children.map((c) => [c.name, c === designers])).toEqual([
    ["Header", false],
    ["Usage", true],
  ]);
  expect(page.children).toEqual([old]);
});
