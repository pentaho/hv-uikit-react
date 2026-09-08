import { useState } from "react";
import { HvInput, HvSelect } from "@pentaho/uikit-react-core";

export default function Demo() {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<string | null>(null);

  return (
    <HvInput
      label="Dropdown suffix"
      className="w-300px"
      onChange={(_, value) => {
        setEmail(value);
      }}
      value={email}
      placeholder="Type user email..."
      endAdornment={
        <HvSelect
          enablePortal
          value={role}
          onChange={(_, val) => setRole(val)}
          classes={{
            root: "w-140px! border-l-1! border-l-border! rounded-none!",
            panel: "w-150px! p-sm",
            select:
              "border-none! rounded-none! bg-bgContainer! hover:bg-primaryDimmed",
            popper: "m-l-[-10px]!",
          }}
          options={roles}
          placeholder="Select..."
        />
      }
    />
  );
}

const roles = [
  { label: "Admin", value: "admin" },
  { label: "Editor", value: "editor" },
  { label: "Reviewer", value: "reviewer" },
  { label: "View only", value: "view" },
];
