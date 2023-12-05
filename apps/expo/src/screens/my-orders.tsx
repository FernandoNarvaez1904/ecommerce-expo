import { ActivityIndicator, Image, Text, View } from "react-native";
import { trpc } from "../utils/trpc";
import OrderCard from "../components/OrderCard";
import { FlatList } from "react-native-gesture-handler";
import { useAuth } from "@clerk/clerk-expo";
import { useEffect, useMemo } from "react";
import { useSetAtom } from "jotai";
import { ordersAtom } from "../atoms/order";

function MyOrdersScreen() {
  const { isSignedIn } = useAuth();

  const { data, isLoading } = trpc.order.allMyOrders.useQuery(undefined, {
    enabled: isSignedIn,
  });
  const trpcUtils = trpc.useContext();

  const ordersId = useMemo(() => data?.map((order) => order.id) ?? [], [data]);
  const setOrdersAtom = useSetAtom(ordersAtom);

  useEffect(() => {
    setOrdersAtom(data ?? []);
  }, [data]);

  useEffect(() => {
    if (!isSignedIn) {
      trpcUtils.order.allMyOrders.setData(undefined, []);
      trpcUtils.order.allMyOrders.invalidate();
    }
  }, [isSignedIn]);

  return (
    <View className="flex-1 bg-white">
      <View className="mb-2.5 h-12 justify-center border-b border-b-gray-200 bg-white shadow-sm">
        <Text className="ml-2.5 text-lg ">My Orders</Text>
      </View>
      <View className="flex-1 px-2">
        {ordersId.length > 0 ? (
          <FlatList
            data={ordersId}
            renderItem={(id) => <OrderCard id={id.item} key={id.item} />}
            ItemSeparatorComponent={() => <View className="mt-2.5" />}
            ListFooterComponent={() => <View className="mt-2.5" />}
          />
        ) : (
          <View className="h-full items-center justify-center  pb-44">
            {!isSignedIn && (
              <Text className="text-lg text-gray-700">
                You have to be logged in
              </Text>
            )}
            <Image
              source={require("../../assets/noData.png")}
              className="h-72 w-72 "
            />
            <Text className="text-xl text-gray-700">
              {isLoading ? (
                <>
                  <ActivityIndicator />
                  ...Loading your orders
                </>
              ) : (
                "No Orders Yet"
              )}
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}

export default MyOrdersScreen;
