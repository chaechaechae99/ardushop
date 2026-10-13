"use client";

import { useActionState } from "react";
import { updateProfile } from "@/actions/profile";

type Defaults = { name: string; phone: string; address: string };

export default function ProfileForm({ email, defaults }: { email: string; defaults: Defaults }) {
  const [state, action, pending] = useActionState(updateProfile, undefined);

  return (
    <form action={action} className="card max-w-xl space-y-4 p-6">
      <div>
        <label className="label">이메일</label>
        <input value={email} disabled className="input bg-gray-50 text-gray-500" />
      </div>
      <div>
        <label className="label" htmlFor="name">이름</label>
        <input id="name" name="name" defaultValue={defaults.name} className="input" />
      </div>
      <div>
        <label className="label" htmlFor="phone">연락처</label>
        <input id="phone" name="phone" defaultValue={defaults.phone} placeholder="010-0000-0000" className="input" />
      </div>
      <div>
        <label className="label" htmlFor="address">기본 배송지</label>
        <input id="address" name="address" defaultValue={defaults.address} className="input" />
      </div>
      {state?.error && <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{state.error}</p>}
      {state?.message && <p className="rounded-md bg-brand-50 px-3 py-2 text-sm text-brand-700">{state.message}</p>}
      <button className="btn-primary" disabled={pending}>
        {pending ? "저장 중…" : "저장"}
      </button>
    </form>
  );
}
