import { Image, Pressable, Text, View } from "react-native";
import { memo, useEffect } from "react";
import { useAtomValue, useSetAtom } from "jotai";
import { singleProductAtomFamily } from "../atoms/products";
import { addItemToCartAtom, cartItemQuantityAtomFamily } from "../atoms/cart";
import type { RootStackScreenProps } from "../types/navigation";
import { useUser } from "@clerk/clerk-expo";

function SingleItemScreen({
  route,
  navigation,
}: RootStackScreenProps<"SingleItemScreen">) {
  const item = useAtomValue(singleProductAtomFamily(route.params.id));
  const cartQuantity = useAtomValue(
    cartItemQuantityAtomFamily(route.params.id),
  );
  const addToCart = useSetAtom(
    addItemToCartAtom({ id: route.params.id, quantity: 1 }),
  );
  const { user } = useUser();

  useEffect(() => {
    navigation.setOptions({ title: item?.name ?? "Loading Item" });
  }, [item?.name]);

  if (!item) {
    return (
      <Text className="mt-4 self-center">
        Item with id: {route.params.id} does not exist
      </Text>
    );
  }

  return (
    <View className="h-full bg-white px-2 pt-4">
      {item?.image_url ? (
        <Image
          source={{ uri: item?.image_url }}
          resizeMode="contain"
          className="h-48 "
        />
      ) : (
        <View className="margin-0 h-48 w-48 items-center justify-center self-center rounded border border-gray-200 bg-gray-50">
          <Text className="text-lg  text-gray-500">No Image</Text>
        </View>
      )}

      <View className="flex gap-1.5 pl-4 pt-2.5">
        <View>
          <Text className="text-lg font-semibold">
            Price:
            {item?.price ? (
              <Text className="font-normal"> C$ {item.price.toNumber()}</Text>
            ) : (
              <Text className="text-base font-normal">Free</Text>
            )}
          </Text>
        </View>
        <View>
          <Text className="text-lg font-semibold">
            Stock:
            {item?.stock ? (
              <Text className="font-normal">
                {" "}
                {item.stock.toNumber().toFixed(2)}
              </Text>
            ) : (
              <Text className="text-base font-normal"> 0.00</Text>
            )}
          </Text>
        </View>
        <View>
          <Text className="text-lg font-semibold">
            In Cart:
            <Text className="font-normal"> {cartQuantity.toFixed(2)}</Text>
          </Text>
        </View>
        <View>
          <Text className="text-lg font-semibold">Description:</Text>

          {item?.description ? (
            <Text className="text-lg">{item?.description}</Text>
          ) : (
            <Text className="text-lg  text-gray-500">
              There is no description available
            </Text>
          )}
        </View>
      </View>

      {user?.publicMetadata.isAdmin && (
        <Pressable
          className="mt-2.5 rounded bg-cyan-500  p-2 active:bg-cyan-600"
          onPress={() =>
            navigation.push("Update Item", { id: route.params.id })
          }
        >
          <Text className="self-center text-base font-medium text-white">
            Update Item
          </Text>
        </Pressable>
      )}

      {item.stock.toNumber() !== 0 && (
        <>
          <Pressable
            className="mt-2.5 rounded bg-emerald-500  p-2 active:bg-emerald-600 disabled:bg-emerald-100"
            onPress={() => addToCart()}
          >
            <Text className="self-center text-base font-medium text-white">
              Add to cart
            </Text>
          </Pressable>
          <Pressable
            className="mt-2.5 rounded  border-2  border-emerald-500 p-2"
            onPress={() =>
              navigation.navigate("HomeScreen", { screen: "Cart" })
            }
          >
            <Text className="self-center text-base font-medium text-emerald-700">
              Go to cart
            </Text>
          </Pressable>
        </>
      )}
    </View>
  );
}

export default memo(SingleItemScreen);
