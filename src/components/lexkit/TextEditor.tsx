"use client"

import { useEffect, useRef } from "react"

import {
  createEditorSystem,
  boldExtension,
  italicExtension,
  historyExtension,
  listExtension,
  linkExtension,
  htmlExtension,
  RichText,
} from "@lexkit/editor"

import "./basic-editor.css"

type TextEditorProps = {
  value: string
  onChange: (value: string) => void
}

/**
 * KHÔNG thêm `richTextExtension` vào mảng này.
 *
 * `richTextExtension.getPlugins()` tự render một <RichTextPlugin> (config.position
 * mặc định là "after"), mà <RichText /> cũng chính là component đó. Khai báo cả hai
 * => hai <ContentEditable> cùng trỏ vào một Lexical editor. Lexical chỉ giữ được
 * MỘT root element (cái gắn ref sau cùng thắng), nên ô đã style ở đây trở thành div
 * "chết": gõ chữ không vào editor state => placeholder không bao giờ tắt (đè lên chữ)
 * và updateListener không chạy => onChange không bắn => không lưu được.
 *
 * `htmlExtension` là thứ cung cấp commands.exportToHTML / importFromHTML.
 */
const extensions = [
  boldExtension,
  italicExtension,
  listExtension,
  linkExtension,
  historyExtension,
  htmlExtension,
] as const

const { Provider, useEditor } = createEditorSystem<typeof extensions>()

/** Lexical export ra <p><br></p> khi rỗng — quy về chuỗi rỗng */
export function normalizeHtml(html: string) {
  const text = html.replace(/<[^>]*>/g, "").replace(/&nbsp;/g, " ").trim()
  return text === "" ? "" : html
}

function Toolbar() {
  const { commands, activeStates } = useEditor()

  return (
    <div className="basic-toolbar">
      <button type="button" onClick={() => commands.toggleBold()}
        className={activeStates.bold ? "active" : ""}>Bold</button>

      <button type="button" onClick={() => commands.toggleItalic()}
        className={activeStates.italic ? "active" : ""}>Italic</button>

      <button type="button" onClick={() => commands.toggleUnorderedList()}
        className={activeStates.unorderedList ? "active" : ""}>• List</button>

      <button type="button" onClick={() => commands.toggleOrderedList()}
        className={activeStates.orderedList ? "active" : ""}>1. List</button>

      <button type="button" onClick={() => commands.undo()}
        disabled={!activeStates.canUndo}>↶ Undo</button>

      <button type="button" onClick={() => commands.redo()}
        disabled={!activeStates.canRedo}>↷ Redo</button>
    </div>
  )
}

function Editor({ value, onChange }: TextEditorProps) {
  const { editor, commands } = useEditor()

  const onChangeRef = useRef(onChange)
  const commandsRef = useRef(commands)
  // HTML mà editor và form đang "đồng ý" với nhau — dùng để chặn vòng lặp
  // import -> update -> onChange -> value đổi -> import ...
  const syncedHtmlRef = useRef<string>("")

  // Effect này phải khai báo ĐẦU TIÊN để hai effect bên dưới luôn đọc được ref mới nhất.
  useEffect(() => {
    onChangeRef.current = onChange
    commandsRef.current = commands
  })

  // Đăng ký một lần cho mỗi editor instance, chỉ emit khi nội dung thực sự đổi.
  // Dùng thẳng editor.registerUpdateListener thay vì listeners.registerUpdate vì object
  // `listeners`/`commands` từ context bị tạo mới mỗi lần render — để chúng trong deps sẽ
  // khiến listener bị huỷ/đăng ký lại sau từng phím gõ. `editor` thì ổn định.
  useEffect(() => {
    if (!editor) return

    return editor.registerUpdateListener(() => {
      const html = normalizeHtml(commandsRef.current.exportToHTML())

      if (html === syncedHtmlRef.current) return

      syncedHtmlRef.current = html
      onChangeRef.current(html)
    })
  }, [editor])

  // Nạp HTML từ form vào editor, kể cả khi dữ liệu về muộn (Server Component streaming).
  // Chỉ chạy khi `value` đến từ BÊN NGOÀI: nếu value bằng đúng thứ editor vừa export ra
  // (syncedHtmlRef) thì bỏ qua, nếu không mỗi phím gõ sẽ kích hoạt một lần import lại
  // và con trỏ bị nhảy về đầu.
  useEffect(() => {
    if (!editor) return

    const next = value ?? ""
    if (next === syncedHtmlRef.current) return

    syncedHtmlRef.current = next
    // preventFocus: tránh editor cướp con trỏ chuột khi form vừa load
    commandsRef.current.importFromHTML(next, { preventFocus: true })
  }, [editor, value])

  return (
    <div className="basic-editor">
      <Toolbar />
      <RichText
        classNames={{
          container: "basic-editor-container",
          contentEditable: "basic-content",
          placeholder: "basic-placeholder",
        }}
        placeholder="Start writing your content here..."
      />
    </div>
  )
}

export function TextEditor({ value, onChange }: TextEditorProps) {
  return (
    <Provider extensions={extensions}>
      <Editor value={value} onChange={onChange} />
    </Provider>
  )
}
