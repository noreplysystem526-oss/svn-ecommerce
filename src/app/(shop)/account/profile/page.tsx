import { redirect } from "next/navigation"

import { createClient } from "@/lib/supabase/server"
import { getProfileById } from "@/lib/repository/profile.repository"

import { ProfileForm } from "@/components/shop/account/profile-form"

export default async function ProfilePage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login?redirectTo=/account/profile")
  }

  const profile = await getProfileById(user.id)

  return (
    <div className="container mx-auto max-w-2xl px-6 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold">
          Thông tin cá nhân
        </h1>

        <p className="mt-2 text-sm text-muted-foreground">
          Quản lý thông tin tài khoản của bạn
        </p>
      </div>

      <ProfileForm
        initialData={{
          full_name: profile?.full_name ?? "",
          phone: profile?.phone ?? "",
        }}
        email={user.email ?? ""}
      />
    </div>
  )
}