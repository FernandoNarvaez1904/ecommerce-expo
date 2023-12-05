import { Text, View } from "react-native";
import { RootStackScreenProps } from "../types/navigation";
import { useAtomValue } from "jotai";
import { singleOrderAtomFamily } from "../atoms/order";
import { useLayoutEffect } from "react";
import { trpc } from "../utils/trpc";

function SingleOrderScreen({
  route,
  navigation,
}: RootStackScreenProps<"Single Order">) {
  const order = useAtomValue(singleOrderAtomFamily(route.params.id));
  const { data: userEmail } = trpc.auth.getUserEmail.useQuery({
    id: order?.user_id ?? "",
  });

  if (!order) {
    return null;
  }

  useLayoutEffect(() => {
    navigation.setOptions({ title: `Order #${order.id}` });
  }, []);

  let statusColor = "text-blue-800";
  if (order.status === "Cancelled") {
    statusColor = "text-red-800";
  } else if (order.status === "Completed") {
    statusColor = "text-emerald-800";
  }

  return (
    <View className="px-2 pt-4">
      <View className="flex flex-row justify-between">
        <Text className="mb-1.5 text-lg font-medium">
          Total : C$ {order.total.toFixed(2)}
        </Text>
        <Text className={`${statusColor} text-lg`}>{order.status}</Text>
      </View>

      <Text className="text-base">
        <Text className="text-lg font-medium">Email :</Text> {userEmail}
      </Text>

      {order.orderitems.map((o) => (
        <View>
          <Text className="text-lg">
            {o.name} - {o.quantity.toNumber()} - {o.price.toNumber()} -{" "}
            {o.quantity.toNumber() * o.price.toNumber()}
          </Text>
        </View>
      ))}
    </View>
  );
}

export default SingleOrderScreen;
