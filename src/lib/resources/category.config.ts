// src/lib/resources/category.config.ts

import type { ResourceConfig } from "./types";

export const categoryConfig: ResourceConfig = {
    title: "Category",
    singularLabel: "Category",

    fields: [
        {
            name: "description",
            label: "Description",
            type: "rich_text",
        },
        {
            name: "image_url",
            label: "Image Url",
            type: "media",
        },
        {
            name: "is_active",
            label: "Is Active",
            type: "text",
            required: true,
        },
        {
            name: "name",
            label: "Name",
            type: "text",
            required: true,
        },
        {
            name: "slug",
            label: "Slug",
            type: "text",
            required: true,
        }
    ]
}