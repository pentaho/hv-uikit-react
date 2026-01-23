import { useState } from "react";
import {
  HvAccordion,
  HvActionBar,
  HvActionGeneric,
  HvAvatar,
  HvBannerContent,
  HvBreadCrumb,
  HvBulkActions,
  HvButton,
  HvCard,
  HvCardContent,
  HvCardHeader,
  HvCardMedia,
  HvCheckBox,
  HvColorPicker,
  HvDatePicker,
  HvEmptyState,
  HvGlobalActions,
  HvGrid,
  HvIconButton,
  HvInput,
  HvListContainer,
  HvListItem,
  HvMultiButton,
  HvOption,
  HvPagination,
  HvPanel,
  HvProgressBar,
  HvRadio,
  HvRadioGroup,
  HvSelect,
  HvSelectionList,
  HvSlider,
  HvSwitch,
  HvTab,
  HvTable,
  HvTableBody,
  HvTableCell,
  HvTableContainer,
  HvTableHead,
  HvTableHeader,
  HvTableRow,
  HvTableSection,
  HvTabs,
  HvTag,
  HvTagsInput,
  HvTimePicker,
  HvToggleButton,
  HvTypography,
  useHvBulkActions,
  useHvPagination,
  useHvRowSelection,
  useHvTable,
  useHvTableSticky,
} from "@hitachivantara/uikit-react-core";
// eslint-disable-next-line no-restricted-imports
import {
  AssetEvent,
  makeData,
} from "@hitachivantara/uikit-react-core/src/Table/stories/storiesUtils";
import {
  Backwards,
  Ban,
  Cloud,
  DataStore,
  Delete,
  Duplicate,
  Favorite,
  FavoriteSelected,
  Lock,
  Preview,
  Share,
  Upload,
} from "@hitachivantara/uikit-react-icons";

const Tabs = () => {
  const [value, setValue] = useState(0);

  return (
    <HvTabs
      variant="fullWidth"
      orientation="horizontal"
      value={value}
      onChange={(_, val) => setValue(val)}
    >
      <HvTab icon={<DataStore />} iconPosition="start" label="Tab 1" />
      <HvTab icon={<DataStore />} iconPosition="start" label="Tab 2" />
      <HvTab icon={<DataStore />} iconPosition="start" label="Tab 3" />
    </HvTabs>
  );
};

const MultiButtons = () => {
  const [selection, setSelection] = useState([0, 2, 3, 5]);

  const handleChange = (idx: number) => {
    const newSelection = selection.includes(idx)
      ? selection.filter((v) => v !== idx)
      : [...selection, idx];
    setSelection(newSelection);
  };

  const buttons = ["Monday", "Tuesday", "Wednesday", "Thursday"];

  return (
    <HvMultiButton>
      {buttons.map((button, i) => (
        <HvButton
          key={`${buttons[i]}`}
          aria-label={button}
          selected={selection.includes(i)}
          onClick={() => handleChange(i)}
        >
          {button[0]}
        </HvButton>
      ))}
    </HvMultiButton>
  );
};

const Panel1 = () => (
  <HvPanel className="grid gap-xs">
    <Tabs />
    <HvBannerContent
      showIcon
      variant="success"
      content="Check out the UI Kit library!"
    />
    <HvBannerContent showIcon variant="error" content="An error has ocurred" />
    <div>
      <HvAccordion label="Analytics" defaultExpanded>
        <HvTypography>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent
          feugiat urna nec mauris tempor sodales ac quis massa. Integer eu velit
          mi. In aliquet vehicula nisi id aliquam.
        </HvTypography>
      </HvAccordion>
      <HvAccordion label="System">
        <HvListContainer interactive condensed>
          <HvListItem>Settings</HvListItem>
          <HvListItem>Network</HvListItem>
        </HvListContainer>
      </HvAccordion>
      <HvAccordion label="Hidden Data" disabled>
        <h2>Secret stuff!</h2>
      </HvAccordion>
    </div>
    <HvProgressBar
      value={64}
      classes={{
        root: "px-sm",
        progressBar: "bg-positive",
      }}
    />
    <div className="flex gap-xs">
      <HvColorPicker iconOnly defaultValue="#C62828" />
      <HvSwitch />
      <HvCheckBox label="" />
      <HvCheckBox defaultChecked label="Check" />
      <HvRadioGroup orientation="horizontal" classes={{ group: "gap-0" }}>
        <HvRadio label="" value="1" />
        <HvRadio label="" value="2" defaultChecked />
      </HvRadioGroup>
    </div>
    <div style={{ width: 200 }}>
      <MultiButtons />
    </div>
    <HvSelectionList label="Options">
      <HvListItem value="1">List Item 1</HvListItem>
      <HvListItem value="2">List Item 2</HvListItem>
      <HvListItem value="3">List Item 3</HvListItem>
    </HvSelectionList>
  </HvPanel>
);

