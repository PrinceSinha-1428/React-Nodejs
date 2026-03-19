import { createContext, useContext, useState, type PropsWithChildren } from "react";



interface SideBarContextTypes{

   isSideBarOpen: boolean;
   setSidebar: () => void;

}


const SidebarContext = createContext<SideBarContextTypes>({
   isSideBarOpen: false,
   setSidebar: () => {},
});


export const SideBarContextProvider = ({ children }: PropsWithChildren) => {

   const [isSideBarOpen, setIsSideBarOpen] = useState<boolean>(false);
   const setSidebar = () => setIsSideBarOpen(!isSideBarOpen);


   const value: SideBarContextTypes = {
      isSideBarOpen, setSidebar,
   }

   return (
      <SidebarContext.Provider value={value}>
         {children}
      </SidebarContext.Provider>
   )
}

export const useSidebar = () => useContext(SidebarContext)