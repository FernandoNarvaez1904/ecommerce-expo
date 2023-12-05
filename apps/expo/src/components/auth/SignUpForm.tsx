import { Controller, useForm } from "react-hook-form";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import TextInput from "../core/TextInput";
import { useSignUp } from "@clerk/clerk-expo";
import { useState } from "react";
import BannerError from "../core/BannerError";

const signUpFormValidator = z.object({
  email: z.string().email(),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export type SignUpFormSchema = Zod.infer<typeof signUpFormValidator>;

function SignUpForm() {
  const { control, handleSubmit, setError, formState } =
    useForm<SignUpFormSchema>({
      resolver: zodResolver(signUpFormValidator),
      mode: "onBlur",
    });
  const { signUp, setActive } = useSignUp();
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = handleSubmit(async (vals) => {
    if (!signUp) return;
    setIsLoading(true);

    try {
      const result = await signUp.create({
        emailAddress: vals.email,
        password: vals.password,
      });

      if (result?.status === "missing_requirements") {
        alert("mising");
      }

      if (result?.status === "complete") {
        setActive({ session: result.createdSessionId });
      }
    } catch (err) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      setError("root", { message: err.errors[0].message });
    }
    setIsLoading(false);
  });

  return (
    <View>
      <Text className="mb-2.5 self-center text-lg font-medium">Sign Up</Text>

      {formState.errors.root && (
        <BannerError
          className="mb-2.5"
          error={formState.errors.root?.message}
        />
      )}

      <View className="mb-2.5">
        <Text>Email</Text>
        <Controller
          control={control}
          name="email"
          render={({ field: { onBlur, onChange, value } }) => (
            <TextInput
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              placeholder="nuevopepito@gmail.com"
              error={formState.errors.email?.message}
              autoCapitalize="none"
              textContentType="emailAddress"
              keyboardType="email-address"
            />
          )}
        />
      </View>

      <View className="mb-2.5">
        <Text>Password</Text>
        <Controller
          control={control}
          name="password"
          render={({ field: { onBlur, onChange, value } }) => (
            <TextInput
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              placeholder="******"
              error={formState.errors.password?.message}
              secureTextEntry
              autoCapitalize="none"
              textContentType="password"
            />
          )}
        />
      </View>

      <TouchableOpacity
        className="m-0 rounded bg-sky-500 p-2 "
        onPress={onSubmit}
      >
        {isLoading ? (
          <ActivityIndicator color={"white"} className="self-center" />
        ) : (
          <Text className="self-center font-medium text-white">
            Create New Account
          </Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

export default SignUpForm;
