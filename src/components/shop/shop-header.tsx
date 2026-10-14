"use client"

import Link from "next/link"
import {
  ShoppingCart,
  Search,
  Menu,
  User
} from "lucide-react"
import { DropdownMenuProfile } from "@/components/shop/layout/dropdown-menu"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet"
import { User as SupabaseUser } from "@supabase/supabase-js"
import { DropdownMenuCart } from "./carts/dropdown-cart"


import { useCartStore } from "@/store/cart.store"

export function CartButton() {
  const totalItems = useCartStore(
    (state) =>
      state.items.reduce(
        (total, item) => total + item.quantity,
        0
      )
  )

  return (
    <Link
      href="/cart"
      className="relative"
    >
      <ShoppingCart />

      {totalItems > 0 && (
        <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-white">
          {totalItems}
        </span>
      )}
    </Link>
  )
}

interface ShopHeaderProps{
  user: SupabaseUser | null
  profile: {
    full_name: string | null
    role: string 
  } | null
  logoutAction: () => Promise<void>
}

export function ShopHeader({user, profile,logoutAction} : ShopHeaderProps) {

  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}

        <Link
          href="/"
          className="text-xl font-bold tracking-tight"
        >
          SVN SHOP
        </Link>

        {/* Desktop navigation */}

        <nav className="hidden items-center gap-6 md:flex">
          <Link
            href="/"
            className="text-sm font-medium hover:text-primary"
          >
            Home
          </Link>

          <Link
            href="/products"
            className="text-sm font-medium hover:text-primary"
          >
            Products
          </Link>

          <Link
            href="/categories"
            className="text-sm font-medium hover:text-primary"
          >
            Categories
          </Link>
        </nav>

        {/* Actions */}

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            aria-label="Search"
          >
            <Search />
          </Button>

          {/* <Button
            variant="ghost"
            size="icon"
            aria-label="Account"
            onClick={() => set}
          >
            <User />
          </Button> */}

          <DropdownMenuProfile 
          user={user} 
          profile={profile}
          logoutAction={logoutAction}
          />

          <CartButton 
          
          />

          {/* <Button
            variant="ghost"
            size="icon"
            asChild
            aria-label="Shopping cart"
          >
            <Link href="/cart">
              <ShoppingCart />
            </Link>
          </Button> */}

          {/* Mobile menu */}

          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
              >
                <Menu />
              </Button>
            </SheetTrigger>

            <SheetContent
              side="left"
              className="w-72"
            >
              <nav className="mt-8 flex flex-col gap-4">
                <Link href="/">
                  Home
                </Link>

                <Link href="/products">
                  Products
                </Link>

                <Link href="/categories">
                  Categories
                </Link>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}