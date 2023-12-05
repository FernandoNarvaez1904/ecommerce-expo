import { AppRouter } from "@acme/api";
import { inferProcedureOutput } from "@trpc/server";
import { atom } from "jotai";
import { atomFamily } from "jotai/utils";

export const productsAtom = atom<
  inferProcedureOutput<AppRouter["item"]["all"]>
>([]);

export const singleProductAtomFamily = atomFamily((id: number) =>
  atom((get) => {
    const product = get(productsAtom).filter((product) => product.id === id)[0];
    if (!product) return null;
    return product;
  }),
);
