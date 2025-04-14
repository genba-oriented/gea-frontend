import { createContext, useContext } from "react";
import { Api } from "./Api";

const Context = createContext<Api>(null);

export const ApiProvider = ({
  value,
  children,
}: {
  value: Api
  children: React.ReactNode
}) => {
  return (
    <Context.Provider value={value}>
      {children}
    </Context.Provider>
  )
}

export function useApi() {
  return useContext(Context);
}