import { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_KEY, SUPABASE_API_URL } from "@/config/config";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

type SupabaseAuthUser = {
  id: string;
  email: string;
  createdAt?: string;
};

type UserProfile = {
  id: string;
  displayName?: string;
  avatar_url?: string;
};

type AuthContextType = {
  user: SupabaseAuthUser | null;
  profile: UserProfile | null;
  accessToken: string | null;
  isLoading: boolean;
  logIn: (accessToken: string, email: string, id: string) => Promise<void>;
  logOut: () => Promise<void>;
};

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<SupabaseAuthUser | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const restoreSession = async () => {
      try {
        const storedToken = await AsyncStorage.getItem("access_token");
        const storedEmail = await AsyncStorage.getItem("user_email");
        const storedId = await AsyncStorage.getItem("user_id");

        if (storedToken && storedEmail && storedId) {
          await logIn(storedToken, storedEmail, storedId);
        }
      } catch (e) {
        console.warn("세션 복구 실패", e);
      } finally {
        setIsLoading(false);
      }
    };

    restoreSession();
  }, []);

  const logIn = async (
    accessToken: string,
    email: string,
    id: string
  ): Promise<void> => {
    setAccessToken(accessToken);
    setUser({ id, email });

    await AsyncStorage.setItem("access_token", accessToken);
    await AsyncStorage.setItem("user_email", email);
    await AsyncStorage.setItem("user_id", id);

    // ✅ 프로필 불러오기
    try {
      const res = await fetch(
        `${SUPABASE_API_URL}/rest/v1/profiles?user_id=eq.${id}`,
        {
          headers: {
            apikey: API_KEY || "",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        setProfile(data[0]);
      } else {
        setProfile(null);
      }
    } catch (e) {
      console.warn("프로필 가져오기 실패", e);
    }
  };

  const logOut = async () => {
    setAccessToken(null);
    setUser(null);
    setProfile(null);

    await AsyncStorage.multiRemove(["access_token", "user_email", "user_id"]);
  };

  return (
    <AuthContext.Provider
      value={{ user, profile, accessToken, isLoading, logIn, logOut }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
