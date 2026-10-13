import type { Metadata } from "next";
import { getCurrentUser } from "@/lib/data";
import ProfileForm from "./ProfileForm";

export const metadata: Metadata = { title: "회원정보" };

export default async function ProfilePage() {
  const session = await getCurrentUser();
  return (
    <ProfileForm
      email={session!.user.email ?? ""}
      defaults={{
        name: session!.profile?.name ?? "",
        phone: session!.profile?.phone ?? "",
        address: session!.profile?.address ?? "",
      }}
    />
  );
}
