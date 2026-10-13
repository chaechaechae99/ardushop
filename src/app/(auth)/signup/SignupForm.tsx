"use client";

import { useActionState } from "react";
import { signUp } from "@/actions/auth";

export default function SignupForm() {
  const [state, action, pending] = useActionState(signUp, undefined);

  if (state?.message) {
    return <p className="card p-6 text-center text-sm text-brand-700">{state.message}</p>;
  }

  return (
    <form action={action} className="card space-y-4 p-6">
      <div>
        <label className="label" htmlFor="name">이름</label>
        <input id="name" name="name" required autoComplete="name" className="input" />
      </div>
      <div>
        <label className="label" htmlFor="email">이메일</label>
        <input id="email" name="email" type="email" required autoComplete="email" className="input" />
      </div>
      <div>
        <label className="label" htmlFor="password">비밀번호 (6자 이상)</label>
        <input id="password" name="password" type="password" required minLength={6} autoComplete="new-password" className="input" />
      </div>
      {state?.error && <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{state.error}</p>}
      <button className="btn-primary w-full py-3" disabled={pending}>
        {pending ? "가입 중…" : "가입하기"}
      </button>
    </form>
  );
}
