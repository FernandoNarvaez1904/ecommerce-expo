import { AppRouter } from "@acme/api";
import { inferProcedureOutput } from "@trpc/server";
import { atom } from "jotai";
import { atomFamily } from "jotai/utils";

export const ordersAtom = atom<
  inferProcedureOutput<AppRouter["order"]["allMyOrders"]>
>([]);

export const ordersObjectAtom = atom((get) => {
  const orders = get(ordersAtom);
  const result: Record<
    number,
    inferProcedureOutput<AppRouter["order"]["allMyOrders"]>[number]
  > = {};

  for (const order of orders) {
    result[order.id] = order;
  }

  return result;
});

export const singleOrderAtomFamily = atomFamily((id: number) =>
  atom((get) => {
    const order = get(ordersObjectAtom)[id];
    if (!order) return null;
    return order;
  }),
);
