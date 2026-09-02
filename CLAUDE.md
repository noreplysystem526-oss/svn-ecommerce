# CLAUDE.md

File này cung cấp hướng dẫn cho Claude Code (claude.ai/code) khi làm việc với code trong repo này.

@AGENTS.md

## Phong cách làm việc với người dùng (Mentor / Reviewer)

Người dùng đang học, ưu tiên vai trò MENTOR/REVIEWER hơn là để Claude tự động code thay.

- Khi được hỏi về tính năng mới hoặc sửa bug: PHẢI vào chế độ phân tích trước — giải thích nguyên nhân, đề xuất hướng đi, KHÔNG tự sửa code ngay trừ khi người dùng nói rõ "sửa luôn" hoặc "implement đi".
- Khi được nhờ review code người dùng vừa viết: chỉ ra vấn đề, giải thích TẠI SAO đó là vấn đề, gợi ý hướng sửa — nhưng để người dùng tự viết lại, không viết sẵn code thay họ trừ khi được yêu cầu.
- Ưu tiên giải thích khái niệm, pattern, best practice hơn là chỉ đưa code mẫu.
- Nếu có nhiều cách giải quyết, liệt kê ưu nhược điểm từng cách thay vì chọn sẵn 1 cách.
- Giao tiếp bằng tiếng Việt.

## Quy tắc review theo cập nhật (dựa trên Git)

- Dự án dùng Git để xác định ranh giới giữa các lần cập nhật. Khi tôi yêu cầu 
  "review bản cập nhật mới nhất" hoặc "review commit gần đây", LUÔN chạy 
  `git log --oneline -10` và `git diff HEAD~1` (hoặc diff với commit/branch tôi 
  chỉ định) để xác định chính xác phạm vi thay đổi trước khi review — không suy đoán.
- Nếu tôi không nói rõ so với commit nào, hỏi lại tôi trước khi review, đừng tự giả định.

## Quy tắc lưu tài liệu review

- Mỗi khi tôi yêu cầu "review và lưu lại", tạo file MỚI trong 
  `docs/changelog-review/` theo tên `YYYY-MM-DD-ten-tinh-nang.md`. Không ghi đè 
  file cũ.
- Luôn theo đúng template sau:

```markdown
  # [Tên tính năng] — [Ngày]

  ## Phạm vi thay đổi
  (Commit/diff nào, những file/module nào bị ảnh hưởng)

  ## Luồng hoạt động
  (Giải thích từng bước, có thể kèm mermaid diagram)

  ## Vấn đề phát hiện khi review
  (Liệt kê, đánh mức độ: critical / warning / nitpick)

  ## Giải thích khái niệm liên quan
  (Best practice, pattern được dùng, tại sao nên làm vậy, giải thích chi tiết các công nghệ có sử dụng trong đoạn update)

  ## Việc cần làm / follow-up
```

- Tài liệu học luồng nghiệp vụ (không phải review theo bản cập nhật) lưu riêng ở 
  `docs/learning-log/`, đặt tên theo module (vd `02-category-product.md`), 
  CẬP NHẬT file cũ thay vì tạo file mới khi hiểu biết về luồng đó thay đổi.

## Tổng quan dự án

Ứng dụng thương mại điện tử Next.js (App Router) với backend Supabase (Postgres + Auth + Storage). Tài liệu phát triển bằng tiếng Việt nằm trong `docs/` (`workflow.md`, `roadmap.md`, `techstack.md`, `features.md`, `architect..md`, `treeFolder.md`, `crudPageWorkFlow.md`) — xem các file này để biết kiến trúc mục tiêu trước khi tái cấu trúc bất cứ thứ gì.

## Các lệnh

- `npm run dev` — chạy dev server (localhost:3000)
- `npm run build` — build production
- `npm run start` — chạy bản build production
- `npm run lint` — ESLint (flat config, `eslint-config-next` core-web-vitals + typescript)

Repo này chưa cấu hình bộ test nào.

### Supabase

- `supabase/` chỉ chứa state tạm/link của CLI (`.temp/`) — chưa có thư mục migrations cục bộ.
- Type của DB được sinh thủ công vào `src/lib/supabase/database.types.ts` qua lệnh `supabase gen types typescript` (xem `docs/workflow.md` để biết pipeline dự kiến: Supabase DB → type sinh ra → domain types → app).
- Biến môi trường bắt buộc (`.env.local`, không commit): `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`.

## Repository / Pull Requests

- Repo GitHub: `noreplysystem526-oss/svn-ecommerce` (remote `origin`).
- Chưa có PR template, chưa có `CONTRIBUTING.md`, chưa bật branch protection — toàn bộ lịch sử hiện tại là commit thẳng vào `main`. Repo chưa có quy ước PR nào được thiết lập; dùng quy trình chuẩn khi được yêu cầu.
- Tên tác giả commit (do harness cấu hình, ví dụ "Noreply System") có thể khác tên tài khoản GitHub gắn với remote (`noreplysystem526-oss`) — đây là bình thường, không phải lỗi cấu hình.

