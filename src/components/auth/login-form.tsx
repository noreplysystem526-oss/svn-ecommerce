"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

import { createClient } from "@/lib/supabase/client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export function LoginForm() {
  const router = useRouter()
  const supabase = createClient()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleLogin(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault()

    if (loading) return

    setLoading(true)

    try {
      const { error } =
        await supabase.auth.signInWithPassword({
          email,
          password,
        })

      if (error) {
        throw error
      }

      toast.success("Đăng nhập thành công")

      router.replace("/admin")
      router.refresh()
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Đăng nhập thất bại"
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Đăng nhập</CardTitle>

        <CardDescription>
          Đăng nhập vào hệ thống quản trị
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form
          onSubmit={handleLogin}
          className="space-y-5"
        >
          <div className="space-y-2">
            <Label htmlFor="email">
              Email
            </Label>

            <Input
              id="email"
              type="email"
              placeholder="admin@example.com"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">
              Mật khẩu
            </Label>

            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              required
            />
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={loading}
          >
            {loading
              ? "Đang đăng nhập..."
              : "Đăng nhập"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}