import Link from "next/link"

export function ShopFooter() {
  return (
    <footer className="border-t">
      <div className="container mx-auto grid gap-8 px-4 py-12 md:grid-cols-3">
        <div>
          <h3 className="font-semibold">
            SVN SHOP
          </h3>

          <p className="mt-3 max-w-sm text-sm text-muted-foreground">
            Quality products for your everyday
            life.
          </p>
        </div>

        <div>
          <h4 className="font-medium">
            Shop
          </h4>

          <div className="mt-3 flex flex-col gap-2 text-sm text-muted-foreground">
            <Link href="/products">
              Products
            </Link>

            <Link href="/categories">
              Categories
            </Link>

            <Link href="/cart">
              Cart
            </Link>
          </div>
        </div>

        <div>
          <h4 className="font-medium">
            Support
          </h4>

          <div className="mt-3 flex flex-col gap-2 text-sm text-muted-foreground">
            <Link href="/contact">
              Contact
            </Link>

            <Link href="/shipping">
              Shipping
            </Link>

            <Link href="/privacy">
              Privacy
            </Link>
          </div>
        </div>
      </div>

      <div className="border-t">
        <div className="container mx-auto px-4 py-6 text-sm text-muted-foreground">
          © 2026 SVN Shop. All rights reserved.
        </div>
      </div>
    </footer>
  )
}