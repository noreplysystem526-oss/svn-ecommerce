Supabase DB
   ↓
Generate types ----- cmd line gen type: npx supabase gen types typescript --project-id cppqtksyzoljynrijopa > src\lib\supabase\database.types.ts
   ↓
Update database.ts ----- src\types\database.ts
   ↓
Create Repo(GET)/ Action (Mutation)
   ↓
Resource Config:    Tạo [resource].config.ts trong lib/resource
                    Thêm config vào trong lib/resources/index.ts
   ↓

Validation Schema   Tạo [resource].schema.ts trong lib/validation
                    Thêm schema vào trong lib/validation/index.ts
   ↓
Khai báo trong src\lib\validation\index.ts
   ↓
Thêm vào src\lib\resources\repositories.ts để lấy getAll() dữ liệu
   ↓
Register resource
   ↓
/admin/brands
   ↓
Thêm vào side bar ----- Thêm vào src\components\admin\app-sidebar.tsx : Title URL Icon 
   ↓
Dynamic Table + Form tự chạy

// Testing 
- Truy cập vào /admin/[resource]/page
- Add dữ liệu rỗng -> Check validation-> Add dữ liệu thật
- Check hiển thị ở res page
- Sửa dữ liệu 