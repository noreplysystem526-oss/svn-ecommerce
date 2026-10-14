import { createClient } from "@/lib/supabase/server"
import { getAddresses } from "@/lib/repository/addresses.repository"
import { AddressesPageContent } from "@/components/shop/account/addresses-page-content"

export default async function AddressesPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return null
  }

  const addresses = await getAddresses(user.id)

  return <AddressesPageContent addresses={addresses} />
}