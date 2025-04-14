import { createContext, useContext } from "react";
import { ErrorDialogModel } from "./ErrorDialogModel";

const Context = createContext<ErrorDialogModel>(null);

export const ErrorDialogModelProvider = ({
  value,
  children,
}: {
  value: ErrorDialogModel
  children: React.ReactNode
}) => {
  return (
    <Context.Provider value={value}>
      {children}
    </Context.Provider>
  )
}

export function useErrorDialogModel() {
  return useContext(Context);
}