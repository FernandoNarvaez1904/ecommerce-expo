import { TRPCError } from "@trpc/server";
import { router, protectedProcedure } from "../trpc";
import { z } from "zod";

export const orderRouter = router({
  create: protectedProcedure
    .input(
      z.object({
        total: z.number().nonnegative(),
        items: z
          .object({
            id: z.number().positive(),
            quantity: z.number().nonnegative(),
          })
          .array(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.$transaction(async (tx) => {
        const itemIds = input.items.map((item) => item.id);
        const items = await tx.items.findMany({
          where: {
            id: { in: itemIds },
          },
        });

        const q: Record<number, number> = {};
        input.items.forEach((item) => {
          q[item.id] = item.quantity;
        });

        const order = await tx.orders.create({
          data: {
            status: "Placed",
            total: input.total,
            user_id: ctx.auth.userId,
            orderitems: {
              create: items.map((item) => ({
                itemId: item.id,
                name: item.name,
                price: item.price,
                quantity: q[item.id] ?? 0,
              })),
            },
          },
          include: {
            orderitems: true,
          },
        });

        const updatePromises = order.orderitems.map((orderItem) => {
          const itemId = orderItem.itemId ?? -1;
          const item = items.find((item) => item.id === orderItem.itemId);

          return tx.items.update({
            where: {
              id: itemId,
            },
            data: {
              stock:
                (item?.stock.toNumber() ?? 0) - orderItem.quantity.toNumber(),
            },
          });
        });

        await Promise.all(updatePromises);

        return order;
      });
    }),

  cancel: protectedProcedure
    .input(
      z.object({
        id: z.number().positive(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const order = await ctx.prisma.orders.findFirstOrThrow({
        where: {
          id: input.id,
        },
        include: {
          orderitems: {
            include: {
              item: {
                select: {
                  stock: true,
                },
              },
            },
          },
        },
      });

      if (ctx.auth.userId !== order.user_id) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        if (!ctx.auth.sessionClaims.publicMetadata.isAdmin) {
          throw new TRPCError({
            message: "Cannot cancel an order is not yours",
            code: "FORBIDDEN",
          });
        }
      }

      if (order.status !== "Placed") {
        throw new TRPCError({
          message: "Only Placed orders can be cancelled",
          code: "FORBIDDEN",
        });
      }

      await ctx.prisma.orders.update({
        where: {
          id: order.id,
        },
        data: {
          status: "Cancelled",
        },
        select: {
          id: true,
        },
      });

      const updatePromises = order.orderitems.map((orderItem) => {
        const itemId = orderItem.itemId ?? -1;
        return ctx.prisma.items.update({
          where: {
            id: itemId,
          },
          data: {
            stock:
              (orderItem.item?.stock.toNumber() ?? 0) +
              orderItem.quantity.toNumber(),
          },
          select: {
            id: true,
          },
        });
      });

      await Promise.all(updatePromises);

      return ctx.prisma.orders.findFirstOrThrow({
        where: {
          id: input.id,
        },
        include: {
          orderitems: true,
        },
      });
    }),

  complete: protectedProcedure
    .input(
      z.object({
        id: z.number().positive(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const order = await ctx.prisma.orders.findFirstOrThrow({
        where: {
          id: input.id,
        },
      });

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      if (!ctx.auth.sessionClaims.publicMetadata.isAdmin) {
        throw new TRPCError({
          message: "Only admins can complete orders",
          code: "FORBIDDEN",
        });
      }

      if (order.status !== "Placed") {
        throw new TRPCError({
          message: "Only Placed orders can be completed",
          code: "FORBIDDEN",
        });
      }

      return ctx.prisma.orders.update({
        where: {
          id: order.id,
        },
        data: {
          status: "Completed",
        },
        include: {
          orderitems: true,
        },
      });
    }),

  allMyOrders: protectedProcedure.query(({ ctx }) => {
    console.log(ctx.auth, "hellou");
    return ctx.prisma.orders.findMany({
      where: {
        // @ts-ignore
        user_id: ctx.auth.sessionClaims.publicMetadata.isAdmin
          ? undefined
          : ctx.auth.userId,
      },
      include: {
        orderitems: true,
      },
      orderBy: {
        creation_date: "desc",
      },
    });
  }),
});