const Panel2 = () => (
  <HvPanel className="grid gap-sm overflow-unset">
    <HvTypography variant="title3" className="text-primary">
      This is a form title
    </HvTypography>
    <HvInput
      label="Username"
      description="Fill in your username here"
      placeholder="john12doe"
    />
    <HvInput
      type="password"
      label="Password"
      defaultValue="very-secret-password"
    />
    <HvSelect
      name="country"
      label="Country"
      description="Select your favorite country"
      placeholder="Select country"
    >
      <HvOption value="ar">Argentina</HvOption>
      <HvOption value="bg">Belgium</HvOption>
      <HvOption value="pt">Portugal</HvOption>
      <HvOption value="pl">Poland</HvOption>
      <HvOption value="sp">Spain</HvOption>
    </HvSelect>
    <HvSlider
      label="Rating zone"
      hideInput
      defaultValues={[4, 8]}
      minPointValue={0}
      maxPointValue={10}
    />
    <HvDatePicker
      label="Date"
      rangeMode
      startValue={new Date("2020-07-20")}
      endValue={new Date("2020-07-25")}
    />
    <HvTimePicker
      label="Time"
      defaultValue={{ hours: 20, minutes: 21, seconds: 22 }}
    />
    <HvTagsInput
      label="Project Tags"
      defaultValue={["react", "ui", "library"]}
    />
    <div className="flex flex-wrap justify-end">
      <HvButton variant="primaryGhost" startIcon={<Upload />}>
        Submit results
      </HvButton>
    </div>
  </HvPanel>
);

const Card1 = () => (
  <HvCard bgcolor="bgContainer">
    <HvCardHeader
      avatar={<HvAvatar backgroundColor="rebeccapurple">AB</HvAvatar>}
      title={
        <HvTypography variant="title4">Madeira Island, Portugal</HvTypography>
      }
      subheader={
        <div className="flex gap-2px">
          <HvTag color="cat3" label="Nature" />
          <HvTag color="cat1" label="Ocean" />
          <HvTag color="cat5" label="Vertigo" />
        </div>
      }
    />
    <HvCardMedia
      component="img"
      alt="madeira island"
      height={240}
      image="https://lumada-design.github.io/assets/madeira.webp"
    />
    <HvCardContent>
      <HvTypography variant="body" className="mt-xs">
        Not just an island, but a sanctuary of rugged cliffs, the resilience of
        volcanic landscapes, the vibrancy of lush forests, the tenacity of life,
        and the serene embrace of the Atlantic Ocean.
      </HvTypography>
    </HvCardContent>

    <HvActionBar>
      <HvCheckBox
        value="value"
        inputProps={{
          "aria-label": "Tick to select the wilted and scorched leaves card.",
        }}
      />
      <HvToggleButton
        defaultSelected
        aria-label="Star"
        className="text-warningDeep"
        selectedIcon={<FavoriteSelected />}
        notSelectedIcon={<Favorite />}
      />
      <div style={{ flex: 1 }} />
      <HvButton variant="secondaryGhost" startIcon={<Share />}>
        Share
      </HvButton>
    </HvActionBar>
  </HvCard>
);

