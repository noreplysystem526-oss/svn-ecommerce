src/
├── app/
│   └── admin/
│       └── [resource]/
│           ├── page.tsx
│           │
│           ├── new/
│           │   └── page.tsx
│           │
│           └── [slug]/
│               └── page.tsx
│
├── components/
│   ├── admin/
│   │   ├── resource-table/
│   │   │   ├── resource-table.tsx
│   │   │   └── resource-columns.tsx
│   │   │
│   │   └── resource-form/
│   │       ├── resource-form.tsx
│   │       ├── dynamic-field.tsx
│   │       └── fields/
│   │           ├── text-field.tsx
│   │           ├── number-field.tsx
│   │           ├── select-field.tsx
│   │           ├── media-field.tsx
│   │           └── relation-field.tsx
│   │
│   └── ui/
│       └── ...shadcn
│
├── lib/
│   ├── supabase/
│   │   ├── client.ts
│   │   ├── server.ts
│   │   ├── middleware.ts
│   │   └── database.types.ts
│   │
│   ├── repositories/
│   │   ├── product.repository.ts
│   │   ├── order.repository.ts
│   │   └── category.repository.ts
│   │
│   ├── actions/
│   │   ├── product.actions.ts
│   │   ├── order.actions.ts
│   │   └── category.actions.ts
│   │
│   ├── validations/
│   │   ├── product.schema.ts
│   │   ├── order.schema.ts
│   │   └── category.schema.ts
│   │
│   └── resources/
│       ├── product.config.ts
│       ├── order.config.ts
│       ├── category.config.ts
│       └── index.ts
│
|── types/
|    └── database.ts
