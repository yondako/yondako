"use client";

import { createContext, type PropsWithChildren, useContext } from "react";

type DeviceContextType = {
  isDesktop: boolean;
};

const DeviceContext = createContext<DeviceContextType | undefined>(undefined);

export function DeviceProvider({ children, isDesktop }: PropsWithChildren<DeviceContextType>) {
  return <DeviceContext.Provider value={{ isDesktop }}>{children}</DeviceContext.Provider>;
}

export function useDevice() {
  const context = useContext(DeviceContext);

  if (!context) {
    throw new Error("useDevice must be used within a DeviceProvider");
  }

  return context;
}
