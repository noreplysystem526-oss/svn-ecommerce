"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import type {
  ResourceConfig,
  ResourceOptions,
} from "@/lib/resources/types"

import {
  createResourceAction,
  updateResourceAction,
} from "@/lib/actions/resource.actions"

import { validationSchemas } from "@/lib/validation"

import { DynamicField } from "./dynamic-field"

interface ResourceFormProps {
  resource: string
  config: ResourceConfig
  mode: "create" | "edit"
  initialData?: Record<string, unknown>
  relationOptions?: Record<string, ResourceOptions[]>
}

export function ResourceForm({
  resource,
  config,
  mode,
  initialData,
  relationOptions,
}: ResourceFormProps) {
  const [formData, setFormData] = useState<
    Record<string, unknown>
  >(initialData ?? {})

  const [errors, setErrors] = useState<
    Record<string, string | null>
  >({})

  const [isSubmitting, setIsSubmitting] =
    useState(false)

  const router = useRouter()

  const handleChange = (
    fieldName: string,
    value: unknown
  ) => {
    setFormData((prev) => ({
      ...prev,
      [fieldName]: value,
    }))

    // Xóa lỗi của field khi user sửa lại
    setErrors((prev) => ({
      ...prev,
      [fieldName]: null,
    }))
  }

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault()

    // Không cho submit lần 2 khi request đang chạy
    if (isSubmitting) {
      return
    }

    // Bắt đầu loading
    setIsSubmitting(true)

    // Chỉ để test loading UI
    await new Promise((resolve) =>
      setTimeout(resolve, 2000)
    )

    try {
      // =========================
      // 1. Lấy validation schema
      // =========================

      const schema =
        validationSchemas[
          resource as keyof typeof validationSchemas
        ]

      if (!schema) {
        throw new Error(
          `No validation schema found for resource: ${resource}`
        )
      }

      // =========================
      // 2. Validate form
      // =========================

      const result = schema.safeParse(formData)

      if (!result.success) {
        const fieldErrors: Record<
          string,
          string
        > = {}

        result.error.issues.forEach((issue) => {
          const fieldName = issue.path[0]

          if (typeof fieldName === "string") {
            fieldErrors[fieldName] =
              issue.message
          }
        })

        setErrors(fieldErrors)

        return
      }

      // Dữ liệu sau khi đã qua Zod
      const validatedData = result.data
      console.log("form dt: ",formData)
      console.log("vali data: ",validatedData)

      // =========================
      // 3. Edit
      // =========================

      if (mode === "edit") {
        const id = formData.id

        if (!id) {
          throw new Error(
            "Missing record Id!"
          )
        }
        await updateResourceAction(
          resource,
          String(id),
          validatedData
        )

        toast.success(
          "Cập nhật thành công"
        )

        return
      }

      // =========================
      // 4. Create
      // =========================

      if (mode === "create") {
        const created =
          await createResourceAction(
            resource,
            validatedData
          )

        toast.success(
          "Tạo thành công"
        )

        router.push(
          `/admin/${resource}/${created.slug}`
        )
      }
    } catch (error) {
      console.error(
        "Error submitting form:",
        error
      )

      toast.error(
        "Có lỗi xảy ra khi lưu dữ liệu"
      )
    } finally {
      // Kết thúc loading
      setIsSubmitting(false)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6"
    >
      {config.fields.map((field) => (
        <div
          key={field.name}
          className="space-y-2"
        >
          <Label htmlFor={field.name}>
            {field.label}

            {field.required && (
              <span className="ml-1 text-destructive">
                *
              </span>
            )}
          </Label>

          <DynamicField
            field={field}
            value={formData[field.name]}
            onChange={(value) =>
              handleChange(
                field.name,
                value
              )
            }
            error={
              errors[field.name] ??
              undefined
            }
            relationOptions={
              relationOptions?.[field.name]
            }
          />
        </div>
      ))}

      <Button
        type="submit"
        disabled={isSubmitting}
      >
        {isSubmitting
          ? "Saving..."
          : mode === "create"
            ? "Create"
            : "Save"}
      </Button>

            <Dialog>
                <DialogTrigger asChild>
                  <Button className="text-red-600 hover:underline" variant="outline"
                  >Back</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-sm">
                  
                  <DialogHeader>
                    <DialogDescription>
                      Are you sure you want to go back? Your change will not be saved
                    </DialogDescription>
                  </DialogHeader>

                  <DialogFooter>
                    <DialogClose asChild>
                      <Button variant="outline">Cancel</Button>
                    </DialogClose>
                    <Button asChild>
                        <Link href={`/admin/${resource}`}>Continue</Link>
                      </Button>
                  </DialogFooter>
                </DialogContent>
            </Dialog>
    </form>
  )
}