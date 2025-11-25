import { useCallback, useMemo, useRef, useState } from "react";
import {
  HvBaseDropdown,
  HvCheckBox,
  HvCheckBoxGroup,
  HvOverflowTooltip,
  HvPanel,
  HvSearchInput,
  HvTag,
  HvTypography,
} from "@hitachivantara/uikit-react-core";

export default function Demo() {
  const [selected, setSelected] = useState<string[] | null>(null);
  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const searchRef = useRef<HTMLInputElement>(null);

  const filteredGroups = useMemo(
    () => filterGroups(searchValue, groups),
    [searchValue],
  );

  const handleSelect = useCallback(
    (groupValues: string[], checkedValues: string[]) => {
      setSelected((prev) => {
        if (!prev) return checkedValues;
        const withoutGroup = prev?.filter((id) => !groupValues.includes(id));
        return [...(withoutGroup ?? []), ...checkedValues];
      });
    },
    [],
  );

  return (
    <HvBaseDropdown
      expanded={open}
      onToggle={() => setOpen((p) => !p)}
      classes={{
        root: "w-300px!",
        panel: "w-300px!",
      }}
      placeholder={
        <div className="flex gap-xxs overflow-scroll">
          {selected?.map((item) => <HvTag label={item} />)}
        </div>
      }
      onContainerCreation={() => searchRef.current?.focus()}
    >
      <HvPanel>
        <HvSearchInput
          ref={searchRef}
          placeholder="Search..."
          onChange={(_, val) => setSearchValue(val || "")}
          className="m-b-xxs p-l-0"
        />
        <div>
          <div className="flex flex-col items-start gap-xxs">
            {filteredGroups.map((group) => (
              <div
                key={group.id}
                className="w-full flex flex-col gap-xxs [&:not(:last-child)]:b-b-1 [&:not(:last-child)]:b-b-border [&:not(:last-child)]:p-b-xs [&:not(:last-child)]:m-b-xs"
              >
                {group.items.length > 0 && (
                  <>
                    <HvTypography variant="label" className="p-xs">
                      {group.label}
                    </HvTypography>
                    <HvCheckBoxGroup
                      onChange={(_, value) =>
                        handleSelect(
                          group.items.map((opt: Item) => opt.label),
                          value,
                        )
                      }
                    >
                      {group.items
                        .filter((option: Item) =>
                          option.label
                            .toLowerCase()
                            .includes(searchValue.toLowerCase()),
                        )
                        .map((option: Item) => (
                          <HvCheckBox
                            key={option.id}
                            value={option.label}
                            checked={selected?.includes(option.label)}
                            label={<HvOverflowTooltip data={option.label} />}
                          />
                        ))}
                    </HvCheckBoxGroup>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      </HvPanel>
    </HvBaseDropdown>
  );
}

interface Item {
  id: string;
  label: string;
}
interface Group {
  id: string;
  label: string;
  items: Item[];
}
const groups: Group[] = [
  {
    id: "engineering",
    label: "Engineering",
    items: [
      { id: "1", label: "Software Development" },
      { id: "2", label: "Quality Assurance" },
      { id: "3", label: "DevOps" },
    ],
  },
  {
    id: "finance",
    label: "Finance",
    items: [
      { id: "4", label: "Accounting" },
      { id: "5", label: "Budgeting" },
      { id: "6", label: "Investments" },
      { id: "7", label: "Payroll" },
    ],
  },
];

const filterGroups = (search: string, groups: Group[]) => {
  if (!search) return groups;

  return groups.map((group) => ({
    ...group,
    items: group.items?.filter((item: Item) => {
      const labelText = item.label.toLowerCase();
      return labelText.includes(search.toLowerCase());
    }),
  }));
};
