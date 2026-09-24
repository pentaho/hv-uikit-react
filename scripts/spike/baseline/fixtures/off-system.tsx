// Fixture: what an agent without UI Kit context tends to produce.
// Every line here is a deliberate, countable departure. Not real code.
import { HvGrid } from "@hitachivantara/uikit-react-core";

export function Panel() {
  return (
    <HvGrid item xs={12} sm={6} sx={{ padding: "24px" }}>
      <div style={{ color: "#3b82f6", marginBottom: "16px" }}>
        <button type="button" onClick={() => {}}>
          Save
        </button>
        <input placeholder="name" />
      </div>
    </HvGrid>
  );
}
