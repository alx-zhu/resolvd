import type { Connection } from "@/types/goals";
import { simulateApiCall } from "./client";
import { mockConnections } from "@/data/mockData";

const CONNECTIONS_STORAGE_KEY = "goals-app:connections";

const initializeStorage = (): void => {
  if (!localStorage.getItem(CONNECTIONS_STORAGE_KEY)) {
    localStorage.setItem(
      CONNECTIONS_STORAGE_KEY,
      JSON.stringify(mockConnections)
    );
  }
};

const getConnectionsFromStorage = (): Connection[] => {
  initializeStorage();
  const stored = localStorage.getItem(CONNECTIONS_STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
};

const saveConnectionsToStorage = (connections: Connection[]): void => {
  localStorage.setItem(
    CONNECTIONS_STORAGE_KEY,
    JSON.stringify(connections)
  );
};

/**
 * Fetch all connections
 */
export const fetchConnections = async (): Promise<Connection[]> => {
  const connections = getConnectionsFromStorage();
  return simulateApiCall(connections);
};

/**
 * Fetch connections for a user
 */
export const fetchUserConnections = async (
  userId: string
): Promise<Connection[]> => {
  const connections = getConnectionsFromStorage();
  const userConnections = connections.filter(
    (c) => c.user_id_1 === userId || c.user_id_2 === userId
  );
  return simulateApiCall(userConnections);
};

/**
 * Create a connection request
 */
export const createConnection = async (
  userId1: string,
  userId2: string
): Promise<Connection> => {
  const connections = getConnectionsFromStorage();

  // Check if connection already exists
  const existing = connections.find(
    (c) =>
      (c.user_id_1 === userId1 && c.user_id_2 === userId2) ||
      (c.user_id_1 === userId2 && c.user_id_2 === userId1)
  );

  if (existing) {
    throw new Error("Connection already exists");
  }

  const connection: Connection = {
    user_id_1: userId1,
    user_id_2: userId2,
    status: "pending",
    created_at: new Date().toISOString(),
  };

  const updatedConnections = [...connections, connection];
  saveConnectionsToStorage(updatedConnections);

  return simulateApiCall(connection);
};

/**
 * Accept a connection request
 */
export const acceptConnection = async (
  userId1: string,
  userId2: string
): Promise<Connection> => {
  const connections = getConnectionsFromStorage();

  const updatedConnections = connections.map((c) =>
    (c.user_id_1 === userId1 && c.user_id_2 === userId2) ||
    (c.user_id_1 === userId2 && c.user_id_2 === userId1)
      ? { ...c, status: "accepted" as const }
      : c
  );

  saveConnectionsToStorage(updatedConnections);

  const updatedConnection = updatedConnections.find(
    (c) =>
      (c.user_id_1 === userId1 && c.user_id_2 === userId2) ||
      (c.user_id_1 === userId2 && c.user_id_2 === userId1)
  );

  if (!updatedConnection) throw new Error("Connection not found");

  return simulateApiCall(updatedConnection);
};

/**
 * Delete a connection
 */
export const deleteConnection = async (
  userId1: string,
  userId2: string
): Promise<void> => {
  const connections = getConnectionsFromStorage();

  const updatedConnections = connections.filter(
    (c) =>
      !((c.user_id_1 === userId1 && c.user_id_2 === userId2) ||
        (c.user_id_1 === userId2 && c.user_id_2 === userId1))
  );

  saveConnectionsToStorage(updatedConnections);

  return simulateApiCall(undefined);
};

/**
 * Get friend IDs for a user (accepted connections only)
 */
export const getFriendIds = async (userId: string): Promise<string[]> => {
  const connections = await fetchUserConnections(userId);
  const friendIds = connections
    .filter((c) => c.status === "accepted")
    .map((c) => (c.user_id_1 === userId ? c.user_id_2 : c.user_id_1));
  return friendIds;
};