## Kiến trúc

### Route groups

- `src/app/(auth)/` — login/register, có layout riêng.
- `src/app/(shop)/` — storefront công khai: trang chủ, sản phẩm, giỏ hàng, checkout, tài khoản.
- `src/app/admin/` — dashboard admin (layout sidebar trong `admin/layout.tsx`), không nằm trong route group.

### Pipeline tầng dữ liệu

Type và data access chảy theo một chiều, được mô tả trong `docs/crudPageWorkFlow.md`:

```
database.types.ts (Supabase sinh ra)
  → src/types/database.ts        (re-export alias Row/Insert/Update cho mỗi bảng)
  → src/lib/repository/*.repository.ts   (query Supabase thô, không validate)
  → src/lib/validation/*.schema.ts       (Zod schema + type FormValues suy ra)
  → src/lib/resources/*.config.ts        (metadata field khai báo cho mỗi resource)
  → src/lib/resources/index.ts           (map resourceConfig + union ResourceName)
  → src/lib/actions/*.actions.ts         (server actions "use server" gọi repository)
  → trang admin / DataTable / ResourceForm
```

Khi thêm một bảng/resource mới, đụng vào theo đúng thứ tự: `database.types.ts` → `types/database.ts` → repository → schema → resource config → `resources/index.ts` → server actions → pages.

### Supabase client — dùng đúng loại

- `src/lib/supabase/client.ts` — `createBrowserClient`, dùng cho Client Components.
- `src/lib/supabase/server.ts` — `createServerClient` dùng cookies từ `next/headers`, cho Server Components/Actions. Việc ghi cookie bị nuốt (swallow) trong Server Components (comment trong file: middleware mới là nơi chịu trách nhiệm refresh session).
- `src/lib/supabase/middleware.ts` — helper `updateSession()` để refresh auth session trong middleware. **Lưu ý:** hiện chưa có `middleware.ts` ở root gọi hàm này — việc refresh session chưa được nối vào request pipeline.

### Admin CRUD: pattern hướng resource (đang làm dở)

Admin panel đang được migrate từ các trang riêng lẻ theo từng entity sang pattern điều khiển bằng config. `categories` là implementation tham chiếu đã hoàn thiện; `products`/`orders`/`customers` vẫn còn pha trộn code cũ và mới:

- `src/lib/resources/*.config.ts` khai báo một `ResourceConfig` (title + `ResourceField[]`, mỗi field có `type`: `text | number | select | media | relation | rich_text`). Metadata này dùng để điều khiển UI table + form dùng chung (`docs/treeFolder.md` cho thấy hình dạng mục tiêu: `components/admin/resource-table/`, `resource-form/`, `dynamic-field.tsx`).
- Route đích cuối cùng là một route động duy nhất `admin/[resource]/` (list/new/[slug]) đọc từ `resourceConfig`, không phải một folder riêng cho mỗi entity — các folder hiện tại `admin/products`, `admin/orders`, `admin/customers` có trước pattern này và chưa được gộp lại.
- `src/app/admin/products/actions.ts` import từ `@/repositories/products/repository`, một đường dẫn không còn tồn tại (đã bị thay bởi `src/lib/repository/product.repository.ts`) — coi file đó là cũ/hỏng, không phải pattern để copy theo.
- `src/components/admin/data-table/` là implementation table hiện tại; một file `src/components/admin/data-table.tsx` (file đơn) cũ đã bị xóa gần đây để thay bằng folder này — đừng tạo lại nó.

### Validation

Zod schema trong `src/lib/validation/` phản chiếu các field có thể chỉnh sửa của mỗi resource và export type `*FormValues` suy ra. Một số thông báo validation bằng tiếng Việt (ví dụ lỗi trong `categorySchema`) — khi mở rộng schema, giữ đúng ngôn ngữ hiện có thay vì trộn lẫn ngôn ngữ.

## Đặc điểm đáng chú ý của stack (khác với kiến thức huấn luyện thông thường)

- **Next.js 16** — xem ghi chú "not the Next.js you know" ở trên; đọc `node_modules/next/dist/docs/` trước khi giả định về API App Router.
- **React 19 + `reactCompiler: true`** (`next.config.ts`) — React Compiler đang bật, nên thường không cần tự tay dùng `useMemo`/`useCallback` để tối ưu như thường lệ.
- **`@tanstack/react-table` v9** đang được dùng, không phải API v8 phổ biến hơn: cách dùng đi qua `useTable({ features, ... })` và render dùng `table.FlexRender`, không phải pattern import `useReactTable` + `flexRender` của v8. Xem `src/components/admin/data-table/data-table.tsx` và `data-table-features.ts` để biết cách dùng cụ thể.
- **`radix-ui`** được dùng như một package hợp nhất duy nhất (không phải từng package `@radix-ui/react-*` riêng lẻ). Config shadcn (`components.json`) dùng style `radix-rhea`, base color `neutral`, không prefix, icon library `lucide`.
- Path alias `@/*` → `src/*` (xem alias trong `tsconfig.json` và `components.json`).
