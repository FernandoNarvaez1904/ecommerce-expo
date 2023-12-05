import { useAtom, useAtomValue } from "jotai";
import { cartAtom, cartTotalAtom } from "../atoms/cart";
import CartItem from "../components/CartItem";
import { ActivityIndicator, Image, Pressable, Text, View } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { useMemo } from "react";
import { HomeTabScreenProps } from "../types/navigation";
import { useAuth } from "@clerk/clerk-expo";
import { trpc } from "../utils/trpc";

function CartListScreen({ navigation }: HomeTabScreenProps<"Cart">) {
  const cart = useAtomValue(cartAtom);

  const data = useMemo(() => Object.entries(cart), [cart]);

  return (
    <View className="flex-1 bg-white">
      <View className="mb-2.5 h-12 justify-center border-b border-b-gray-200 bg-white shadow-sm">
        <Text className="ml-2.5 text-lg ">Shopping Cart</Text>
      </View>

      <View className="flex-1 px-2">
        <CartHeader navigation={navigation} />
        <View className="mt-1.5 mb-2.5 border-b-[0.5px] border-b-gray-400" />

        {data.length > 0 ? (
          <FlatList
            data={data}
            renderItem={(item) => (
              <CartItem
                id={Number(item.item[0])}
                key={item.item[0]}
                quantity={item.item[1]}
              />
            )}
            ItemSeparatorComponent={() => <View className="mt-2.5" />}
            ListFooterComponent={() => <View className="mt-2.5" />}
            contentContainerStyle={{ justifyContent: "center" }}
          />
        ) : (
          <View className="h-full items-center justify-center pb-48">
            <Image
              source={require("../../assets/emptyCart.png")}
              className="h-72 w-72 "
            />
            <Text className="text-xl text-gray-700">Your cart is empty</Text>
          </View>
        )}
      </View>
    </View>
  );
}

function CartHeader({
  navigation,
}: {
  navigation: HomeTabScreenProps<"Cart">["navigation"];
}) {
  const { isSignedIn } = useAuth();
  const total = useAtomValue(cartTotalAtom);
  const [cart, setCart] = useAtom(cartAtom);
  const { mutate, isLoading } = trpc.order.create.useMutation();
  const trpcUtils = trpc.useContext();

  const onCreateOrder = () => {
    const cartEntries = Object.entries(cart).map(([key, value]) => ({
      id: Number(key),
      quantity: value,
    }));

    if (cartEntries.length > 0) {
      const input = {
        total: total,
        items: cartEntries,
      };
      mutate(input, {
        onSuccess: () => {
          trpcUtils.item.all.invalidate();
          trpcUtils.order.allMyOrders.invalidate();
          setCart({});
        },
      });
    }
  };

  return (
    <View className="flex flex-row items-center justify-between">
      <Text className="text-lg">
        <Text className="text-xl font-medium">Total: </Text>C$
        {total.toFixed(2)}
      </Text>
      <Pressable
        className="w-18 rounded bg-emerald-500 p-2 active:bg-emerald-600"
        onPress={!isSignedIn ? () => navigation.push("Sign In") : onCreateOrder}
        disabled={isLoading}
      >
        <Text className="text-white">
          {isLoading ? (
            <ActivityIndicator
              color={"white"}
              className="w-18 px-8"
              size={"small"}
            />
          ) : (
            <>{isSignedIn ? "Create Order" : "Log In to Buy"}</>
          )}
        </Text>
      </Pressable>
    </View>
  );
}

export default CartListScreen;
