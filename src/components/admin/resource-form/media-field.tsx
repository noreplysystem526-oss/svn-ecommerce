"use client"

import { useState } from "react"

interface MediaFieldProps {
  value?: string
  onChange: (value: string) => void
}

export function MediaField({
  value,
  onChange,
}: MediaFieldProps) {
  const [preview, setPreview] = useState(value ?? "")

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    const file = e.target.files?.[0]

    if (!file) return

    const url = URL.createObjectURL(file)

    setPreview(url)

    // Tạm thời chỉ preview.
    // Sau này sẽ upload qua uploadMedia()
    onChange(url)
  }

  return (
    <div className="space-y-3">
      <input
        type="file"
        accept="image/*"
        onChange={handleChange}
      />

      {preview && (
        <img
          src={preview}
          alt=""
          className="h-32 w-32 rounded-lg object-cover"
        />
      )}
    </div>
  )
}