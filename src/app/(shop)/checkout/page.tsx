import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/data";
import CheckoutForm from "@/components/checkout/CheckoutForm";

export const metadata: Metadata = { title: "주문/결제" };

export default async function CheckoutPage() {
  const session = await getCurrentUser();
  if (!session) redirect("/login?next=/checkout");

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold">주문/결제</h1>
      <CheckoutForm
        defaults={{
          recipient: session.profile?.name ?? "",
          phone: session.profile?.phone ?? "",
          address: session.profile?.address ?? "",
        }}
      />
    </div>
  );
}
