import React, { useEffect, useMemo, useState } from "react";
import { FlatList, View, TextInput, Text, Pressable } from "react-native";
import { trpc } from "../utils/trpc";
import ProductCard from "../components/ProductCard";
import { useSetAtom } from "jotai";
import { productsAtom } from "../atoms/products";
import { useUser } from "@clerk/clerk-expo";
import { HomeTabScreenProps } from "../types/navigation";

function ItemListScreen({ navigation }: HomeTabScreenProps<"Search">) {
  const { data } = trpc.item.all.useQuery();
  const setProductsAtom = useSetAtom(productsAtom);
  const { user } = useUser();

  const [nameFilter, setNameFilter] = useState("");

  const filteredData = useMemo(
    () =>
      data?.filter((item) =>
        item.name.toLowerCase().includes(nameFilter.toLocaleLowerCase()),
      ) ?? [],
    [nameFilter, data],
  );

  useEffect(() => {
    if (data) {
      setProductsAtom(data);
    }
  }, [data]);

  return (
    <View className="mt-2.5 flex-1 bg-gray-50 px-2">
      <View className="my-2.5 flex w-full flex-row gap-1">
        <TextInput
          className="flex-grow rounded border border-gray-200 bg-white py-1.5 pl-3 shadow-lg"
          placeholder="Busca un Producto"
          onChangeText={setNameFilter}
        />
        {user?.publicMetadata.isAdmin && (
          <Pressable
            className="justify-center rounded bg-emerald-500 px-2 active:bg-emerald-600"
            onPress={() => navigation.push("Create Item")}
          >
            <Text className="self-center font-medium text-white">Add Item</Text>
          </Pressable>
        )}
      </View>

      <FlatList
        data={filteredData}
        renderItem={(item) => (
          <ProductCard item={item.item} key={item.item.id} />
        )}
        ItemSeparatorComponent={() => <View className="mt-2.5" />}
        ListFooterComponent={() => <View className="mt-2.5" />}
      />
    </View>
  );
}

export default ItemListScreen;
