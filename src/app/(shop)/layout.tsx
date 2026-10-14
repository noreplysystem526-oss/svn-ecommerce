import type { ReactNode } from "react"

import { ShopHeader } from "@/components/shop/shop-header"
import { ShopFooter } from "@/components/shop/shop-footer"
import { CartOwnerSync } from "@/components/shop/carts/cart-owner-sync"
import { createClient } from "@/lib/supabase/server"
import { logoutAction } from "@/lib/actions/auth.actions"

export default async function ShopLayout({
  children,
}: {
  children: ReactNode
}) {
  const supabase = await createClient()
  const { data:{user} } = await supabase.auth.getUser()
  let profile = null
  if(user){
    const { data } = await supabase
      .from("profiles")
      .select("full_name, role")
      .eq("id", user.id)
      .single()

     profile = data 
  } 
  console.log("layout: ", profile)
  return (
    <div className="min-h-screen bg-background">
      <CartOwnerSync userId={user?.id ?? null} />

      <ShopHeader
      user={user} 
      profile={profile}
      logoutAction={logoutAction}
      />

      <main className="min-h-[calc(100vh-8rem)]">
        {children}
      </main>

      <ShopFooter />
    </div>
  )
}