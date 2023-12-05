import { atom } from "jotai";
import { atomFamily, atomWithStorage, createJSONStorage } from "jotai/utils";
import { productsAtom, singleProductAtomFamily } from "./products";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const cartAtom = atomWithStorage<Record<number, number>>(
  "cart",
  {},
  createJSONStorage(() => AsyncStorage),
);

export const cartItemQuantityAtomFamily = atomFamily((id: number) =>
  atom(async (get) => {
    return (await get(cartAtom))[id] ?? 0;
  }),
);

export const cartTotalAtom = atom(async (get) => {
  const currentCart = await get(cartAtom);
  const products = get(productsAtom);

  const ids = Object.keys(currentCart);
  let total = 0;

  for (const pr of products) {
    if (ids.includes(pr.id.toString())) {
      total += (currentCart[pr.id] ?? 0) * pr.price.toNumber();
    }
  }

  return total;
});

export const addItemToCartAtom = atomFamily(
  ({ id, quantity }: { id: number; quantity: number }) =>
    atom(null, async (get, set) => {
      const currentCart = await get(cartAtom);
      const currentQuantity = currentCart[id];
      const currentItemStock =
        get(singleProductAtomFamily(id))?.stock.toNumber() ?? 0;

      const q = currentQuantity ? currentQuantity + quantity : quantity;

      if (q < 1) {
        set(cartAtom, { ...currentCart, [id]: 1 });
      } else if (q <= currentItemStock) {
        set(cartAtom, { ...currentCart, [id]: q });
      } else {
        set(cartAtom, { ...currentCart, [id]: currentItemStock });
      }
    }),
);

export const deleteItemFromCartAtom = atomFamily(({ id }: { id: number }) =>
  atom(null, async (_, set) => {
    set(cartAtom, async (prev) => {
      const { [id]: toDelete, ...rest } = await prev;
      return { ...rest };
    });
  }),
);
