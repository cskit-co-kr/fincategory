import { createContext, useState, useContext } from "react";

interface IDataContext {
  sideBar: boolean;
  toggleSideBar: (status: boolean) => void;
}

const ActionContext = createContext<IDataContext>({
  sideBar: false,
  toggleSideBar: () => {},
});

export const useData = () => useContext(ActionContext);

export const DataProvider = (props: any) => {
  const [sideBar, setSideBar] = useState(false);

  const toggleSideBar = (status: boolean) => {
    setSideBar(status);
    console.log("context: ", status);
  };

  return (
    <ActionContext.Provider value={{ sideBar, toggleSideBar }}>
      {props.children}
    </ActionContext.Provider>
  );
};
