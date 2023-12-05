import { Pressable, Text, View } from "react-native";
import SignUpForm from "./SignUpForm";
import SignInForm from "./SignInForm";
import { useState } from "react";

function AuthenticationCard() {
  const [needsNewAccount, setNeedsNewAccount] = useState(false);

  return (
    <View className="rounded border border-gray-100 bg-white p-5 shadow">
      {needsNewAccount ? <SignUpForm /> : <SignInForm />}

      <Pressable
        onPress={() => setNeedsNewAccount((prev) => !prev)}
        className="mt-2.5"
      >
        <Text className="self-center font-normal text-gray-500">
          {!needsNewAccount
            ? "No Account? Sign Up"
            : "Have an Account? Sign In"}
        </Text>
      </Pressable>
    </View>
  );
}

export default AuthenticationCard;
