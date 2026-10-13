"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { placeOrder } from "@/actions/order";
import { cartSubtotal, useCart } from "@/stores/cart";
import { shippingFor, won } from "@/lib/utils/format";

type Defaults = { recipient: string; phone: string; address: string };

export default function CheckoutForm({ defaults }: { defaults: Defaults }) {
  const { items, clear } = useCart();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  useEffect(() => setMounted(true), []);

  if (!mounted) return <div className="card h-64 animate-pulse" />;

  if (items.length === 0) {
    return (
      <div className="card p-12 text-center">
        <p className="text-gray-500">주문할 상품이 없습니다.</p>
        <Link href="/products" className="btn-primary mt-6">
          쇼핑하러 가기
        </Link>
      </div>
    );
  }

  const subtotal = cartSubtotal(items);
  const shipping = shippingFor(subtotal);

  const submit = (formData: FormData) => {
    setError(null);
    startTransition(async () => {
      const res = await placeOrder({
        items: items.map((i) => ({ product_id: i.productId, quantity: i.quantity })),
        recipient: String(formData.get("recipient") ?? ""),
        phone: String(formData.get("phone") ?? ""),
        address: String(formData.get("address") ?? ""),
        memo: String(formData.get("memo") ?? ""),
      });
      if (res.error || !res.orderId) {
        setError(res.error ?? "주문에 실패했습니다.");
        return;
      }
      clear();
      router.replace(`/mypage/orders/${res.orderId}?done=1`);
    });
  };

  return (
    <form action={submit} className="grid gap-6 lg:grid-cols-[1fr_340px]">
      <div className="space-y-6">
        <section className="card space-y-4 p-5">
          <h2 className="font-bold">배송 정보</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="label" htmlFor="recipient">받는 분</label>
              <input id="recipient" name="recipient" required defaultValue={defaults.recipient} className="input" />
            </div>
            <div>
              <label className="label" htmlFor="phone">연락처</label>
              <input id="phone" name="phone" required defaultValue={defaults.phone} placeholder="010-0000-0000" className="input" />
            </div>
          </div>
          <div>
            <label className="label" htmlFor="address">주소</label>
            <input id="address" name="address" required defaultValue={defaults.address} className="input" />
          </div>
          <div>
            <label className="label" htmlFor="memo">배송 메모 (선택)</label>
            <input id="memo" name="memo" placeholder="문 앞에 놓아주세요" className="input" />
          </div>
        </section>

        <section className="card p-5">
          <h2 className="mb-3 font-bold">주문 상품 {items.length}종</h2>
          <ul className="divide-y divide-gray-100 text-sm">
            {items.map((i) => (
              <li key={i.productId} className="flex justify-between gap-4 py-2">
                <span className="line-clamp-1">
                  {i.name} <span className="text-gray-400">× {i.quantity}</span>
                </span>
                <span className="shrink-0">{won(i.price * i.quantity)}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="card p-5">
          <h2 className="mb-3 font-bold">결제 수단</h2>
          <label className="flex items-center gap-3 rounded-lg border-2 border-brand-600 bg-brand-50 p-3 text-sm">
            <input type="radio" name="pay" defaultChecked readOnly className="accent-brand-600" />
            <span>
              <b>테스트 결제</b>
              <span className="ml-2 text-gray-500">실제 청구 없이 결제완료 처리됩니다.</span>
            </span>
          </label>
        </section>
      </div>

      <aside className="card h-fit space-y-3 p-5 lg:sticky lg:top-32">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">상품금액</span>
          <span>{won(subtotal)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">배송비</span>
          <span>{shipping === 0 ? "무료" : won(shipping)}</span>
        </div>
        <div className="flex justify-between border-t border-gray-200 pt-3 text-lg font-extrabold">
          <span>최종 결제금액</span>
          <span className="text-brand-700">{won(subtotal + shipping)}</span>
        </div>
        {error && <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
        <button className="btn-primary w-full py-3.5" disabled={pending}>
          {pending ? "결제 처리 중…" : `${won(subtotal + shipping)} 결제하기`}
        </button>
        <p className="text-xs text-gray-400">최종 금액과 재고는 주문 시점에 서버에서 다시 확인합니다.</p>
      </aside>
    </form>
  );
}
