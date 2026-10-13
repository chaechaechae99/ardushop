"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export type PlaceOrderInput = {
  items: { product_id: number; quantity: number }[];
  recipient: string;
  phone: string;
  address: string;
  memo?: string;
};

export async function placeOrder(input: PlaceOrderInput): Promise<{ orderId?: number; error?: string }> {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("place_order", {
    p_items: input.items,
    p_recipient: input.recipient,
    p_phone: input.phone,
    p_address: input.address,
    p_memo: input.memo ?? null,
  });
  if (error) return { error: error.message };

  revalidatePath("/", "layout");
  return { orderId: (data as { id: number }).id };
}

export async function cancelOrder(orderId: number): Promise<{ error?: string }> {
  const supabase = await createClient();
  const { error } = await supabase.rpc("cancel_order", { p_order_id: orderId });
  if (error) return { error: error.message };
  revalidatePath("/mypage", "layout");
  revalidatePath("/admin", "layout");
  return {};
}
