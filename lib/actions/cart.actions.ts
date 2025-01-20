"use server";

import { CartItem } from "@/types";
import { cookies } from "next/headers";
import { convertToPlainObject, formatError, round2 } from "../utils";
import { auth } from "@/auth";
import { prisma } from "@/db/prisma";
import { cartItemSchema, insertCartSchema } from "../validators";
import { revalidatePath } from "next/cache";

// Calculate cart prices
const calcPrice = (items: CartItem[]) => {
  const itemsPrice = round2(
      items.reduce((acc, item) => acc + Number(item.price) * item.qty, 0)
    ),
    shippingPrice = round2(itemsPrice > 100 ? 0 : 10),
    taxPrice = round2(itemsPrice * 0.15),
    totalPrice = round2(itemsPrice + shippingPrice + taxPrice);

  return {
    itemsPrice: itemsPrice.toFixed(2),
    shippingPrice: shippingPrice.toFixed(2),
    taxPrice: taxPrice.toFixed(2),
    totalPrice: totalPrice.toFixed(2),
  };
};

export const addItemToCart = async (data: CartItem) => {
  try {
    // check for cart cookie
    const sessionCartId = (await cookies()).get("sessionCartId")?.value;
    if (!sessionCartId) throw new Error("cart session not found");

    //get session and userid from sessionCartId
    const session = await auth();
    const userId = session?.user?.id ? (session.user.id as string) : undefined;

    //Get cart
    const cart = await getMyCart();
    // Parse and validate item
    const item = cartItemSchema.parse(data);
    // Find product in db
    const product = await prisma.product.findFirst({
      where: { id: item.productId },
    });

    if (!product) throw new Error("Product not found");

    if (!cart) {
      const newCart = insertCartSchema.parse({
        userId: userId,
        items: [item],
        sessionCartId: sessionCartId,
        ...calcPrice([item]),
      });
      console.log(newCart);

      // Add to db
      await prisma.cart.create({
        data: newCart,
      });
      // revalidate product page
      revalidatePath(`/product/${product.slug}`);

      //   console.log({
      //     "Session Cart id": sessionCartId,
      //     "User id": userid,
      //     "Item requested": item,
      //     "Product found": product,
      //   });
      return {
        success: true,
        message: `${product.name} added to cart`,
      };
    }
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
      //   message: "Error adding item to cart",
    };
  }
};

export async function getMyCart() {
  // check for cart cookie
  const sessionCartId = (await cookies()).get("sessionCartId")?.value;
  if (!sessionCartId) throw new Error("cart session not found");

  //get session and userid from sessionCartId
  const session = await auth();
  const userid = session?.user?.id ? (session.user.id as string) : undefined;

  // get user cart from db
  const cart = await prisma.cart.findFirst({
    // Check if the user is logged in or not ELSE, get the cart by sessionCartId
    // Allows guests to still be able to add items to their cart
    where: userid ? { userId: userid } : { sessionCartId: sessionCartId },
  });
  if (!cart) return undefined;
  //convert deciamals and return
  return convertToPlainObject({
    ...cart,
    items: cart.items as CartItem[],
    itemsPrice: cart.itemsPrice.toString(),
    totalPrice: cart.totalPrice.toString(),
    shippingPrice: cart.shippingPrice.toString(),
    taxPrice: cart.taxPrice.toString(),
  });
}
