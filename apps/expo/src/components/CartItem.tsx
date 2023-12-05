import { useAtomValue, useSetAtom } from "jotai";
import { singleProductAtomFamily } from "../atoms/products";
import { Image, Pressable, Text, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { addItemToCartAtom, deleteItemFromCartAtom } from "../atoms/cart";
import { memo } from "react";
import { useNavigation } from "@react-navigation/native";

function CartItem({ id, quantity }: { id: number; quantity: number }) {
  const item = useAtomValue(singleProductAtomFamily(id));
  const deleteItemFromCart = useSetAtom(deleteItemFromCartAtom({ id }));
  const addItemToCart = useSetAtom(addItemToCartAtom({ id, quantity: 1 }));
  const removeItemToCart = useSetAtom(addItemToCartAtom({ id, quantity: -1 }));

  const navigation = useNavigation();

  return (
    <View className="flex flex-row items-center justify-between rounded border border-gray-200 bg-white  shadow">
      <Pressable
        className="w-2/3 flex-row items-center p-2"
        onPress={() => navigation.navigate("SingleItemScreen", { id: id })}
      >
        <Text className="mr-2  text-base" numberOfLines={1}>
          {quantity}
        </Text>
        <Image
          source={{
            uri:
              item?.image_url ??
              "https://t4.ftcdn.net/jpg/04/00/24/31/360_F_400243185_BOxON3h9avMUX10RsDkt3pJ8iQx72kS3.jpg",
          }}
          className="h-12 w-12"
          resizeMode="contain"
        />
        <View>
          <Text className="w-40 text-base font-medium" numberOfLines={1}>
            {item?.name}
          </Text>
          <Text className=" text-base font-normal" numberOfLines={1}>
            C$ {(item?.price.toNumber() ?? 0) * quantity}
          </Text>
        </View>
      </Pressable>

      <View className="flex h-full  w-1/3 flex-grow flex-row">
        <Pressable
          className=" w-1/3 items-center justify-center  bg-red-400 "
          onPress={deleteItemFromCart}
        >
          <Ionicons name="trash-outline" size={18} color={"white"} />
        </Pressable>
        <Pressable
          className=" w-1/3 items-center justify-center  bg-cyan-600 "
          onPress={removeItemToCart}
        >
          <Ionicons name="remove" size={20} color={"white"} />
        </Pressable>
        <Pressable
          className=" w-1/3 items-center justify-center rounded-r bg-emerald-500"
          onPress={addItemToCart}
        >
          <Ionicons name="add" size={20} color={"white"} />
        </Pressable>
      </View>
    </View>
  );
}

export default memo(CartItem);
