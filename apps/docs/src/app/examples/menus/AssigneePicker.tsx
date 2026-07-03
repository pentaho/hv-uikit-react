import { useMemo, useRef, useState } from "react";
import {
  HvAvatar,
  HvBaseDropdown,
  HvLabel,
  HvPanel,
  HvSearchInput,
  HvTypography,
} from "@hitachivantara/uikit-react-core";

const users = [
  { id: "1", name: "Alice Chen", role: "Engineer", initials: "AC", bg: "cat1" },
  {
    id: "2",
    name: "Bob Martinez",
    role: "QA Lead",
    initials: "BM",
    bg: "cat2",
  },
  {
    id: "3",
    name: "Carol Smith",
    role: "Product Manager",
    initials: "CS",
    bg: "cat3",
  },
  { id: "4", name: "David Lee", role: "DevOps", initials: "DL", bg: "cat4" },
  {
    id: "5",
    name: "Elena Torres",
    role: "Designer",
    initials: "ET",
    bg: "cat5",
  },
  { id: "6", name: "Frank Wang", role: "Engineer", initials: "FW", bg: "cat6" },
  { id: "7", name: "Grace Kim", role: "Architect", initials: "GK", bg: "cat7" },
] as const;

type User = (typeof users)[number];

export default function Demo() {
  const searchRef = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<User | null>(null);
  const [search, setSearch] = useState("");

  const filtered = useMemo(
    () =>
      users.filter(
        (u) =>
          u.name.toLowerCase().includes(search.toLowerCase()) ||
          u.role.toLowerCase().includes(search.toLowerCase()),
      ),
    [search],
  );

  const handleSelect = (user: User) => {
    setSelected(user);
    setOpen(false);
    setSearch("");
  };

  return (
    <div className="w-300px">
      <HvLabel label="Assign to" showGutter />
      <HvBaseDropdown
        expanded={open}
        onToggle={(_, isOpen) => {
          setOpen(isOpen);
          if (!isOpen) setSearch("");
        }}
        onContainerCreation={() => searchRef.current?.focus()}
        placeholder={
          selected ? (
            <div className="flex items-center gap-xs">
              <HvAvatar size="xs" backgroundColor={selected.bg}>
                {selected.initials}
              </HvAvatar>
              <span>{selected.name}</span>
            </div>
          ) : (
            "Select assignee..."
          )
        }
      >
        <HvPanel className="w-300px p-xs flex flex-col gap-xs">
          <HvSearchInput
            ref={searchRef}
            placeholder="Search people..."
            value={search}
            onChange={(_, val) => setSearch(val ?? "")}
            className="pb-xs"
          />
          <div className="flex flex-col">
            {filtered.length === 0 ? (
              <HvTypography
                variant="caption1"
                className="px-xs color-textSubtle"
              >
                No results
              </HvTypography>
            ) : (
              filtered.map((user) => (
                <button
                  type="button"
                  key={user.id}
                  className="flex items-center gap-sm p-xs rounded cursor-pointer w-full text-left hover:bg-bgHover"
                  onClick={() => handleSelect(user)}
                >
                  <HvAvatar size="sm" backgroundColor={user.bg}>
                    {user.initials}
                  </HvAvatar>
                  <div>
                    <HvTypography variant="label">{user.name}</HvTypography>
                    <HvTypography
                      variant="caption1"
                      className="color-textSubtle"
                    >
                      {user.role}
                    </HvTypography>
                  </div>
                </button>
              ))
            )}
          </div>
        </HvPanel>
      </HvBaseDropdown>
    </div>
  );
}