/** Client-side paginated HvTable with bulk actions */
const Table = () => {
  const [data, setData] = useState(() => makeData(64));

  const table = useHvTable<AssetEvent>(
    { data, stickyHeader: true },
    useHvTableSticky,
    useHvPagination,
    useHvRowSelection,
    useHvBulkActions,
  );

  const handleAction = (evt: React.SyntheticEvent, action: HvActionGeneric) => {
    const selected = table.selectedFlatRows.map((el) => el.original);

    switch (action.id) {
      case "duplicate": {
        const newEls = selected.map((el) => ({
          ...el,
          id: `${el.id}-copy`,
          name: `${el.name}-copy`,
        }));
        setData([...data, ...newEls]);
        break;
      }
      case "delete": {
        const selectedIds = selected.map((el) => el.id);
        table.toggleAllRowsSelected?.(false);
        setData(data.filter((el) => !selectedIds.includes(el.id)));
        break;
      }
      case "lock":
      case "preview":
      default:
        break;
    }
  };

  return (
    <>
      <HvBulkActions
        {...table.getHvBulkActionsProps?.()}
        maxVisibleActions={1}
        onAction={handleAction}
        actions={[
          { id: "duplicate", label: "Duplicate", icon: <Duplicate /> },
          { id: "delete", label: "Delete", icon: <Delete /> },
          { id: "lock", label: "Lock", icon: <Lock /> },
          { id: "preview", label: "Preview", icon: <Preview /> },
        ]}
      />
      <HvTableContainer className="max-h-400px">
        <HvTable {...table.getTableProps()}>
          <HvTableHead {...table.getTableHeadProps?.()}>
            {table.headerGroups.map((headerGroup) => (
              <HvTableRow
                {...headerGroup.getHeaderGroupProps()}
                key={headerGroup.getHeaderGroupProps().key}
              >
                {headerGroup.headers.map((col) => (
                  <HvTableHeader
                    {...col.getHeaderProps()}
                    key={col.getHeaderProps().key}
                  >
                    {col.render("Header")}
                  </HvTableHeader>
                ))}
              </HvTableRow>
            ))}
          </HvTableHead>
          <HvTableBody {...table.getTableBodyProps()}>
            {table.page?.length ? (
              table.page.map((row) => {
                table.prepareRow(row);
                const { key, ...rowProps } = row.getRowProps();

                return (
                  <HvTableRow key={key} {...rowProps}>
                    {row.cells.map((cell) => (
                      <HvTableCell
                        {...cell.getCellProps()}
                        key={cell.getCellProps().key}
                      >
                        {cell.render("Cell")}
                      </HvTableCell>
                    ))}
                  </HvTableRow>
                );
              })
            ) : (
              <HvTableRow>
                <HvTableCell colSpan={100} style={{ height: 96 }}>
                  <HvEmptyState message="No data to display." icon={<Ban />} />
                </HvTableCell>
              </HvTableRow>
            )}
          </HvTableBody>
        </HvTable>
      </HvTableContainer>
      {table.page?.length > 0 && (
        <HvPagination {...table.getHvPaginationProps?.()} />
      )}
    </>
  );
};

/**
 * Hero component containing a showcase of the UI Kit components
 */
export const Component = () => {
  return (
    <HvGrid container>
      <HvGrid item xs={12}>
        <HvGlobalActions
          variant="global"
          title="UI Kit Component Library"
          backButton={
            <HvIconButton title="Back">
              <Backwards />
            </HvIconButton>
          }
        >
          <HvButton startIcon={<Cloud />}>Publish</HvButton>
        </HvGlobalActions>
      </HvGrid>

      <HvGrid item xs={12}>
        <HvBreadCrumb
          aria-label="Navigation"
          url="https://lumada-design.github.io/uikit-app/master/templates/welcome"
        />
      </HvGrid>
      <HvGrid item xs={12} sm={6} lg={4}>
        <Panel1 />
      </HvGrid>
      <HvGrid item xs={12} sm={6} lg={4}>
        <Panel2 />
      </HvGrid>
      <HvGrid item xs={12} sm={6} lg={4}>
        <HvTableSection>
          <Table />
        </HvTableSection>
      </HvGrid>
      <HvGrid item xs={12} sm={6} lg={4}>
        <Card1 />
      </HvGrid>
    </HvGrid>
  );
};
