import type { AppRouter } from "@acme/api";
import { useNavigation } from "@react-navigation/native";
import type { inferProcedureOutput } from "@trpc/server";
import { memo } from "react";
import { View, Image, Text, TouchableOpacity } from "react-native";

export interface ProductCardProps {
  item: inferProcedureOutput<AppRouter["item"]["byId"]>;
}

function ProductCard({ item }: ProductCardProps) {
  const hasStock = item.stock.greaterThan(0);
  const navigator = useNavigation();

  return (
    <TouchableOpacity
      className="flex flex-row items-center rounded border border-gray-200 bg-white p-2 py-4 shadow"
      onPress={() => navigator.navigate("SingleItemScreen", { id: item.id })}
    >
      <Image
        source={{
          uri:
            item.image_url ??
            "https://t4.ftcdn.net/jpg/04/00/24/31/360_F_400243185_BOxON3h9avMUX10RsDkt3pJ8iQx72kS3.jpg",
        }}
        className="h-20 w-20"
        resizeMode="contain"
      />
      <View className="flex h-full items-start ">
        <Text numberOfLines={1} className="text-base font-semibold">
          {item.name}
        </Text>

        {hasStock && (
          <Text numberOfLines={1} className="font-base text-lg">
            {item.price ? `C$ ${item.price}` : "Free"}
          </Text>
        )}

        <View>
          {hasStock ? (
            <Text className="text-base text-green-900">
              {item.stock.toNumber()} Disponible
            </Text>
          ) : (
            <View>
              <Text className="text-base text-red-900">No Disponible</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}

export default memo(ProductCard);
