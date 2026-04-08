import { useCallback, useEffect, useState } from "react";
import type { UserProfile } from "../types";

interface StoredUser {
  username: string;
  email: string;
  password: string;
  inrBalance: string; // Store as string to preserve bigint
  usdtBalance: string; // Store as string to preserve bigint
}

interface LocalAuthState {
  isAuthenticated: boolean;
  userProfile: UserProfile | null;
  isLoading: boolean;
}

const STORAGE_KEY = "xinpay_users";
const SESSION_KEY = "xinpay_session";
const MIGRATION_KEY = "xinpay_migration_v1";

// Default balance values - INR set to 1000
const DEFAULT_INR_BALANCE = "1000"; // ₹1000.00
const DEFAULT_USDT_BALANCE = "0"; // $0.00

// Cache for stored users to reduce localStorage reads
let usersCache: StoredUser[] | null = null;

export function useLocalAuth() {
  const [authState, setAuthState] = useState<LocalAuthState>({
    isAuthenticated: false,
    userProfile: null,
    isLoading: true,
  });

  // Migration function to update all existing users to INR balance 1000
  const migrateExistingUsers = useCallback(() => {
    // Check if migration already ran
    const migrationDone = localStorage.getItem(MIGRATION_KEY);
    if (migrationDone === "true") {
      return;
    }

    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) {
        // No users to migrate
        localStorage.setItem(MIGRATION_KEY, "true");
        return;
      }

      const users: StoredUser[] = JSON.parse(stored);
      let updated = false;

      // Update all users' INR balance to 1000
      const migratedUsers = users.map((user) => {
        if (user.inrBalance !== DEFAULT_INR_BALANCE) {
          updated = true;
          return {
            ...user,
            inrBalance: DEFAULT_INR_BALANCE,
          };
        }
        return user;
      });

      if (updated) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(migratedUsers));
        usersCache = migratedUsers; // Update cache
      }

      // Mark migration as complete
      localStorage.setItem(MIGRATION_KEY, "true");
    } catch (error) {
      console.error("Migration failed:", error);
    }
  }, []);

  // Optimized: Check for existing session on mount + run migration
  useEffect(() => {
    // Run migration first
    migrateExistingUsers();

    const sessionEmail = localStorage.getItem(SESSION_KEY);
    if (sessionEmail) {
      const users = getStoredUsers();
      const user = users.find((u) => u.email === sessionEmail);
      if (user) {
        setAuthState({
          isAuthenticated: true,
          userProfile: storedUserToProfile(user),
          isLoading: false,
        });
        return;
      }
    }
    setAuthState({
      isAuthenticated: false,
      userProfile: null,
      isLoading: false,
    });
  }, [migrateExistingUsers]);

  const getStoredUsers = useCallback((): StoredUser[] => {
    // Use cache if available
    if (usersCache !== null) {
      return usersCache;
    }

    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      const users = stored ? JSON.parse(stored) : [];
      usersCache = users;
      return users;
    } catch {
      const emptyUsers: StoredUser[] = [];
      usersCache = emptyUsers;
      return emptyUsers;
    }
  }, []);

  const saveUsers = useCallback((users: StoredUser[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
    usersCache = users; // Update cache
  }, []);

  const storedUserToProfile = useCallback(
    (user: StoredUser): UserProfile => ({
      username: user.username,
      email: user.email,
      inrBalance: BigInt(user.inrBalance),
      usdtBalance: BigInt(user.usdtBalance),
    }),
    [],
  );

  const profileToStoredUser = useCallback(
    (profile: UserProfile, password: string): StoredUser => ({
      username: profile.username,
      email: profile.email,
      password,
      inrBalance: profile.inrBalance.toString(),
      usdtBalance: profile.usdtBalance.toString(),
    }),
    [],
  );

  const signup = useCallback(
    (username: string, email: string, password: string): boolean => {
      const users = getStoredUsers();

      // Check if email already exists
      if (users.some((u) => u.email === email)) {
        return false;
      }

      const newUser: StoredUser = {
        username,
        email,
        password,
        inrBalance: DEFAULT_INR_BALANCE,
        usdtBalance: DEFAULT_USDT_BALANCE,
      };

      users.push(newUser);
      saveUsers(users);

      // Auto-login after signup - synchronous state update
      localStorage.setItem(SESSION_KEY, email);
      setAuthState({
        isAuthenticated: true,
        userProfile: storedUserToProfile(newUser),
        isLoading: false,
      });

      return true;
    },
    [getStoredUsers, saveUsers, storedUserToProfile],
  );

  const login = useCallback(
    (email: string, password: string): boolean => {
      const users = getStoredUsers();
      const user = users.find(
        (u) => u.email === email && u.password === password,
      );

      if (!user) {
        return false;
      }

      // Optimized: Synchronous state update for instant feedback
      localStorage.setItem(SESSION_KEY, email);
      setAuthState({
        isAuthenticated: true,
        userProfile: storedUserToProfile(user),
        isLoading: false,
      });

      return true;
    },
    [getStoredUsers, storedUserToProfile],
  );

  const logout = useCallback(() => {
    localStorage.removeItem(SESSION_KEY);
    usersCache = null; // Clear cache
    setAuthState({
      isAuthenticated: false,
      userProfile: null,
      isLoading: false,
    });
  }, []);

  const updateProfile = useCallback(
    (updates: Partial<UserProfile>) => {
      if (!authState.userProfile) return;

      const users = getStoredUsers();
      const userIndex = users.findIndex(
        (u) => u.email === authState.userProfile!.email,
      );

      if (userIndex !== -1) {
        const currentUser = users[userIndex];
        const updatedProfile: UserProfile = {
          ...authState.userProfile,
          ...updates,
        };

        users[userIndex] = profileToStoredUser(
          updatedProfile,
          currentUser.password,
        );
        saveUsers(users);

        setAuthState({
          ...authState,
          userProfile: updatedProfile,
        });
      }
    },
    [authState, getStoredUsers, saveUsers, profileToStoredUser],
  );

  return {
    ...authState,
    signup,
    login,
    logout,
    updateProfile,
  };
}
