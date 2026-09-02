"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

import { createProduct } from "@/app/admin/ps/actions"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export function ProductForm() {
  const router = useRouter()

  const [loading, setLoading] = useState(false)

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault()

    setLoading(true)

    const formData = new FormData(event.currentTarget)

    try {
      await createProduct(formData)

      router.push("/admin/products")
      router.refresh()
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>Product Information</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label>Name</label>
            <Input
              name="name"
              placeholder="Product name"
              required
            />
          </div>

          <div className="space-y-2">
            <label>Slug</label>
            <Input
              name="slug"
              placeholder="product-slug"
              required
            />
          </div>

          <div className="space-y-2">
            <label>Description</label>
            <Textarea
              name="description"
              placeholder="Product description"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label>Price</label>
              <Input
                name="price"
                type="number"
                min="0"
                required
              />
            </div>

            <div className="space-y-2">
              <label>Stock</label>
              <Input
                name="stock"
                type="number"
                min="0"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label>SKU</label>
            <Input
              name="sku"
              placeholder="SKU-001"
            />
          </div>

          <Button
            type="submit"
            disabled={loading}
          >
            {loading ? "Creating..." : "Create Product"}
          </Button>
        </CardContent>
      </Card>
    </form>
  )
}   