"use client"

import { Button } from "@/components/ui/button"
import Link  from "next/link"
import {
    ShoppingCart,
  User
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { User as SupabaseUser } from "@supabase/supabase-js"
// import { LogoutButton } from "@/components/shop/account/logout-button"
import type { ComponentProps } from "react"

type logoutAction = ComponentProps<"form">["action"]


interface DropdownMenuProfileProps{
    user: SupabaseUser | null
    profile: {
        full_name: string | null
        role: string 
    } | null
    logoutAction: () => Promise<void>
}

export function DropdownMenuProfile({user, profile,logoutAction}: DropdownMenuProfileProps) {
  if(!user) {
    return(
          <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Account">
          <User />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-40" align="start">
        <DropdownMenuGroup>
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuItem>
            Tài khoản chưa đăng nhập
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <Link href="/login">
              Login
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
    )
  }

    return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Account">
          <User />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-40" align="start">
        <DropdownMenuGroup>
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuItem>
            {profile?.full_name ?? "Tài khoản"}
            <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>

          <DropdownMenuItem>                    
                    <Link href="/cart" className="flex items-center gap-2">
                        <ShoppingCart />                        
                        Xem giỏ hàng 
                    </Link>
          </DropdownMenuItem>

          <DropdownMenuItem>                    
                    <Link href="/account/profile" className="flex items-center gap-2">
                        <User />                        
                        My profile
                    </Link>
          </DropdownMenuItem>

          <DropdownMenuItem>                    
                    <Link href="/account/orders" className="flex items-center gap-2">
                        <User />                        
                        My orders
                    </Link>

          </DropdownMenuItem>

                    <DropdownMenuItem>                    
                    <Link href="/account/addresses" className="flex items-center gap-2">
                        <User />                        
                        My Addresses
                    </Link>
          </DropdownMenuItem>

        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <form action={logoutAction} className="w-full">
                <button type="submit" className="w-full text-left">
                Log out
                </button>
            </form>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
