import { ActivityIndicator, Pressable, Text, View } from "react-native";
import type { RootStackScreenProps } from "../types/navigation";
import TextInput from "../components/core/TextInput";
import { trpc } from "../utils/trpc";
import { z } from "zod";
import { productsAtom, singleProductAtomFamily } from "../atoms/products";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import BannerError from "../components/core/BannerError";
import jotaiStore from "../atoms/store";
import { useAtomValue } from "jotai";
import { useMemo } from "react";

const getUpdateItemFormValidator = (name: string) => {
  const allItems = jotaiStore.get(productsAtom);

  return z.object({
    name: z
      .string()
      .min(1, "Nombre no puede estar vacio")
      .refine(
        (val) =>
          allItems.filter(
            (product) => product.name === val && product.name !== name,
          ).length === 0,
        { message: "Name Already Exists" },
      )
      .optional(),
    price: z.string(),
    stock: z.string(),
    description: z.string().optional(),
  });
};

export type UpdateItemFormSchema = Zod.infer<
  ReturnType<typeof getUpdateItemFormValidator>
>;

function UpdateItemScreen({
  navigation,
  route,
}: RootStackScreenProps<"Update Item">) {
  const { mutate, isLoading } = trpc.item.update.useMutation();
  const trpcUtils = trpc.useContext();

  const item = useAtomValue(singleProductAtomFamily(route.params.id));
  const validator = useMemo(
    () => getUpdateItemFormValidator(item?.name ?? ""),
    [item?.name],
  );
  if (!item) return null;

  const { control, handleSubmit, setError, formState, reset } =
    useForm<UpdateItemFormSchema>({
      resolver: zodResolver(validator),
      mode: "onBlur",
      defaultValues: {
        name: item.name,
        price: item.price.toFixed(2),
        stock: item.stock.toFixed(2),
        description: item.description ?? "",
      },
    });

  const onSubmit = handleSubmit((vals) => {
    mutate(
      {
        id: route.params.id,
        name: vals.name,
        price: vals.price ? Number(vals.price) : undefined,
        stock: vals.stock ? Number(vals.stock) : undefined,
        description: vals.description,
      },
      {
        onError: (err) => {
          setError("root", {
            message: JSON.parse(err.message)[0].message,
          });
        },
        onSuccess: (vals) => {
          trpcUtils.item.all.setData(undefined, (prev) =>
            prev?.map((v) => {
              if (v.id === route.params.id) {
                return vals;
              }
              return v;
            }),
          );
          trpcUtils.item.all.invalidate();
          reset();
          navigation.pop(1);
        },
      },
    );
  });

  return (
    <View className="mt-2.5 h-full flex-1 bg-gray-50 px-2">
      <View className="rounded-md border border-gray-200 bg-white p-4 shadow ">
        {formState.errors.root && (
          <BannerError error={formState.errors.root.message} />
        )}

        <Text>Name</Text>
        <Controller
          control={control}
          name="name"
          render={({ field: { onBlur, onChange, value } }) => (
            <TextInput
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              placeholder={item.name}
              error={formState.errors.name?.message}
            />
          )}
        />
        <Text>Price</Text>
        <Controller
          control={control}
          name="price"
          render={({ field: { onBlur, onChange, value } }) => (
            <TextInput
              onBlur={onBlur}
              onChangeText={(text) => {
                const validated = text.match(/^(\d*\.{0,1}\d{0,2}$)/);
                if (validated) {
                  onChange(text);
                }
              }}
              value={value}
              placeholder={item.price.toFixed(2)}
              error={formState.errors.price?.message}
              keyboardType="numeric"
            />
          )}
        />
        <Text>Initial Stock</Text>
        <Controller
          control={control}
          name="stock"
          render={({ field: { onBlur, onChange, value } }) => (
            <TextInput
              onBlur={onBlur}
              onChangeText={(text) => {
                const validated = text.match(/^(\d*\.{0,1}\d{0,2}$)/);
                if (validated) {
                  onChange(text);
                }
              }}
              value={value}
              placeholder={item.stock.toFixed(2)}
              error={formState.errors.stock?.message}
              keyboardType="numeric"
            />
          )}
        />
        <Text>Description</Text>
        <Controller
          control={control}
          name="description"
          render={({ field: { onBlur, onChange, value } }) => (
            <TextInput
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              placeholder={item.description ?? undefined}
              error={formState.errors.description?.message}
              multiline
              className="pr-3"
            />
          )}
        />
        <Pressable
          className="mt-2.5 rounded bg-cyan-500  p-2 active:bg-cyan-600"
          onPress={onSubmit}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color={"white"} className="self-center" />
          ) : (
            <Text className="self-center font-medium text-white">
              Update Item
            </Text>
          )}
        </Pressable>
      </View>
    </View>
  );
}

export default UpdateItemScreen;
