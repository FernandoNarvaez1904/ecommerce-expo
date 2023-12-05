import { useSignIn } from "@clerk/clerk-expo";
import { Controller, useForm } from "react-hook-form";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import TextInput from "../core/TextInput";
import { useState } from "react";
import BannerError from "../core/BannerError";

const signInFormValidator = z.object({
  email: z.string().email(),
  password: z.string().min(1, "Password cannot be empty"),
});

export type SignInFormSchema = Zod.infer<typeof signInFormValidator>;

function SignInForm() {
  const { control, handleSubmit, setError, formState } =
    useForm<SignInFormSchema>({
      resolver: zodResolver(signInFormValidator),
      mode: "onBlur",
    });
  const { signIn, setActive } = useSignIn();
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = handleSubmit(async (vals) => {
    if (!signIn) return;
    setIsLoading(true);

    try {
      const result = await signIn.create({
        identifier: vals.email,
        password: vals.password,
      });

      if (result?.status === "complete") {
        setIsLoading(false);
        setActive({ session: result.createdSessionId });
      }
    } catch (err) {
      setIsLoading(false);
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      setError("root", { message: err.errors[0].message });
    }
  });

  return (
    <View>
      <Text className="mb-2.5 self-center text-lg font-medium">Sign In</Text>

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
              placeholder="pepito@gmail.com"
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
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color={"white"} className="self-center" />
        ) : (
          <Text className="self-center font-medium text-white">Sign In</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

export default SignInForm;
