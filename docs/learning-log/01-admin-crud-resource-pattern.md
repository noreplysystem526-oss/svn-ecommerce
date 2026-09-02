# 01 — Admin CRUD: Resource-driven Pattern

> Tài liệu học luồng nghiệp vụ. Cập nhật file này (không tạo file mới) khi hiểu biết về luồng này thay đổi.

## Luồng này giải quyết vấn đề gì

Trước bản cập nhật gần nhất, mỗi entity admin (product, category...) có code CRUD viết tay riêng biệt: repository nằm rải rác (`lib/repository/product.ts`), type định nghĩa tay từng file (`types/product.ts`, `types/category.ts`...), form viết cứng cho từng entity (`admin/products/components/product-form.tsx`). Bản cập nhật này thay bằng **một pipeline dùng chung cho mọi entity**, dựa trên type sinh tự động từ Supabase + metadata khai báo field.

## Sơ đồ luồng dữ liệu

```
database.types.ts (Supabase generate)
        ↓
types/database.ts        — alias Row/Insert/Update mỗi bảng
        ↓
lib/repository/*.repository.ts   — query Supabase thô (get/create/update/delete)
        ↓
lib/validation/*.schema.ts       — Zod schema, validate input
        ↓
lib/resources/*.config.ts        — khai báo field (name/label/type) mỗi resource
        ↓
lib/resources/index.ts           — gom lại thành map `resourceConfig`
        ↓
lib/actions/*.actions.ts         — "use server", gọi repository
        ↓
UI (page.tsx / DataTable / ResourceForm)
```

## Giải thích từng tầng

| Tầng | Trách nhiệm | Vì sao tách riêng |
|---|---|---|
| `types/database.ts` | Rút gọn `Database["public"]["Tables"]["x"]["Row"]` (dài, khó đọc) thành alias `Product`, `ProductInsert`, `ProductUpdate` | Tránh viết lại type path dài ở mọi nơi; khi Supabase đổi schema, chỉ generate lại `database.types.ts`, các alias tự cập nhật |
| `repository/*.repository.ts` | Query Supabase thô — CHỈ biết SELECT/INSERT/UPDATE/DELETE, không biết gì về validate hay UI | Tách biệt "cách lấy dữ liệu" khỏi "dữ liệu có hợp lệ không" và khỏi UI — dễ test, dễ đổi nguồn dữ liệu sau này |
| `validation/*.schema.ts` | Zod schema định nghĩa field nào bắt buộc, kiểu gì, thông báo lỗi ra sao | Validate ở server trước khi ghi DB, độc lập với type DB gốc (type DB có thể cho phép `null`, nhưng nghiệp vụ có thể bắt buộc) |
| `resources/*.config.ts` | Khai báo field dạng data: `{ name, label, type: "text" \| "number" \| "select" \| "media" \| "relation" \| "rich_text" }` | Đây là ý tưởng "metadata-driven UI" — thay vì viết 1 form riêng cho mỗi entity, định nghĩa field 1 lần, để 1 component chung (`ResourceForm`/`DynamicField` — theo `docs/treeFolder.md`) tự render UI tương ứng |
| `resources/index.ts` | Gộp toàn bộ config thành map `resourceConfig = { products, orders, categories }` + type `ResourceName` | Là điểm tra cứu trung tâm: route `/admin/[resource]` sẽ dùng `resourceConfig[resource]` để biết render field gì |
| `actions/*.actions.ts` | Server Action gọi repository để tạo/sửa/xoá | Là điểm submit form thực sự gọi tới, chạy trên server (`"use server"`) |

## Ví dụ cụ thể đã hoàn thiện: `category`

`category` là entity duy nhất đã đi hết tầng data:

- `lib/repository/category.repository.ts` — `getCategories`, `getCategoryById`, `getCategoryBySlug`
- `lib/validation/category.schema.ts` — `categorySchema` (lỗi bằng tiếng Việt, ví dụ `"Không được để trống"`)
- `lib/resources/category.config.ts` — khai báo 5 field: `description` (rich_text), `image_url` (media), `is_active` (text), `name` (text, required), `slug` (text, required)
- `lib/actions/category.actions.ts` — `createCategory`, `updateCategory`, `deleteCategory`

**Nhưng chưa có trang UI nào cho category** — các trang cũ (`admin/categories/*`) đã bị xoá trong bản cập nhật này, còn UI generic đọc từ `resourceConfig` thì chưa được xây. Tức là tầng data đã sẵn sàng, đang chờ tầng UI.

## Trạng thái từng entity (tại thời điểm bản cập nhật này)

| Entity | Repository/Action/Schema/Config | UI |
|---|---|---|
| `products` | ✅ đủ (mới) | ⚠️ List page (`admin/products/page.tsx`) đã nối đúng repository mới; trang new/[id] + form **vẫn dùng code cũ**, import path `@/repositories/products/repository` không còn tồn tại → lỗi khi chạy |
| `categories` | ✅ đủ (mới) | ❌ Không còn trang nào (đã xoá cùng bản cập nhật này) |
| `orders` | ✅ đủ (mới) | ❌ Trang trống, chưa nối |
| `customers` | ❌ chưa có tầng data riêng | ❌ Trang trống |

## Khái niệm cần nắm để hiểu luồng này

- **Repository pattern**: tách logic truy vấn DB ra khỏi nơi gọi nó.
- **Config-driven / metadata-driven UI**: định nghĩa "hình dạng" dữ liệu bằng data (`ResourceConfig`) thay vì viết UI cứng cho từng trường hợp — 1 lần viết `ResourceForm`/`DynamicField`, dùng lại cho mọi entity.
- **Type suy ra từ schema DB**: `Database["public"]["Tables"][...]["Row"|"Insert"|"Update"]` — không viết interface tay, tránh lệch giữa type và DB thật.
- **Zod + `z.infer`**: một schema dùng được cả để validate runtime lẫn suy ra type compile-time (`CategoryFormValues = z.infer<typeof categorySchema>`), không cần viết type riêng cho form.

## Cần cập nhật lại doc này khi

- UI generic (`admin/[resource]/`, `ResourceForm`, `DynamicField`) được xây xong.
- `actions/*.actions.ts` được nối với `validation/*.schema.ts` (hiện tại action gọi thẳng repository, chưa qua validate).
- `products`/`orders` được dọn code cũ, hết tình trạng pha trộn 2 pattern.
