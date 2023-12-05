import { SignedIn, SignedOut, useAuth } from "@clerk/clerk-expo";
import { Text, View, TouchableOpacity } from "react-native";
import AuthenticationCard from "../components/auth/AuthenticationCard";

function ProfileScreen() {
  const { signOut } = useAuth();

  return (
    <View className="h-full justify-center px-10">
      <SignedOut>
        <AuthenticationCard />
      </SignedOut>
      <SignedIn>
        <TouchableOpacity onPress={() => signOut()}>
          <Text>Sign Out</Text>
        </TouchableOpacity>
      </SignedIn>
    </View>
  );
}

export default ProfileScreen;
