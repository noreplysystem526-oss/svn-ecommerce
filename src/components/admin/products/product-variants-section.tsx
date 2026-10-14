"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";

import {
  createProductVariantAction,
  updateProductVariantAction,
  deleteProductVariantAction,
} from "@/lib/actions/product-variant.actions";

import type { Database } from "@/lib/supabase/database.types";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { uploadMediaLibraryAction } from "@/lib/actions/media.actions";

type ProductVariant = Database["public"]["Tables"]["product_variants"]["Row"];

interface ProductVariantsSectionProps {
  productId: string;
  initialVariants: ProductVariant[];
}

type VariantFormData = {
  name: string;
  sku: string;
  price: string;
  stock: string;
  attributes: string;
  is_active: boolean;
  image_url: string;
};

const emptyForm: VariantFormData = {
  name: "",
  sku: "",
  price: "",
  stock: "0",
  attributes: "{}",
  is_active: true,
  image_url: "",
};

export function ProductVariantsSection({
  productId,
  initialVariants,
}: ProductVariantsSectionProps) {
  const [variants, setVariants] = useState(initialVariants);
  const [open, setOpen] = useState(false);
  const [editingVariant, setEditingVariant] =
    useState<ProductVariant | null>(null);
  const [form, setForm] = useState<VariantFormData>(emptyForm);
  const [isPending, startTransition] = useTransition();
  const [imageFile,setImageFile] = useState<File | null>(null);
  const [imagePreview,setImagePreview] = useState<string | null>(null);

  function openCreateDialog() {
    setEditingVariant(null);
    setForm(emptyForm);
    setOpen(true);
  }

  function openEditDialog(variant: ProductVariant) {
    setEditingVariant(variant);

    setForm({
      name: variant.name,
      sku: variant.sku ?? "",
      price: variant.price == null ? "" : String(variant.price),
      stock: String(variant.stock),
      attributes: JSON.stringify(variant.attributes, null, 2),
      is_active: variant.is_active,
      image_url: variant.image_url ?? "",
    });

    setOpen(true);
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    let imageUrl: string | null = form.image_url.trim() || null;

    if (imageFile) {
      const uploadMedia = await uploadMediaLibraryAction(
        imageFile,
        `product-variants/${productId}`
      );
      imageUrl = uploadMedia.url; // Assuming the upload function returns an object with a 'url' property
    }

    let attributes: Record<string, unknown>;

    try {
      const parsed: unknown = JSON.parse(form.attributes || "{}");

      if (
        parsed === null ||
        typeof parsed !== "object" ||
        Array.isArray(parsed)
      ) {
        throw new Error("Attributes phải là một JSON object");
      }

      attributes = parsed as Record<string, unknown>;
    } catch {
      toast.error("Attributes phải là JSON object hợp lệ");
      return;
    }

    const price = form.price.trim() === ""
      ? null
      : Number(form.price);

    

    const stock = Number(form.stock);

    if (price !== null && (!Number.isFinite(price) || price < 0)) {
        toast.error("Giá phải là số không âm");
      return;
    }

    if (!Number.isInteger(stock) || stock < 0) {
      toast.error("Tồn kho phải là số nguyên không âm");
      return;
    }

    const sku = form.sku.trim() === "" ? null : form.sku.trim();

    
    //   const ifSkuExist = variants.find((v) => v.sku === sku );

    //   if(ifSkuExist){
    //     toast.error("Sản phẩm bị trùng SKU!")
    //     return;
    //   }
    

    const input = {
      name: form.name.trim(),
      sku,
      price,
      stock,
      attributes,
      is_active: form.is_active,
      image_url: imageUrl,
    };

    if (!input.name) {
      toast.error("Tên biến thể không được để trống");
      return;
    }

    startTransition(async () => {
      try {
        if (editingVariant) {
          const result = await updateProductVariantAction(
            editingVariant.id,
            input,
          );
          console.log("Updated variant:", result.data);

          setVariants((current) =>
            current.map((variant) =>
              variant.id === editingVariant.id
                ? result.data
                : variant,
            ),
          );

          toast.success("Cập nhật biến thể thành công");
        } else {
          const result = await createProductVariantAction({
            product_id: productId,
            ...input,
          });

          setVariants((current) => [...current, result.data]);

          toast.success("Tạo biến thể thành công");
        }

        setOpen(false);
      } catch (error) {
        toast.error(
          error instanceof Error
            ? error.message
            : "Không thể lưu biến thể",
        );
      }
    });
  }

  function handleDelete(variant: ProductVariant) {
    if (!window.confirm(`Bạn có chắc muốn xóa "${variant.name}"?`)) {
      return;
    }

    startTransition(async () => {
      try {
        await deleteProductVariantAction(variant.id, productId);

        setVariants((current) =>
          current.filter((item) => item.id !== variant.id),
        );

        toast.success("Xóa biến thể thành công");
      } catch (error) {
        toast.error(
          error instanceof Error
            ? error.message
            : "Không thể xóa biến thể",
        );
      }
    });
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between gap-4">
        <CardTitle>Product Variants</CardTitle>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button onClick={openCreateDialog}>
              Thêm biến thể
            </Button>
          </DialogTrigger>

          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>
                {editingVariant ? "Cập nhật biến thể" : "Tạo biến thể"}
              </DialogTitle>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="variant-name">Tên biến thể</Label>
                <Input
                  id="variant-name"
                  value={form.name}
                  onChange={(event) =>
                    setForm({ ...form, name: event.target.value })
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="variant-sku">SKU</Label>
                <Input
                  id="variant-sku"
                  value={form.sku}
                  onChange={(event) =>
                    setForm({ ...form, sku: event.target.value })
                  }
                />
              </div>

                  <div className="space-y-2">
                    <Label htmlFor="variant-image">Ảnh đại diện</Label>

                    <Input
                        id="variant-image"
                        type="file"
                        accept="image/png,image/jpeg,image/webp"
                        onChange={(event) => {
                        const file = event.target.files?.[0] ?? null;

                        setImageFile(file);
                        setImagePreview(file ? URL.createObjectURL(file) : null);
                        }}
                    />

                    {imagePreview && (
                        <img
                        src={imagePreview}
                        alt="Ảnh đại diện variant"
                        className="h-24 w-24 rounded-md border object-cover"
                        />
                    )}
                    </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="variant-price">Giá riêng</Label>
                  <Input
                    id="variant-price"
                    type="number"
                    step="any"
                    value={form.price}
                    onChange={(event) =>
                      setForm({ ...form, price: event.target.value })
                    }
                    placeholder="Dùng giá sản phẩm"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="variant-stock">Tồn kho</Label>
                  <Input
                    id="variant-stock"
                    type="number"
                    min="0"
                    step="1"
                    value={form.stock}
                    onChange={(event) =>
                      setForm({ ...form, stock: event.target.value })
                    }
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="variant-attributes">
                  Attributes (JSON)
                </Label>
                <textarea
                  id="variant-attributes"
                  className="border-input bg-background min-h-28 w-full rounded-md border px-3 py-2 font-mono text-sm"
                  value={form.attributes}
                  onChange={(event) =>
                    setForm({ ...form, attributes: event.target.value })
                  }
                  placeholder={'{\n  "color": "Đen"\n}'}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="variant-active">Đang hoạt động</Label>
                <Switch
                  id="variant-active"
                  checked={form.is_active}
                  onCheckedChange={(checked) =>
                    setForm({ ...form, is_active: checked })
                  }
                />
              </div>

              <Button type="submit" disabled={isPending} className="w-full">
                {isPending
                  ? "Đang lưu..."
                  : editingVariant
                    ? "Lưu thay đổi"
                    : "Tạo biến thể"}
                </Button>
            </form>
          </DialogContent>
        </Dialog>
      </CardHeader>

      <CardContent>
        {variants.length === 0 ? (
          <p className="text-muted-foreground py-8 text-center text-sm">
            Sản phẩm chưa có biến thể.
          </p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tên</TableHead>
                <TableHead>SKU</TableHead>
                <TableHead>Ảnh sản phẩm</TableHead>
                <TableHead>Giá</TableHead>
                <TableHead>Tồn kho</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead className="text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>

<TableBody>

              {variants.map((variant) => (

                <TableRow key={variant.id}>

                  <TableCell className="font-medium">

                    {variant.name}

                  </TableCell>

                  <TableCell>{variant.sku ?? "—"}</TableCell>

                  <TableCell>
                    {variant.image_url ? (
                        <img
                        src={variant.image_url}
                        alt={variant.name}
                        className="h-12 w-12 rounded-md border object-cover"
                        />
                    ) : (
                        <span className="text-muted-foreground text-sm">
                        Chưa có ảnh
                        </span>
                    )}
                    </TableCell>


                  <TableCell>

                    {variant.price == null

                      ? "Theo giá sản phẩm"

                      : new Intl.NumberFormat("vi-VN", {

                          style: "currency",

                          currency: "VND",

                        }).format(variant.price)}

                  </TableCell>

                  <TableCell>{variant.stock}</TableCell>

                  <TableCell>

                    <Badge

                      variant={variant.is_active ? "default" : "secondary"}

                    >

                      {variant.is_active ? "Hoạt động" : "Đã tắt"}

                    </Badge>

                  </TableCell>

                  <TableCell className="space-x-2 text-right">

                    <Button

                      size="sm"

                      variant="outline"

                      disabled={isPending}

                      onClick={() => openEditDialog(variant)}

                    >

                      Sửa

                    </Button>

                    <Button

                      size="sm"

                      variant="destructive"

                      disabled={isPending}

                      onClick={() => handleDelete(variant)}

                    >

                      Xóa

                    </Button>

                  </TableCell>

                </TableRow>

              ))}

            </TableBody>

          </Table>

        )}

      </CardContent>

    </Card>
    );
}