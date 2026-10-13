"use client";

import { useState, useTransition } from "react";
import { cancelOrder } from "@/actions/order";

export default function CancelOrderButton({ orderId }: { orderId: number }) {
  const [confirming, setConfirming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  if (!confirming) {
    return (
      <button className="btn-outline text-red-600" onClick={() => setConfirming(true)}>
        주문 취소
      </button>
    );
  }

  return (
    <div className="flex items-center gap-2">
      {error && <span className="text-sm text-red-600">{error}</span>}
      <span className="text-sm text-gray-600">정말 취소할까요?</span>
      <button className="btn-outline" onClick={() => setConfirming(false)} disabled={pending}>
        아니요
      </button>
      <button
        className="btn bg-red-600 text-white hover:bg-red-700"
        disabled={pending}
        onClick={() =>
          startTransition(async () => {
            const res = await cancelOrder(orderId);
            if (res.error) setError(res.error);
            else setConfirming(false);
          })
        }
      >
        {pending ? "처리 중…" : "취소하기"}
      </button>
    </div>
  );
}
