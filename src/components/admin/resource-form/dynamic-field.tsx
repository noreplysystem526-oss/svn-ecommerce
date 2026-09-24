'use client'

import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { TextEditor } from "@/components/lexkit/TextEditor"
export function TextareaDemo() {
  return <Textarea placeholder="Type your message here." />
}

import type { ResourceField, ResourceOptions } from "@/lib/resources/types"
import { Checkbox } from "@/components/ui/checkbox"
import { MediaField } from "./media-field"

type DynamicFieldProps = {
    field: ResourceField
    value: unknown
    error?: string
    onChange: (value: unknown) => void
    relationOptions?: ResourceOptions[]
}

export function DynamicField({ field, value, onChange, error, relationOptions }: DynamicFieldProps) {
    const renderField = () => {
        switch (field.type) {
            case "text":
                return (
                    <Input
                        placeholder={field.label}
                        value={String(value ?? "")}
                        onChange={(e) => onChange(e.target.value)}
                    />
                )
            case "number":
                return (
                    <Input
                        type="number"
                        placeholder={field.label}
                        value={value == null ? "" : Number(value)}
                        onChange={(e) => onChange(

                            e.target.value === "" ? undefined : Number(e.target.value)
                        )}
                    />
                )
            case "boolean":
                return (
                    <Checkbox
                        checked={Boolean(value)}
                        onCheckedChange={onChange}
                    />
                )
            case "select":
                return (
                    <Select
                        defaultValue="draft"
                        value={value === null ? "draft" : String(value)}
                        onValueChange={(value) => {
                            onChange(value === "draft" ? "draft" : value)
                        }}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder={field.label} />
                        </SelectTrigger>
                        <SelectContent>
                            {field.options?.map((option) => (
                                <SelectItem key={option.value} value={option.value}>
                                    {option.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                )
            case "rich_text":
                return (
                    <TextEditor
                        key={field.name}
                        value={typeof value === "string" ? value : ""}
                        onChange={onChange}
                    />
                )
            case "media":
                return (
                    <MediaField value={String(value ?? "")}
                                onChange={onChange}
                                />
                )
            case "relation":
                return (
                    <Select
                        value={value === null ? "" : String(value)}
                        onValueChange={onChange}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder={`Select ${field.label}`} />
                        </SelectTrigger>
                        <SelectContent>
                            {relationOptions?.map((option) => (
                                <SelectItem key={option.value} value={option.value}>
                                    {option.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                )
            default:
                return null
        }        
    }
    return (
        <div>
            {renderField()}
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
        </div>
    )
}   
  