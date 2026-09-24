// src/lib/resources/brand.config.ts

import type { ResourceConfig } from "./types";

export const brandConfig: ResourceConfig = {
    title: "Brands",
    singularLabel: "Brand",

    fields: [
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
        },
        {
            name: "description",
            label: "Description",
            type: "text",
            required: true,
        },
        {
            name: "is_active",
            label: "is_active",
            type: "boolean",
            required: true,
        },
    ]
}