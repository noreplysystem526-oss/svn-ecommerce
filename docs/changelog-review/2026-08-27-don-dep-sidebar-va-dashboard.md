# Dọn dẹp sidebar & admin dashboard — 27/08/2026

> Commit: `c97c28b` (Commit2(byMinh)) → `4222106` (Commit 3)

## Phạm vi thay đổi

8 file thay đổi, +230/-92 dòng — commit dọn dẹp, không thêm tính năng mới:

- `package.json`: thêm dependency `supabase` (CLI, `^2.116.0`) — dùng để generate type từ schema Supabase.
- `admin/layout.tsx`: bỏ import `DataTable` không dùng tới (dead import).
- `admin/page.tsx` (dashboard): bỏ việc tự dựng lại `SidebarProvider`/`AppSidebar`/`SiteHeader` bên trong page — vì các phần này **đã có sẵn ở `admin/layout.tsx`** bọc ngoài, tránh lồng sidebar 2 lần. Cũng bỏ import `data.json` không còn dùng trong page này.
- `admin/products/page.tsx`: xoá khối `<table>` HTML viết tay đã bị comment sẵn từ commit trước (~55 dòng dead code), vì đã chuyển hẳn sang dùng `<DataTable>`.
- `app-sidebar.tsx`: đổi nav item mẫu (Lifecycle/Analytics/Projects/Team) sang đúng domain ecommerce (Categories/Products/Orders/Customers); đổi brand "Acme Inc." → "SVN-ECOMMERCE".
- `data-table.tsx`: xoá dòng trắng thừa, bỏ 2 icon import không dùng (`IconCircleCheckFilled`, `IconLoader`).
- `lib/repository/product.ts`: đổi log lỗi từ message tĩnh sang `JSON.stringify(error, null, 2)` để debug dễ hơn (sửa đúng WARNING đã nêu ở review commit trước).

## Luồng hoạt động

Không có luồng nghiệp vụ mới — đây thuần là dọn dead code + tránh lồng layout kép. Xem sơ đồ luồng ở file review `2026-08-27-scaffold-du-an-va-crud-san-pham-dau-tien.md` (không đổi).

## Vấn đề phát hiện khi review

- **WARNING (kế thừa, chưa xử lý)** — Bug từ Commit2 (`admin/products/actions.ts` import sai path `@/repositories/products/repository`) **không nằm trong phạm vi thay đổi của commit này**, vẫn còn nguyên.
- **NITPICK** — `app-sidebar.tsx`: 3/4 nav item mới (Categories, Orders, Customers) vẫn để `url: "#"` (chưa trỏ route thật), chỉ "Products" trỏ đúng `/admin/products`.
- **NITPICK** — url của mục "Dashboard" và link brand ở đầu sidebar đổi từ `"#"` thành chuỗi rỗng `""`. Về hành vi, `href=""` sẽ resolve tương đối theo URL hiện tại (có thể gây điều hướng không mong muốn tuỳ path đang đứng), khác với `href="#"` (không làm gì, chỉ nhảy về đầu trang). Chưa gây lỗi ở giai đoạn này vì chưa ai bấm thật, nhưng nên thay bằng route thật hoặc giữ `"#"` khi chưa có route.

## Giải thích khái niệm liên quan

- **Layout composition trong Next.js App Router**: `layout.tsx` bọc ngoài mọi `page.tsx` con của nó và chỉ nên render 1 lần cho cả nhánh route. Nếu `page.tsx` tự dựng lại `SidebarProvider` như layout cha đã làm, sẽ bị lồng 2 lớp provider — đây là lỗi kiến trúc phổ biến khi mới làm quen App Router, không phải style choice.
- **Dead code / dead import**: code bị comment "phòng khi cần lại" hoặc import không dùng nên được xoá hẳn ngay khi phát hiện, không giữ lại — giữ codebase phản ánh đúng những gì đang thực sự chạy, tránh người đọc sau nhầm giữa code thật và code chết.

## Việc cần làm / follow-up

- Gán route thật cho Categories/Orders/Customers trong sidebar khi các trang admin tương ứng có UI.
- Vẫn nợ: sửa import hỏng ở `admin/products/actions.ts` (kế thừa từ Commit2, xem file review 2026-08-31 để biết vì sao chưa xử lý được ở bản refactor tiếp theo).
