"use client";

import { Separator } from "@/shadcn/components/ui/separator";
import { Toggle } from "@/shadcn/components/ui/toggle";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/shadcn/components/ui/tooltip";
import Placeholder from "@tiptap/extension-placeholder";
import type { Editor } from "@tiptap/react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import {
  Bold,
  Code,
  Code2,
  Heading1,
  Heading2,
  Heading3,
  Italic,
  List,
  ListOrdered,
  Minus,
  Quote,
  Redo2,
  Strikethrough,
  Undo2,
} from "lucide-react";
import type { ReactNode } from "react";
import { useEffect } from "react";
import { Markdown } from "tiptap-markdown";

type ToolbarToggleProps = {
  label: string;
  pressed: boolean;
  onPressedChange: () => void;
  children: ReactNode;
};

const ToolbarToggle = ({ label, pressed, onPressedChange, children }: ToolbarToggleProps) => (
  <Tooltip>
    <TooltipTrigger asChild>
      <Toggle size="sm" pressed={pressed} onPressedChange={onPressedChange} aria-label={label}>
        {children}
      </Toggle>
    </TooltipTrigger>
    <TooltipContent>{label}</TooltipContent>
  </Tooltip>
);

type ToolbarActionProps = {
  label: string;
  onClick: () => void;
  children: ReactNode;
};

const ToolbarAction = ({ label, onClick, children }: ToolbarActionProps) => (
  <Tooltip>
    <TooltipTrigger asChild>
      <Toggle size="sm" onPressedChange={onClick} aria-label={label}>
        {children}
      </Toggle>
    </TooltipTrigger>
    <TooltipContent>{label}</TooltipContent>
  </Tooltip>
);

const Toolbar = ({ editor }: { editor: Editor }) => (
  <div className="flex flex-wrap items-center gap-0.5 border-b border-border bg-muted/30 px-3 py-1.5">
    {/* テキスト装飾 */}
    <ToolbarToggle
      label="太字 (Ctrl+B)"
      pressed={editor.isActive("bold")}
      onPressedChange={() => editor.chain().focus().toggleBold().run()}
    >
      <Bold className="size-3.5" />
    </ToolbarToggle>
    <ToolbarToggle
      label="斜体 (Ctrl+I)"
      pressed={editor.isActive("italic")}
      onPressedChange={() => editor.chain().focus().toggleItalic().run()}
    >
      <Italic className="size-3.5" />
    </ToolbarToggle>
    <ToolbarToggle
      label="取り消し線"
      pressed={editor.isActive("strike")}
      onPressedChange={() => editor.chain().focus().toggleStrike().run()}
    >
      <Strikethrough className="size-3.5" />
    </ToolbarToggle>
    <ToolbarToggle
      label="インラインコード"
      pressed={editor.isActive("code")}
      onPressedChange={() => editor.chain().focus().toggleCode().run()}
    >
      <Code className="size-3.5" />
    </ToolbarToggle>

    <Separator orientation="vertical" className="mx-1 h-5" />

    {/* 見出し */}
    <ToolbarToggle
      label="見出し 1"
      pressed={editor.isActive("heading", { level: 1 })}
      onPressedChange={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
    >
      <Heading1 className="size-3.5" />
    </ToolbarToggle>
    <ToolbarToggle
      label="見出し 2"
      pressed={editor.isActive("heading", { level: 2 })}
      onPressedChange={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
    >
      <Heading2 className="size-3.5" />
    </ToolbarToggle>
    <ToolbarToggle
      label="見出し 3"
      pressed={editor.isActive("heading", { level: 3 })}
      onPressedChange={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
    >
      <Heading3 className="size-3.5" />
    </ToolbarToggle>

    <Separator orientation="vertical" className="mx-1 h-5" />

    {/* リスト・ブロック */}
    <ToolbarToggle
      label="箇条書き"
      pressed={editor.isActive("bulletList")}
      onPressedChange={() => editor.chain().focus().toggleBulletList().run()}
    >
      <List className="size-3.5" />
    </ToolbarToggle>
    <ToolbarToggle
      label="番号付きリスト"
      pressed={editor.isActive("orderedList")}
      onPressedChange={() => editor.chain().focus().toggleOrderedList().run()}
    >
      <ListOrdered className="size-3.5" />
    </ToolbarToggle>
    <ToolbarToggle
      label="コードブロック"
      pressed={editor.isActive("codeBlock")}
      onPressedChange={() => editor.chain().focus().toggleCodeBlock().run()}
    >
      <Code2 className="size-3.5" />
    </ToolbarToggle>
    <ToolbarToggle
      label="引用"
      pressed={editor.isActive("blockquote")}
      onPressedChange={() => editor.chain().focus().toggleBlockquote().run()}
    >
      <Quote className="size-3.5" />
    </ToolbarToggle>
    <ToolbarAction
      label="水平線"
      onClick={() => editor.chain().focus().setHorizontalRule().run()}
    >
      <Minus className="size-3.5" />
    </ToolbarAction>

    <Separator orientation="vertical" className="mx-1 h-5" />

    {/* 履歴 */}
    <ToolbarAction
      label="元に戻す (Ctrl+Z)"
      onClick={() => editor.chain().focus().undo().run()}
    >
      <Undo2 className="size-3.5" />
    </ToolbarAction>
    <ToolbarAction
      label="やり直す (Ctrl+Y)"
      onClick={() => editor.chain().focus().redo().run()}
    >
      <Redo2 className="size-3.5" />
    </ToolbarAction>
  </div>
);

type Props = {
  content: string;
  onChange: (markdown: string) => void;
};

const RichEditor = ({ content, onChange }: Props) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Markdown.configure({ html: false, transformPastedText: true }),
      Placeholder.configure({ placeholder: "本文を入力してください..." }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.storage.markdown.getMarkdown());
    },
  });

  // 記事切り替え時にエディター内容を更新
  useEffect(() => {
    if (editor && content !== editor.storage.markdown.getMarkdown()) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  if (!editor) return null;

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <Toolbar editor={editor} />
      <EditorContent
        editor={editor}
        className="prose prose-sm dark:prose-invert max-w-none flex-1 overflow-y-auto px-8 py-6 [&_.tiptap]:min-h-full [&_.tiptap]:outline-none [&_.tiptap_p.is-editor-empty:first-child::before]:pointer-events-none [&_.tiptap_p.is-editor-empty:first-child::before]:float-left [&_.tiptap_p.is-editor-empty:first-child::before]:h-0 [&_.tiptap_p.is-editor-empty:first-child::before]:text-muted-foreground [&_.tiptap_p.is-editor-empty:first-child::before]:content-[attr(data-placeholder)]"
      />
    </div>
  );
};

export default RichEditor;
