import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { User } from "@supabase/supabase-js";

interface AuthContextType {
  user: User | null;
  isAdmin: boolean;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAdmin: false,
  loading: true,
  signOut: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [adminChecked, setAdminChecked] = useState(false);

  const checkAdmin = async (userId: string) => {
    const { data } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", userId);
    return data?.some((r) => r.role === "admin") ?? false;
  };

  useEffect(() => {
    let currentUserId: string | null = null;

    // Restore session first
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session?.user) {
        currentUserId = session.user.id;
        setUser(session.user);
        const admin = await checkAdmin(session.user.id);
        setIsAdmin(admin);
      }
      setAdminChecked(true);
      setLoading(false);
    });

    // Then listen for changes — only re-check admin when the user actually changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        const nextUserId = session?.user?.id ?? null;
        if (nextUserId === currentUserId) {
          // Same user (token refresh, tab focus, etc.) — don't flip loading/admin state
          if (session?.user) setUser(session.user);
          return;
        }
        currentUserId = nextUserId;
        if (session?.user) {
          setUser(session.user);
          setAdminChecked(false);
          checkAdmin(session.user.id).then((admin) => {
            setIsAdmin(admin);
            setAdminChecked(true);
            setLoading(false);
          });
        } else {
          setUser(null);
          setIsAdmin(false);
          setAdminChecked(true);
          setLoading(false);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ user, isAdmin, loading: loading || !adminChecked, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};
