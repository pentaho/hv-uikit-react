import { Suspense, useState } from "react";
import { css } from "@emotion/css";
import {
  HvButton,
  HvGlobalActions,
  HvGrid,
  HvLoading,
  theme,
  type HvGlobalActionsProps,
  type HvGridProps,
} from "@hitachivantara/uikit-react-core";

import { KPIs } from "./KPIs";
import { Properties } from "./Properties";
import { Table } from "./Table";

const MODEL_ID = "123";

interface SectionProps extends HvGridProps {
  variant?: HvGlobalActionsProps["variant"];
  actions?: React.ReactNode;
  component?: React.ElementType;
}

const Section = ({
  title,
  variant = "section",
  component = "section",
  actions,
  ...others
}: SectionProps) => (
  <>
    {title && (
      <HvGlobalActions variant={variant} title={title}>
        {actions}
      </HvGlobalActions>
    )}
    <Suspense fallback={<HvLoading className={css({ minHeight: 200 })} />}>
      <HvGrid
        container
        component={component}
        className={css({
          marginTop: 0, // avoid collapse
          marginBottom: theme.space.md,
        })}
        {...others}
      />
    </Suspense>
  </>
);

const DetailsView = () => {
  const [editing, setEditing] = useState(false);

  const actions = editing ? (
    <span>
      <HvButton type="submit" form="properties" variant="primaryGhost">
        Save
      </HvButton>
      <HvButton variant="secondaryGhost" onClick={() => setEditing(false)}>
        Cancel
      </HvButton>
    </span>
  ) : (
    <HvButton variant="primaryGhost" onClick={() => setEditing(true)}>
      Edit
    </HvButton>
  );

  return (
    <>
      <Section title="Asset Details" variant="global">
        <KPIs />
      </Section>

      <Section
        id="properties"
        title="Asset Properties"
        actions={actions}
        component={editing ? "form" : "section"}
        onSubmit={(evt) => {
          evt.preventDefault();
          const formData = new FormData(evt.currentTarget as any);
          console.log(Object.fromEntries(formData.entries()));
          setEditing(false);
        }}
      >
        <Properties editMode={editing} />
      </Section>

      <Section title="Events">
        <HvGrid item xs={12}>
          <Table modelId={MODEL_ID} />
        </HvGrid>
      </Section>
    </>
  );
};

export { DetailsView as Component };

export default DetailsView;
