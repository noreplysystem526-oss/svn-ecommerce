import Link from "next/link"

import { Button } from "@/components/ui/button"

export function HeroSection() {
  return (
    <section className="border-b">
      <div className="container mx-auto grid min-h-[520px] items-center gap-10 px-4 py-16 md:grid-cols-2">
        <div className="max-w-xl">
          <p className="mb-4 text-sm font-medium uppercase tracking-widest text-muted-foreground">
            New Collection
          </p>

          <h1 className="text-4xl font-bold tracking-tight md:text-6xl">
            Discover products
            <br />
            you will love.
          </h1>

          <p className="mt-6 max-w-lg text-muted-foreground md:text-lg">
            Explore our latest collection with
            carefully selected products for your
            everyday life.
          </p>

          <div className="mt-8 flex gap-3">
            <Button asChild size="lg">
              <Link href="/products">
                Shop now
              </Link>
            </Button>

            <Button
              variant="outline"
              size="lg"
              asChild
            >
              <Link href="/categories">
                Explore categories
              </Link>
            </Button>
          </div>
        </div>

        <div className="relative aspect-square overflow-hidden rounded-2xl bg-muted">
          <div className="flex h-full items-center justify-center text-muted-foreground">
            Hero Image
          </div>
        </div>
      </div>
    </section>
  )
}