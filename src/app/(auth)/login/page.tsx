import type { Metadata } from "next";
import Link from "next/link";
import LoginForm from "./LoginForm";

export const metadata: Metadata = { title: "로그인" };

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const { next = "/" } = await searchParams;
  return (
    <div className="mx-auto max-w-sm px-4 py-16">
      <h1 className="mb-6 text-center text-2xl font-bold">로그인</h1>
      <LoginForm next={next} />
      <p className="mt-6 text-center text-sm text-gray-500">
        아직 회원이 아니신가요?{" "}
        <Link href="/signup" className="font-semibold text-brand-700 hover:underline">
          회원가입
        </Link>
      </p>
    </div>
  );
}
