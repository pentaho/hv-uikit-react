import { useHvAppShellModel } from "@hitachivantara/app-shell-shared";
import { HvHeaderActions } from "@hitachivantara/uikit-react-core";

import DynamicAction from "./DynamicAction";
import InternalAction, {
  internalActions,
} from "./InternalActions/InternalAction/InternalAction";

const HeaderActions = () => {
  const { header } = useHvAppShellModel();

  return (
    <HvHeaderActions>
      {header?.actions.map((action) => {
        const Component = internalActions.some(
          (a) => a.bundle === action.bundle,
        )
          ? InternalAction
          : DynamicAction;

        return (
          <Component
            key={action.key}
            bundle={action.bundle}
            {...action.config}
          />
        );
      })}
    </HvHeaderActions>
  );
};

export default HeaderActions;
