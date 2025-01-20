"use server";

import { CartItem } from "@/types";
import { cookies } from "next/headers";
import { convertToPlainObject, formatError } from "../utils";
import { auth } from "@/auth";
import { prisma } from "@/db/prisma";

export const addItemToCart = async (data: CartItem) => {
  try {
    // check for cart cookie
    const sessionCartId = (await cookies()).get("sessionCartId")?.value;
    if (!sessionCartId) throw new Error("cart session not found");

    //get session and userid from sessionCartId
    const session = await auth();
    const userid = session?.user?.id ? (session.user.id as string) : undefined;

    return {
      success: true,
      message: "Item added to cart",
    };
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
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
    where: userid ? { userId: userid } : { sessionCartId: sessionCartId },
  });
  if (!cart) return undefined;
  //convert deciamals and return
  return convertToPlainObject({
    ...cart,
    items: cart.items as CartItem[],
  });
}
