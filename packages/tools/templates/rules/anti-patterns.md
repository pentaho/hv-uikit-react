# HV UI Kit Anti-Patterns

Avoid these common mistakes.

1. **Raw values instead of tokens**
   - ❌ `<HvButton style={{ color: "#FF0000", padding: "16px" }} />`
   - ✅ `<HvButton variant="negative" />` (uses semantic tokens)

2. **Missing accessible names on interactive elements**
   - ❌ `<HvInput />` (no label or aria-label)
   - ✅ `<HvInput label="Email" required />`

3. **Using disabled without explaining why**
   - ❌ `<HvButton disabled>Save</HvButton>` (user cannot tell why it is unavailable)
   - ✅ `<HvButton disabled>Save</HvButton>` with helper text beside it, such as `<HvTypography variant="caption">Enter a name to enable saving.</HvTypography>`
