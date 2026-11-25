// Lines marked ✗ must be reported by the oxlint.json preset; every other line must not.
import { css } from "@emotion/css";
import { HvButton, HvInput, theme } from "@pentaho/uikit-react-core";

declare function save(): void;

export function Page({ status }: { status: "positive" | "negative" }) {
  return (
    <section>
      <h2>Settings</h2> {/* ✗ */}
      <HvInput label="Name" />
      <input type="hidden" name="id" value="1" />
      <button type="button" onClick={save}>Save</button> {/* ✗ */}
      <select /> {/* ✗ */}
      <table /> {/* ✗ */}
      <img src="logo.png" /> {/* ✗ */}
      <img src="logo.png" alt="UI Kit" />
      <div role="button" onClick={save} /> {/* ✗ */}
      <a href="#top" aria-hidden="true">Top</a> {/* ✗ */}
      <HvButton onClick={save}>Save</HvButton>
      <div className="flex gap-sm p-md text-negative" />
      <div className="p-[24px]" /> {/* ✗ */}
      <div style={{ color: theme.colors[status] }} />
      <div style={{ padding: "24px" }} /> {/* ✗ */}
      <div className={css({ color: "#00ff00" })} /> {/* ✗ */}
    </section>
  );
}
