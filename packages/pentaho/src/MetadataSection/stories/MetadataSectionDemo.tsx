import {
  HvButton,
  HvIconButton,
  HvIconContainer,
  HvStatusIcon,
  HvTag,
  HvTypography,
} from "@hitachivantara/uikit-react-core";
import {
  MetadataContainer,
  MetadataHighlight,
  MetadataSection,
  type MetadataHighlightProps,
} from "@hitachivantara/uikit-react-pentaho";

export default function MetadataDemo() {
  return (
    <MetadataContainer>
      <MetadataSection>
        <div className="flex items-center gap-xs">
          <HvStatusIcon customIcon={<div className="i-ph-user" />} />
          <div className="flex items-center gap-xxs flex-wrap">
            <HvTypography variant="label">Section title</HvTypography>
            <HvTypography className="text-textSubtle">
              This is a description
            </HvTypography>
          </div>
        </div>
      </MetadataSection>
      <MetadataSection variant="grid">
        <MetadataHighlight
          icon={<div className="i-ph-warning-octagon-duotone text-negative" />}
          label="Low"
          value="Quality"
        />
        <MetadataHighlight
          icon={<div className="i-ph-warning-diamond-duotone text-negative" />}
          label="High"
          value="Sensitivity"
        />
        <MetadataHighlight
          icon={<div className="i-ph-seal-check-duotone text-accent" />}
          label="Verified"
          value="Lineage"
        />
        <MetadataHighlight
          icon={<div className="i-ph-shield-check-duotone text-positive" />}
          label="Trusted"
          value="Data"
        />
      </MetadataSection>
      <MetadataSection>⭐️⭐️⭐️</MetadataSection>
      <MetadataSection>A section with custom content</MetadataSection>
      <MetadataSection variant="grid">
        <MetaHighlightRow
          icon={<div className="i-ph-user-list" />}
          label="Users"
          value="27"
        />
        <MetaHighlightRow
          icon={<div className="i-ph-git-pull-request" />}
          label="Requests"
          value="27"
        />
        <MetaHighlightRow
          icon={<div className="i-ph-layout" />}
          label="Environment"
          value="Production"
        />
      </MetadataSection>
      <MetadataSection
        expandable
        title="Section"
        actions={<HvButton variant="secondarySubtle">Action</HvButton>}
      >
        Expandable Content
      </MetadataSection>
      <MetadataSection
        expandable
        title="Metadata Section"
        variant="grid"
        classes={{ content: "[&>div>*]:flex-basis-full" }}
      >
        <MetaLabelValue
          label="User"
          value={<HvTag icon={<MicroAvatar name="JD" />} label="John Doe" />}
        />
        <MetaLabelValue
          label="Creation date"
          value={formatDate(new Date("2024-05-06"))}
        />
        <MetaLabelValue label="AssetId" value="2026-q1-prod-123" />
        <MetaLabelValue label="Simple List" value="ROI, RetInv" />
        <MetaLabelValue
          label="Tags List"
          value={<TagsList items={range(4).map((i) => `Tag ${i + 1}`)} />}
        />
        <ScrollableMetaLabelValue
          label="Extensive Tags List"
          value={
            <ScrollableTagsList items={range(8).map((i) => `Tag ${i + 1}`)} />
          }
        />
        <MetaLabelValue
          label="Website"
          value={
            <HvTypography link component="a" href="#">
              pentaho/psc-common-ui/master
            </HvTypography>
          }
        />
        <MetaLabelValue
          label="Description"
          value="This is the description of the assetId. It's very long and descriptive, therefore it will overflow and wrap to the next few lines."
        />
      </MetadataSection>
      <MetadataSection
        storageId="sb-demo-terms"
        title="Business Terms"
        actions={
          <HvIconButton title="Edit" variant="secondarySubtle">
            <HvIconContainer>
              <div className="i-ph-plus" />
            </HvIconContainer>
          </HvIconButton>
        }
      >
        <div className="flex flex-wrap gap-xxs">
          {range(11).map((i) => (
            <HvTag onDelete={() => {}} key={i} label={`Term ${i + 1}`} />
          ))}
          <HvTag label="+123" />
        </div>
      </MetadataSection>
    </MetadataContainer>
  );
}

function MetaLabelValue({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex flex-wrap gap-xs justify-between items-center">
      <b>{label}</b>
      <span>{value}</span>
    </div>
  );
}

function ScrollableMetaLabelValue({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex flex-wrap gap-xs justify-between items-center">
      <b className="text-nowrap">{label}</b>
      <span className="overflow-x-auto flex-grow-1 flex-basis-60%">
        {value}
      </span>
    </div>
  );
}

function MetaHighlightRow(props: MetadataHighlightProps) {
  return (
    <MetadataHighlight
      classes={{
        root: "flex-row justify-center p-xxs gap-xxs",
        content: "items-start",
      }}
      {...props}
    />
  );
}

function TagsList({ items }: { items: string[] }) {
  return (
    <div className="flex flex-wrap gap-xxs">
      {items.map((item) => (
        <HvTag key={item} label={item} />
      ))}
    </div>
  );
}

function ScrollableTagsList({ items }: { items: string[] }) {
  return (
    <div className="flex gap-xxs">
      {items.map((item) => (
        <HvTag key={item} label={item} />
      ))}
    </div>
  );
}

function MicroAvatar({ name }: { name: string }) {
  return (
    <div className="grid place-content-center bg-text text-bgContainer size-16px text-7px rounded-full">
      {name}
    </div>
  );
}

function range(number: number) {
  return Array.from({ length: number }, (_, i) => i);
}

function formatDate(date: Date) {
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
