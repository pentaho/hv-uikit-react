import type { HvColor } from "@hitachivantara/uikit-react-core";

export type Column = {
  id: string;
  title: string;
  color?: HvColor;
  icon?: React.ReactNode;
};

export type User = {
  name: string;
  avatar: string;
};

export type Task = {
  id: string;
  columnId: Column["id"];
  title: string;
  users?: User[];
  statusLevel?: number;
};
