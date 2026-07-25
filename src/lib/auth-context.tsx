import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from 'react';

type User = {
  name: string;
  phone: string;
};

type AuthContextValue = {
  user: User | null;
  isLoginOpen: boolean;
  /** Runs `action` now if logged in, otherwise opens the login modal and
   * runs `action` right after a successful login. Mirrors the "login only
   * when you try to buy" pattern used by shopping apps. */
  requireAuth: (action: () => void) => void;
  closeLogin: () => void;
  login: (user: User) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

const STORAGE_KEY = 'exphub.user';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as User) : null;
  });
  const [isLoginOpen, setLoginOpen] = useState(false);
  const pendingAction = useRef<(() => void) | null>(null);

  useEffect(() => {
    if (user) localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    else localStorage.removeItem(STORAGE_KEY);
  }, [user]);

  function requireAuth(action: () => void) {
    if (user) {
      action();
      return;
    }
    pendingAction.current = action;
    setLoginOpen(true);
  }

  function closeLogin() {
    setLoginOpen(false);
    pendingAction.current = null;
  }

  function login(newUser: User) {
    setUser(newUser);
    setLoginOpen(false);
    const action = pendingAction.current;
    pendingAction.current = null;
    if (action) action();
  }

  function logout() {
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, isLoginOpen, requireAuth, closeLogin, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
