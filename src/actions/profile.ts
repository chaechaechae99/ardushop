"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { FormState } from "./auth";

export async function updateProfile(_: FormState, formData: FormData): Promise<FormState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "로그인이 필요합니다." };

  const { error } = await supabase
    .from("profiles")
    .update({
      name: String(formData.get("name") ?? "").trim() || null,
      phone: String(formData.get("phone") ?? "").trim() || null,
      address: String(formData.get("address") ?? "").trim() || null,
    })
    .eq("id", user.id);
  if (error) return { error: error.message };

  revalidatePath("/mypage", "layout");
  return { message: "저장되었습니다." };
}
