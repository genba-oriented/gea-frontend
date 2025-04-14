import { createContext, useContext } from "react";
import { LoginUserModel } from "./LoginUserModel";

const Context = createContext<LoginUserModel>(null);

export const LoginUserModelProvider = ({
  value,
  children,
}: {
  value: LoginUserModel
  children: React.ReactNode
}) => {
  return (
    <Context.Provider value={value}>
      {children}
    </Context.Provider>
  )
}

export function useLoginUserModel() {
  return useContext(Context);
}