import {
    createContext,
    useContext,
    useEffect,
    useState,
    type PropsWithChildren,
} from "react";

import { loadRequests, saveRequests } from "@/storage/requests-storage";
import type { RequestInput, ServiceRequest } from "@/types/request";

type RequestsContextValue = {
  requests: ServiceRequest[];
  loading: boolean;
  addRequest: (input: RequestInput) => void;
  updateRequest: (id: string, input: RequestInput) => void;
  deleteRequest: (id: string) => void;
};

const RequestsContext = createContext<RequestsContextValue | null>(null);

export function RequestsProvider({ children }: PropsWithChildren) {
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [loading, setLoading] = useState(true);

  // READ: load once when the app starts
  useEffect(() => {
    loadRequests().then((saved) => {
      setRequests(saved);
      setLoading(false);
    });
  }, []);

  // PERSIST: save whenever the list changes (but not before the first load finishes)
  useEffect(() => {
    if (!loading) saveRequests(requests);
  }, [requests, loading]);

  // CREATE
  const addRequest = (input: RequestInput) => {
    const newRequest: ServiceRequest = {
      ...input,
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      createdAt: new Date().toISOString(),
    };
    setRequests((current) => [newRequest, ...current]);
  };

  // UPDATE
  const updateRequest = (id: string, input: RequestInput) => {
    setRequests((current) =>
      current.map((r) => (r.id === id ? { ...r, ...input } : r)),
    );
  };

  // DELETE
  const deleteRequest = (id: string) => {
    setRequests((current) => current.filter((r) => r.id !== id));
  };

  return (
    <RequestsContext.Provider
      value={{ requests, loading, addRequest, updateRequest, deleteRequest }}
    >
      {children}
    </RequestsContext.Provider>
  );
}

export function useRequests() {
  const value = useContext(RequestsContext);
  if (!value)
    throw new Error("useRequests must be used inside RequestsProvider");
  return value;
}
