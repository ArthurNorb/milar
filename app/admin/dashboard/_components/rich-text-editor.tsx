"use client";

import { useRef, useState } from "react";
import { EditorContent, useEditor, useEditorState, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import ImageExtension from "@tiptap/extension-image";
import { Placeholder } from "@tiptap/extension-placeholder";
import {
  Bold,
  Heading2,
  Heading3,
  ImagePlus,
  Italic,
  Link2,
  Link2Off,
  List,
  ListOrdered,
  Loader2,
  Minus,
  Quote,
  Redo2,
  Undo2,
} from "lucide-react";
import { uploadImage } from "@/lib/upload-client";
import { getErrorMessage } from "@/lib/utils";

interface RichTextEditorProps {
  /** HTML inicial. Para trocar de artigo, remonte o componente com outra `key`. */
  initialHtml: string;
  onChange: (html: string) => void;
  onError: (message: string) => void;
}

export default function RichTextEditor({
  initialHtml,
  onChange,
  onError,
}: RichTextEditorProps) {
  const editor = useEditor({
    // Evita divergência de hidratação no App Router.
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] },
        code: false,
        codeBlock: false,
        link: {
          openOnClick: false,
          autolink: true,
          defaultProtocol: "https",
          protocols: ["http", "https", "mailto", "tel"],
        },
      }),
      ImageExtension.configure({ inline: false, allowBase64: false }),
      Placeholder.configure({
        placeholder: "Comece a escrever o artigo… Use os botões acima para títulos, listas e fotos.",
      }),
    ],
    content: initialHtml,
    editorProps: {
      attributes: {
        class:
          "post-content min-h-[420px] px-6 py-6 outline-none [&_.is-editor-empty:first-child]:before:content-[attr(data-placeholder)] [&_.is-editor-empty:first-child]:before:text-[#756d47]/50 [&_.is-editor-empty:first-child]:before:float-left [&_.is-editor-empty:first-child]:before:pointer-events-none [&_.is-editor-empty:first-child]:before:h-0 [&_img.ProseMirror-selectednode]:ring-2 [&_img.ProseMirror-selectednode]:ring-[#87381e]",
      },
    },
    onUpdate: ({ editor: current }) => onChange(current.getHTML()),
  });

  return (
    <div className="rounded-2xl border border-[#bfa086]/30 bg-white/70 overflow-hidden">
      {editor && <Toolbar editor={editor} onError={onError} />}
      <EditorContent editor={editor} />
    </div>
  );
}

function Toolbar({ editor, onError }: { editor: Editor; onError: (message: string) => void }) {
  const fileInput = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const state = useEditorState({
    editor,
    selector: ({ editor: e }) => ({
      h2: e.isActive("heading", { level: 2 }),
      h3: e.isActive("heading", { level: 3 }),
      bold: e.isActive("bold"),
      italic: e.isActive("italic"),
      bullet: e.isActive("bulletList"),
      ordered: e.isActive("orderedList"),
      quote: e.isActive("blockquote"),
      link: e.isActive("link"),
      canUndo: e.can().undo(),
      canRedo: e.can().redo(),
    }),
  });

  const setLink = () => {
    const previous = editor.getAttributes("link").href as string | undefined;
    const url = window.prompt("Endereço do link (ex.: https://…)", previous ?? "https://");
    if (url === null) return;
    if (!url.trim() || url.trim() === "https://") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url.trim() }).run();
  };

  const handleImages = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);
    event.target.value = "";
    if (!files.length) return;

    setUploading(true);
    try {
      for (const file of files) {
        const src = await uploadImage(file, "blog");
        editor.chain().focus().setImage({ src, alt: "" }).run();
      }
    } catch (error: unknown) {
      onError(`Erro ao enviar a foto: ${getErrorMessage(error)}`);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-1 border-b border-[#bfa086]/30 bg-[#e3d9ce]/60 px-3 py-2 sticky top-0 z-10">
      <ToolButton label="Título" active={state.h2} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>
        <Heading2 className="w-4 h-4" />
      </ToolButton>
      <ToolButton label="Subtítulo" active={state.h3} onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}>
        <Heading3 className="w-4 h-4" />
      </ToolButton>
      <Divider />
      <ToolButton label="Negrito" active={state.bold} onClick={() => editor.chain().focus().toggleBold().run()}>
        <Bold className="w-4 h-4" />
      </ToolButton>
      <ToolButton label="Itálico" active={state.italic} onClick={() => editor.chain().focus().toggleItalic().run()}>
        <Italic className="w-4 h-4" />
      </ToolButton>
      <ToolButton label={state.link ? "Editar link" : "Inserir link"} active={state.link} onClick={setLink}>
        <Link2 className="w-4 h-4" />
      </ToolButton>
      {state.link && (
        <ToolButton label="Remover link" onClick={() => editor.chain().focus().extendMarkRange("link").unsetLink().run()}>
          <Link2Off className="w-4 h-4" />
        </ToolButton>
      )}
      <Divider />
      <ToolButton label="Lista" active={state.bullet} onClick={() => editor.chain().focus().toggleBulletList().run()}>
        <List className="w-4 h-4" />
      </ToolButton>
      <ToolButton label="Lista numerada" active={state.ordered} onClick={() => editor.chain().focus().toggleOrderedList().run()}>
        <ListOrdered className="w-4 h-4" />
      </ToolButton>
      <ToolButton label="Citação" active={state.quote} onClick={() => editor.chain().focus().toggleBlockquote().run()}>
        <Quote className="w-4 h-4" />
      </ToolButton>
      <ToolButton label="Linha divisória" onClick={() => editor.chain().focus().setHorizontalRule().run()}>
        <Minus className="w-4 h-4" />
      </ToolButton>
      <Divider />
      <ToolButton label="Inserir foto" disabled={uploading} onClick={() => fileInput.current?.click()}>
        {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ImagePlus className="w-4 h-4" />}
        <span className="font-['Spartan'] text-[9px] uppercase tracking-widest">Foto</span>
      </ToolButton>
      <input
        ref={fileInput}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={handleImages}
      />
      <div className="ml-auto flex items-center gap-1">
        <ToolButton label="Desfazer" disabled={!state.canUndo} onClick={() => editor.chain().focus().undo().run()}>
          <Undo2 className="w-4 h-4" />
        </ToolButton>
        <ToolButton label="Refazer" disabled={!state.canRedo} onClick={() => editor.chain().focus().redo().run()}>
          <Redo2 className="w-4 h-4" />
        </ToolButton>
      </div>
    </div>
  );
}

function ToolButton({
  label,
  active = false,
  disabled = false,
  onClick,
  children,
}: {
  label: string;
  active?: boolean;
  disabled?: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      aria-pressed={active}
      disabled={disabled}
      onClick={onClick}
      className={`flex items-center gap-1.5 h-9 min-w-9 px-2 justify-center rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed ${
        active
          ? "bg-[#2e3d30] text-[#e3d9ce]"
          : "text-[#2e3d30]/70 hover:bg-[#2e3d30]/10 hover:text-[#2e3d30]"
      }`}
    >
      {children}
    </button>
  );
}

function Divider() {
  return <span className="mx-1 h-5 w-px bg-[#bfa086]/40" aria-hidden />;
}
