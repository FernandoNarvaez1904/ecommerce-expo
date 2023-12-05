import { ActivityIndicator, Pressable, Text, View } from "react-native";
import type { RootStackScreenProps } from "../types/navigation";
import TextInput from "../components/core/TextInput";
import { trpc } from "../utils/trpc";
import { z } from "zod";
import { productsAtom } from "../atoms/products";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import BannerError from "../components/core/BannerError";
import jotaiStore from "../atoms/store";

const createItemFormValidator = z.object({
  name: z
    .string()
    .refine(
      (val) =>
        jotaiStore.get(productsAtom).filter((product) => product.name === val)
          .length === 0,
      { message: "Name Already Exists" },
    ),
  price: z.string(),
  stock: z.string(),
  description: z.string().optional(),
});

export type CreateItemFormSchema = Zod.infer<typeof createItemFormValidator>;

function CreateItemScreen({ navigation }: RootStackScreenProps<"Create Item">) {
  const { mutate, isLoading } = trpc.item.create.useMutation();
  const trpcUtils = trpc.useContext();

  const { control, handleSubmit, setError, formState, reset } =
    useForm<CreateItemFormSchema>({
      resolver: zodResolver(createItemFormValidator),
      mode: "onBlur",
    });

  const onSubmit = handleSubmit((vals) => {
    mutate(
      {
        name: vals.name,
        price: Number(vals.price),
        stock: Number(vals.stock),
        description: vals.description,
      },
      {
        onError: (err) => {
          setError("root", {
            message: JSON.parse(err.message)[0].message,
          });
        },
        onSuccess: () => {
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
              placeholder="Audifonos M2"
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
              placeholder="0.00"
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
              placeholder="0.00"
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
              placeholder="To do some Heating, processor m2, etc."
              error={formState.errors.description?.message}
              multiline
              className="pr-3"
            />
          )}
        />
        <Pressable
          className="mt-2.5 rounded bg-emerald-500  p-2 active:bg-emerald-600"
          onPress={onSubmit}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color={"white"} className="self-center" />
          ) : (
            <Text className="self-center font-medium text-white">Add Item</Text>
          )}
        </Pressable>
      </View>
    </View>
  );
}

export default CreateItemScreen;
