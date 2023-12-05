import { memo } from "react";
import { Pressable, Text, View } from "react-native";
import { inferProcedureOutput } from "@trpc/server";
import { AppRouter } from "@acme/api";
import { useUser } from "@clerk/clerk-expo";
import { trpc } from "../utils/trpc";
import { useAtomValue } from "jotai";
import { singleOrderAtomFamily } from "../atoms/order";
import { useNavigation } from "@react-navigation/native";

type Order = inferProcedureOutput<AppRouter["order"]["allMyOrders"]>[number];

function OrderCard({ id }: { id: number }) {
  const order = useAtomValue(singleOrderAtomFamily(id));

  const { user } = useUser();
  const { mutate: cancelOrder, isLoading: isCancelLoading } =
    trpc.order.cancel.useMutation();
  const { mutate: completeOrder, isLoading: isCompleteLoading } =
    trpc.order.complete.useMutation();

  const trpcUtils = trpc.useContext();

  const isLoading = isCancelLoading || isCompleteLoading;

  const navigation = useNavigation();

  if (order === null) {
    return null;
  }

  const updateAllMyOrderCache = (updatedOrder: Order) => {
    trpcUtils.order.allMyOrders.setData(undefined, (o) =>
      o?.map((prevOrder) => {
        if (prevOrder.id === order.id) {
          return updatedOrder;
        }
        return prevOrder;
      }),
    );
  };

  const onCancel = () => {
    cancelOrder(
      { id: order.id },
      {
        onSuccess: (updatedOrder) => {
          updateAllMyOrderCache(updatedOrder);
          trpcUtils.order.allMyOrders.invalidate();
          trpcUtils.item.invalidate();
        },
      },
    );
  };

  const onComplete = () => {
    completeOrder(
      { id: order.id },
      {
        onSuccess: (updatedOrder) => {
          updateAllMyOrderCache(updatedOrder);
          trpcUtils.order.allMyOrders.invalidate();
        },
      },
    );
  };

  let statusColor = "text-blue-800";
  if (order.status === "Cancelled") {
    statusColor = "text-red-800";
  } else if (order.status === "Completed") {
    statusColor = "text-emerald-800";
  }

  return (
    <Pressable
      className="h-36 rounded border border-gray-200 py-2 px-4"
      onPress={() => navigation.navigate("Single Order", { id: order.id })}
    >
      <View className="flex h-full flex-row justify-between">
        <View className="justify-between">
          <Text className={`text-base ${statusColor}`}>{order.status}</Text>
          <Text className="mb-1 text-lg font-medium">
            C$ {order.total.toFixed(2)}
          </Text>
        </View>
        <View className="items-end gap-1.5">
          <Text className="text-base font-medium"># {order.id}</Text>
          <Text className="self-end">{order.orderitems.length} items</Text>
          <Text>{order.creation_date?.toLocaleDateString()}</Text>

          {order.status === "Placed" && (
            <View className="flex flex-row justify-end gap-2">
              <Pressable
                className="w-20 items-center rounded bg-red-400 py-1.5 active:bg-red-500"
                disabled={isLoading}
                onPress={onCancel}
              >
                <Text className="text-white">Cancel</Text>
              </Pressable>

              {user?.publicMetadata.isAdmin && (
                <Pressable
                  className="w-20 items-center rounded bg-emerald-500 py-1.5 active:bg-emerald-600"
                  disabled={isLoading}
                  onPress={onComplete}
                >
                  <Text className="text-white">Complete</Text>
                </Pressable>
              )}
            </View>
          )}
        </View>
      </View>
    </Pressable>
  );
}

export default memo(OrderCard);
