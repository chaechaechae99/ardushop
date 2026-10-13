import type { Metadata } from "next";
import Link from "next/link";
import SignupForm from "./SignupForm";

export const metadata: Metadata = { title: "회원가입" };

export default function SignupPage() {
  return (
    <div className="mx-auto max-w-sm px-4 py-16">
      <h1 className="mb-6 text-center text-2xl font-bold">회원가입</h1>
      <SignupForm />
      <p className="mt-6 text-center text-sm text-gray-500">
        이미 회원이신가요?{" "}
        <Link href="/login" className="font-semibold text-brand-700 hover:underline">
          로그인
        </Link>
      </p>
    </div>
  );
}
