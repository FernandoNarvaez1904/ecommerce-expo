import { Pressable } from "react-native";
import type { RootStackScreenProps } from "../types/navigation";
import AuthenticationCard from "../components/auth/AuthenticationCard";

function AuthenticationScreenModal({
  navigation,
}: RootStackScreenProps<"Sign In">) {
  return (
    <Pressable
      className="h-full justify-center bg-gray-600 px-2"
      style={{ backgroundColor: "rgba(75, 85, 99, .3)" }}
      onPressOut={() => navigation.pop(1)}
      onPress={(event) => {
        if (event.target == event.currentTarget) {
          navigation.pop(1);
        }
      }}
    >
      <Pressable>
        <AuthenticationCard />
      </Pressable>
    </Pressable>
  );
}

export default AuthenticationScreenModal;
