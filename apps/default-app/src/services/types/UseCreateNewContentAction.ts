export type CreateNewContentAction = {
  id: string;
  ordinal?: number;
  label: string;
  icon?: React.ReactNode;
  onAction: () => void;
};

export type UseCreateNewContentAction = () =>
  | CreateNewContentAction
  | undefined;
