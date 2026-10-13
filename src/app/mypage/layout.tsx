import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/data";

export default async function MyPageLayout({ children }: { children: React.ReactNode }) {
  const session = await getCurrentUser();
  if (!session) redirect("/login?next=/mypage");

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-2">
        <div>
          <h1 className="text-2xl font-bold">마이페이지</h1>
          <p className="text-sm text-gray-500">{session.profile?.name ?? session.user.email}님, 반갑습니다.</p>
        </div>
        <nav className="flex gap-1 text-sm">
          <Link href="/mypage/orders" className="rounded-md px-3 py-2 hover:bg-gray-100">
            주문내역
          </Link>
          <Link href="/mypage/profile" className="rounded-md px-3 py-2 hover:bg-gray-100">
            회원정보
          </Link>
        </nav>
      </div>
      {children}
    </div>
  );
}
