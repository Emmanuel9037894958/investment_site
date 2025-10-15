"use client";

import { createContext, useContext, useState } from "react";

const ClientContext = createContext(null);

export const ClientProvider = ({ children }) => {
  const [client, setClient] = useState(null);

  return (
    <ClientContext.Provider value={{ client, setClient }}>
      {children}
    </ClientContext.Provider>
  );
};

export const useClient = () => {
  const context = useContext(ClientContext);
  if (!context) {
    throw new Error("useClient must be used within a ClientProvider");
  }
  return context;
};

export default ClientContext;
