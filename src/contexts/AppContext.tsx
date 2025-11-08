import React, { createContext, useContext, useState, ReactNode } from 'react';

interface DustCredentials {
  workspaceId: string;
  apiKey: string;
  planningAgentId: string;
  shortAskAgentId: string;
  genericAgentId: string;
}

interface AppState {
  credentials: DustCredentials | null;
  planningResult: string | null;
  originalInput: string | null;
  documentTemplate: string | null;
  setCredentials: (credentials: DustCredentials | null) => void;
  setPlanningResult: (result: string) => void;
  setOriginalInput: (input: string) => void;
  setDocumentTemplate: (template: string | null) => void;
}

const AppContext = createContext<AppState | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [credentials, setCredentials] = useState<DustCredentials | null>(null);
  const [planningResult, setPlanningResult] = useState<string | null>(null);
  const [originalInput, setOriginalInput] = useState<string | null>(null);
  const [documentTemplate, setDocumentTemplate] = useState<string | null>(null);

  return (
    <AppContext.Provider
      value={{
        credentials,
        planningResult,
        originalInput,
        documentTemplate,
        setCredentials,
        setPlanningResult,
        setOriginalInput,
        setDocumentTemplate,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
