import React, { ReactNode } from "react";
import "react-native-gesture-handler";

import { ClerkProvider, useUser } from "@clerk/clerk-expo";
import { tokenCache } from "./utils/cache";
import Constants from "expo-constants";
import HomeScreen from "./screens/home";
import { TRPCProvider } from "./utils/trpc";
import { NavigationContainer } from "@react-navigation/native";
import SingleItemScreen from "./screens/single-item";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Provider } from "jotai";
import type { RootStackParamList } from "./types/navigation";
import CreateItemScreen from "./screens/create-item";
import jotaiStore from "./atoms/store";
import UpdateItemScreen from "./screens/update-item";
import AuthenticationScreenModal from "./screens/auth-modal";
import SingleOrderScreen from "./screens/single-order";

const Stack = createNativeStackNavigator<RootStackParamList>();

function App() {
  return (
    <Providers>
      <RootNavigator />
    </Providers>
  );
}

function RootNavigator() {
  const { user, isSignedIn } = useUser();

  return (
    <Stack.Navigator
      screenOptions={{
        headerTintColor: "black",
        animation: "slide_from_bottom",
      }}
    >
      <Stack.Group>
        <Stack.Screen
          name="HomeScreen"
          component={HomeScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen name="SingleItemScreen" component={SingleItemScreen} />
        <Stack.Screen name="Single Order" component={SingleOrderScreen} />

        {user?.publicMetadata.isAdmin && (
          <>
            <Stack.Screen name="Create Item" component={CreateItemScreen} />
            <Stack.Screen name="Update Item" component={UpdateItemScreen} />
          </>
        )}
      </Stack.Group>

      <Stack.Group
        screenOptions={{
          presentation: "transparentModal",
          headerShown: false,
          animation: "fade_from_bottom",
        }}
      >
        {!isSignedIn && (
          <Stack.Screen name="Sign In" component={AuthenticationScreenModal} />
        )}
      </Stack.Group>
    </Stack.Navigator>
  );
}

function Providers({ children }: { children: ReactNode }) {
  return (
    <ClerkProvider
      publishableKey={Constants.expoConfig?.extra?.CLERK_PUBLISHABLE_KEY}
      tokenCache={tokenCache}
    >
      <TRPCProvider>
        <Provider store={jotaiStore}>
          <NavigationContainer>{children}</NavigationContainer>
        </Provider>
      </TRPCProvider>
    </ClerkProvider>
  );
}

export default App;
