// src/lib/resources/product.config.ts

import type { ResourceConfig } from "./types";

export const productConfig: ResourceConfig = {
    title: "Products",
    singularLabel: "Product",

    fields: [
        {
            name: "name",
            label: "Name",
            type: "text",
            required: true,
        },
        {
            name: "price",
            label: "Price",
            type: "number",
            required: true,
        },
        {
            name: "sku",
            label: "SKU",
            type: "text",
            required: true,
        },
        {
            name: "stock",
            label: "Stock",
            type: "number",
            required: true,
        },
        {
            name: "status",
            label: "Status",
            type: "select",
            required: true,
            options: [
                {
                    label: "Active",
                    value: "active"
                },
                {
                    label: "In Process",
                    value: "in_process"
                },
            ]
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
            type: "rich_text",
        },
        {
            name: "compare_price",
            label: "Compare Price",
            type: "number",
            required: true,
        },
        {
            name: "category_id",
            label: "Category Id",
            type: "relation"
        }
    ]
}