import { View } from "@/components/Themed";
import { Text, TextInput } from "react-native";

export default function LoginScreen() {
  return (
    <View>
      <Text>로그인 화면</Text>
      <TextInput placeholder="ID" />
      <TextInput placeholder="PW" />
    </View>
  );
}
