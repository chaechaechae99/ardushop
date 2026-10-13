import type { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { formatDate, won } from "@/lib/utils/format";
import StatusBadge from "@/components/StatusBadge";
import type { Order, OrderItem } from "@/types/db";

export const metadata: Metadata = { title: "주문내역" };

export default async function OrdersPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { data: orders } = await supabase
    .from("orders")
    .select("*, order_items(product_name, quantity)")
    .eq("user_id", user!.id)
    .order("created_at", { ascending: false })
    .returns<(Order & { order_items: Pick<OrderItem, "product_name" | "quantity">[] })[]>();

  if (!orders?.length) {
    return (
      <div className="card p-12 text-center text-gray-500">
        주문 내역이 없습니다.
        <div>
          <Link href="/products" className="btn-primary mt-6">
            쇼핑하러 가기
          </Link>
        </div>
      </div>
    );
  }

  return (
    <ul className="space-y-3">
      {orders.map((o) => {
        const first = o.order_items[0];
        const rest = o.order_items.length - 1;
        return (
          <li key={o.id}>
            <Link href={`/mypage/orders/${o.id}`} className="card flex flex-wrap items-center gap-4 p-4 hover:border-brand-500">
              <div className="min-w-0 flex-1">
                <p className="text-xs text-gray-400">
                  {formatDate(o.created_at)} · 주문번호 {o.order_no}
                </p>
                <p className="mt-1 truncate font-semibold">
                  {first?.product_name}
                  {rest > 0 && ` 외 ${rest}건`}
                </p>
              </div>
              <StatusBadge status={o.status} />
              <span className="w-28 text-right font-bold">{won(o.total)}</span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
