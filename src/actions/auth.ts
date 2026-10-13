"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export type FormState = { error?: string; message?: string } | undefined;

const safeNext = (v: FormDataEntryValue | null) => {
  const s = typeof v === "string" ? v : "";
  return s.startsWith("/") && !s.startsWith("//") ? s : "/";
};

export async function signIn(_: FormState, formData: FormData): Promise<FormState> {
  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email: String(formData.get("email") ?? ""),
    password: String(formData.get("password") ?? ""),
  });
  if (error) {
    return { error: error.message === "Email not confirmed" ? "이메일 인증 후 로그인해 주세요." : "이메일 또는 비밀번호가 올바르지 않습니다." };
  }
  revalidatePath("/", "layout");
  redirect(safeNext(formData.get("next")));
}

export async function signUp(_: FormState, formData: FormData): Promise<FormState> {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");
  const name = String(formData.get("name") ?? "").trim();
  if (password.length < 6) return { error: "비밀번호는 6자 이상이어야 합니다." };

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({ email, password, options: { data: { name } } });
  if (error) {
    return { error: error.message.includes("registered") ? "이미 가입된 이메일입니다." : `가입 실패: ${error.message}` };
  }
  if (!data.session) {
    return { message: "가입 확인 메일을 보냈습니다. 메일의 링크를 누른 뒤 로그인해 주세요." };
  }
  revalidatePath("/", "layout");
  redirect("/");
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/");
}
