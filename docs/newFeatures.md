isSubmitting: ko cho thêm liên tục

const [isSubmitting, setIsSubmitting] = useState(false)
setIsSubmitting(true)

try {
  // create / update
} catch (error) {
  // error
} finally {
  setIsSubmitting(false)
}
<Button
  type="submit"
  disabled={isSubmitting}
>
  {isSubmitting
    ? "Đang lưu..."
    : mode === "create"
      ? "Create"
      : "Save"}
</Button>