// src/lib/resources/category.config.ts

import type { ResourceConfig } from "./types";

export const customerConfig: ResourceConfig = {
    title: "Customer",
    singularLabel: "Customer",

    fields: [
        {
            name: "full_name",
            label: "Full Name",
            type: "text",
        },
        {
            name: "phone",
            label: "Phone",
            type: "text"
        },
        {
            name: "avatar_url",
            label: "Avatar",
            type: "text"
        },
        {
            name: "role",
            label: "Role",
            type: "text"
        }
    ]
}