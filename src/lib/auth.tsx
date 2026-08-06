import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type Role = "admin" | "engineer" | "operator";

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
}

export const DEMO_USERS: (User & { password: string; description: string })[] = [
  {
    id: "u-admin",
    name: "Ava Reyes",
    email: "admin@sentinel.pdx",
    role: "admin",
    password: "demo",
    description: "Full access. Manage users and assign roles.",
  },
  {
    id: "u-eng",
    name: "R. Engineer",
    email: "engineer@sentinel.pdx",
    role: "engineer",
    password: "demo",
    description: "Operational access including dataset uploads.",
  },
  {
    id: "u-ops",
    name: "M. Operator",
    email: "operator@sentinel.pdx",
    role: "operator",
    password: "demo",
    description: "View-only access to telemetry and alerts.",
  },
];

const STORAGE_KEY = "sentinel-auth";
const USERS_KEY = "sentinel-users";

interface AuthContextValue {
  user: User | null;
  users: User[];
  login: (email: string, password: string) => { ok: boolean; error?: string };
  logout: () => void;
  addUser: (u: Omit<User, "id">) => { ok: boolean; error?: string };
  updateRole: (id: string, role: Role) => void;
  can: (perm: "datasets" | "manageUsers" | "mutate") => boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function loadUsers(): User[] {
  if (typeof window === "undefined") return DEMO_USERS.map(({ password, description, ...u }) => u);
  try {
    const raw = window.localStorage.getItem(USERS_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return DEMO_USERS.map(({ password, description, ...u }) => u);
}

function loadUser(): User | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>(() => DEMO_USERS.map(({ password, description, ...u }) => u));
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setUsers(loadUsers());
    setUser(loadUser());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(USERS_KEY, JSON.stringify(users));
  }, [users, hydrated]);

  const login = (email: string, password: string) => {
    const match = DEMO_USERS.find(
      (u) => u.email.toLowerCase() === email.trim().toLowerCase() && u.password === password,
    );
    if (!match) return { ok: false as const, error: "Invalid email or password." };
    // ensure this demo user exists in the users list
    setUsers((prev) => (prev.find((u) => u.id === match.id) ? prev : [...prev, { id: match.id, name: match.name, email: match.email, role: match.role }]));
    const u: User = { id: match.id, name: match.name, email: match.email, role: match.role };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(u));
    setUser(u);
    return { ok: true as const };
  };

  const logout = () => {
    window.localStorage.removeItem(STORAGE_KEY);
    setUser(null);
  };

  const addUser: AuthContextValue["addUser"] = (u) => {
    if (!u.email || !u.name) return { ok: false, error: "Name and email are required." };
    if (users.some((x) => x.email.toLowerCase() === u.email.toLowerCase()))
      return { ok: false, error: "A user with that email already exists." };
    setUsers((prev) => [...prev, { ...u, id: `u-${Math.random().toString(36).slice(2, 8)}` }]);
    return { ok: true };
  };

  const updateRole = (id: string, role: Role) => {
    setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, role } : u)));
    if (user?.id === id) {
      const next = { ...user, role };
      setUser(next);
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    }
  };

  const can: AuthContextValue["can"] = (perm) => {
    if (!user) return false;
    if (user.role === "admin") return true;
    if (perm === "datasets") return user.role === "engineer";
    if (perm === "manageUsers") return false;
    if (perm === "mutate") return user.role === "engineer";
    return false;
  };

  return (
    <AuthContext.Provider value={{ user, users, login, logout, addUser, updateRole, can }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

export const roleLabel: Record<Role, string> = {
  admin: "Administrator",
  engineer: "Engineer",
  operator: "Operator",
};
