import { HeroSection } from "@/components/shop/hero-section"
import { ProductSection } from "@/components/shop/product-section"

import { getFeatureProducts } from "@/lib/repository/product.repository"

export default async function ShopPage() {
  const featuredProducts = await getFeatureProducts()

  return (
    <>
      <HeroSection />

      <ProductSection
        featuredProducts={featuredProducts}
      />
    </>
  )
}