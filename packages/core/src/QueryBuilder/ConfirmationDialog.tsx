import { HvButton, type HvButtonProps } from "../Button";
import {
  HvDialog,
  HvDialogActions,
  HvDialogContent,
  HvDialogTitle,
  type HvDialogProps,
} from "../Dialog";

export interface ConfirmationDialogProps extends HvDialogProps {
  title?: string;
  message?: string;
  onConfirm?: HvButtonProps["onClick"];
  onCancel?: () => void;
  confirmButtonLabel?: string;
  cancelButtonLabel?: string;
}

export const ConfirmationDialog = ({
  title,
  message,
  onConfirm,
  onCancel,
  confirmButtonLabel,
  cancelButtonLabel,
  ...others
}: ConfirmationDialogProps) => {
  const handleClose: HvDialogProps["onClose"] = (_, reason) => {
    if (reason !== "backdropClick") {
      onCancel?.();
    }
  };

  return (
    <HvDialog onClose={handleClose} {...others}>
      <HvDialogTitle variant="warning" showIcon={false}>
        {title}
      </HvDialogTitle>
      <HvDialogContent indentContent>{message}</HvDialogContent>
      <HvDialogActions>
        <HvButton variant="primaryGhost" onClick={onConfirm}>
          {confirmButtonLabel}
        </HvButton>
        <HvButton autoFocus variant="primaryGhost" onClick={onCancel}>
          {cancelButtonLabel}
        </HvButton>
      </HvDialogActions>
    </HvDialog>
  );
};
