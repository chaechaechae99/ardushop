import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { formatDate, won } from "@/lib/utils/format";
import StatusBadge from "@/components/StatusBadge";
import CancelOrderButton from "./CancelOrderButton";
import type { Order, OrderItem } from "@/types/db";

export const metadata: Metadata = { title: "주문 상세" };

type Props = { params: Promise<{ id: string }>; searchParams: Promise<{ done?: string }> };

export default async function OrderDetailPage({ params, searchParams }: Props) {
  const [{ id }, { done }] = await Promise.all([params, searchParams]);
  if (!/^\d+$/.test(id)) notFound();

  const supabase = await createClient();
  const { data: order } = await supabase
    .from("orders")
    .select("*, order_items(*)")
    .eq("id", Number(id))
    .maybeSingle<Order & { order_items: OrderItem[] }>();
  if (!order) notFound();

  return (
    <div className="space-y-4">
      {done && (
        <div className="card border-brand-500 bg-brand-50 p-6 text-center">
          <p className="text-lg font-bold text-brand-900">주문이 완료되었습니다!</p>
          <p className="mt-1 text-sm text-brand-700">주문번호 {order.order_no}</p>
        </div>
      )}

      <section className="card p-5">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          <div>
            <p className="text-xs text-gray-400">{formatDate(order.created_at)}</p>
            <h2 className="font-bold">주문번호 {order.order_no}</h2>
          </div>
          <StatusBadge status={order.status} />
        </div>
        <ul className="divide-y divide-gray-100 text-sm">
          {order.order_items.map((i) => (
            <li key={i.id} className="flex justify-between gap-4 py-2.5">
              <span>
                {i.product_name} <span className="text-gray-400">× {i.quantity}</span>
              </span>
              <span className="shrink-0">{won(i.unit_price * i.quantity)}</span>
            </li>
          ))}
        </ul>
        <dl className="mt-4 space-y-1.5 border-t border-gray-200 pt-4 text-sm">
          <div className="flex justify-between">
            <dt className="text-gray-500">상품금액</dt>
            <dd>{won(order.subtotal)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-gray-500">배송비</dt>
            <dd>{order.shipping_fee === 0 ? "무료" : won(order.shipping_fee)}</dd>
          </div>
          <div className="flex justify-between text-base font-extrabold">
            <dt>결제금액</dt>
            <dd>{won(order.total)}</dd>
          </div>
        </dl>
      </section>

      <section className="card p-5 text-sm">
        <h2 className="mb-3 font-bold">배송 정보</h2>
        <p>
          {order.recipient} · {order.phone}
        </p>
        <p className="text-gray-600">{order.address}</p>
        {order.memo && <p className="mt-1 text-gray-400">메모: {order.memo}</p>}
      </section>

      <div className="flex justify-between">
        <Link href="/mypage/orders" className="btn-outline">
          주문내역으로
        </Link>
        {order.status === "paid" && <CancelOrderButton orderId={order.id} />}
      </div>
    </div>
  );
}
