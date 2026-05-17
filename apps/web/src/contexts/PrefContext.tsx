import { createContext, useContext, useEffect, useState } from "react";

export type Server = {
  ip: string;
  port: number;
};

export type Prefs = {
  servers: Server[];
};

type PrefContextType = {
  prefs: Prefs;
  setPref: (key: string, value: any) => void;
  getPref: (key: string) => any;
  addServer: (server: Server) => void;
  getServers: () => Server[];
  servers: Server[];
};

const defaultPrefs = {
  servers: [],
};

const PrefContext = createContext<PrefContextType>({
  prefs: defaultPrefs,
  setPref: () => {},
  getPref: () => {},
  addServer: () => {},
  getServers: () => [],
  servers: [],
});

export const usePref = () => {
  const context = useContext(PrefContext);
  if (!context) {
    throw new Error("usePref must be used within an PrefProvider");
  }
  return context;
};

export const PrefProvider = ({ children }: { children: React.ReactNode }) => {
  const [prefs, setPrefs] = useState<Prefs>(defaultPrefs);

  const setPref = (key: string, value: any) => {
    const newPrefs = { ...prefs, [key]: value };
    localStorage.setItem("eu-prefs", JSON.stringify(newPrefs));
    setPrefs(newPrefs);
  };

  const getPref = (key: string) => {
    return prefs[key];
  };

  const addServer = (server: Server) => {
    const newServers = [...prefs.servers, server];
    setPref("servers", newServers);
  };

  const getServers = () => {
    return prefs.servers;
  };

  useEffect(() => {
    const savedPrefs = localStorage.getItem("eu-prefs");
    console.log("savedPrefs", savedPrefs);
    if (savedPrefs) {
      setPrefs(JSON.parse(savedPrefs));
    } else {
      localStorage.setItem("eu-prefs", JSON.stringify(defaultPrefs));
    }
  }, []);

  return (
    <PrefContext.Provider
      value={{
        prefs,
        setPref,
        getPref,
        addServer,
        getServers,
        servers: prefs.servers,
      }}
    >
      {children}
    </PrefContext.Provider>
  );
};
