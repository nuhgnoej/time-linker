import { SUPABASE_API_URL } from "@/config/config";
import { useAuth } from "@/lib/Auth-context";
import { useRouter } from "expo-router";
import { Button, StyleSheet, Text, View } from "react-native";

export default function HomeScreen() {
  const { user, profile, accessToken, isLoading } = useAuth();
  const router = useRouter();

  // console.log(`config.ts says done! ${SUPABASE_API_URL}`);
  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text>🔄 로그인 상태 확인 중...</Text>
      </View>
    );
  }

  if (!user) {
    return (
      <View style={styles.container}>
        <Text>🙅 로그인되지 않았습니다.</Text>
        <Button title="로그인으로" onPress={() => router.push("/login")} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>👋 환영합니다!</Text>
      <Text style={styles.label}>이메일: {user.email}</Text>
      <Text style={styles.label}>UID: {user.id}</Text>
      {profile && profile.displayName && (
        <Text style={styles.label}>닉네임: {profile.displayName}</Text>
      )}
      <Text style={styles.token}>
        (AccessToken 일부): {accessToken?.slice(0, 16)}...
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    fontWeight: "bold",
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
  },
  token: {
    marginTop: 20,
    fontSize: 12,
    color: "gray",
  },
});
