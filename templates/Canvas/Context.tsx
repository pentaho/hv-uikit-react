import {
  createContext,
  useContext,
  useMemo,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react";

interface SelectedTable {
  id: string;
  label: React.ReactNode;
}

interface CanvasContextValue {
  selectedTable: string;
  setSelectedTable?: Dispatch<SetStateAction<string>>;
  openedTables?: SelectedTable[];
  setOpenedTables?: Dispatch<SetStateAction<SelectedTable[] | undefined>>;
}

const CanvasContext = createContext<CanvasContextValue>({
  selectedTable: "none",
});

interface CanvasProviderProps {
  children?: React.ReactNode;
}

export const CanvasProvider = ({ children }: CanvasProviderProps) => {
  const [openedTables, setOpenedTables] = useState<SelectedTable[]>();
  const [selectedTable, setSelectedTable] = useState<string>("none");

  const value = useMemo(
    () => ({
      openedTables,
      setOpenedTables,
      selectedTable,
      setSelectedTable,
    }),
    [openedTables, selectedTable],
  );

  return (
    <CanvasContext.Provider value={value}>{children}</CanvasContext.Provider>
  );
};

export const useCanvasContext = () => useContext(CanvasContext);
