import type { User } from "@/types/goals";
import { simulateApiCall } from "./client";
import { mockUsers } from "@/data/mockData";

const USERS_STORAGE_KEY = "goals-app:users";
const CURRENT_USER_KEY = "goals-app:current-user";

const initializeStorage = (): void => {
  if (!localStorage.getItem(USERS_STORAGE_KEY)) {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(mockUsers));
  }
  if (!localStorage.getItem(CURRENT_USER_KEY)) {
    localStorage.setItem(CURRENT_USER_KEY, mockUsers[0].id);
  }
};

const getUsersFromStorage = (): User[] => {
  initializeStorage();
  const stored = localStorage.getItem(USERS_STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
};

/**
 * Fetch all users
 */
export const fetchUsers = async (): Promise<User[]> => {
  const users = getUsersFromStorage();
  return simulateApiCall(users);
};

/**
 * Fetch user by ID
 */
export const fetchUserById = async (userId: string): Promise<User | null> => {
  const users = getUsersFromStorage();
  const user = users.find((u) => u.id === userId);
  return simulateApiCall(user || null);
};

/**
 * Fetch user by email
 */
export const fetchUserByEmail = async (
  email: string
): Promise<User | null> => {
  const users = getUsersFromStorage();
  const user = users.find((u) => u.email === email);
  return simulateApiCall(user || null);
};

/**
 * Get current user ID
 */
export const getCurrentUserId = (): string => {
  initializeStorage();
  return localStorage.getItem(CURRENT_USER_KEY) || mockUsers[0].id;
};

/**
 * Set current user ID
 */
export const setCurrentUserId = (userId: string): void => {
  localStorage.setItem(CURRENT_USER_KEY, userId);
};

/**
 * Fetch current user
 */
export const fetchCurrentUser = async (): Promise<User> => {
  const userId = getCurrentUserId();
  const user = await fetchUserById(userId);
  if (!user) throw new Error("Current user not found");
  return user;
};
