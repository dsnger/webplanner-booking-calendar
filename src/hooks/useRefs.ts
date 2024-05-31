import RefsContext, { RefsContextProps } from "@/context/RefsContext";
import { useContext } from "react";

export const useRefs = (): RefsContextProps => {
  const context = useContext(RefsContext);
  if (!context) {
    throw new Error('useRefs must be used within a RefProvider');
  }
  return context;
};
