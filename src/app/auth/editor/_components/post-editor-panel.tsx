"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/shadcn/components/ui/alert-dialog";
import { Button } from "@/shadcn/components/ui/button";
import { Input } from "@/shadcn/components/ui/input";
import { Label } from "@/shadcn/components/ui/label";
import { Separator } from "@/shadcn/components/ui/separator";
import { Switch } from "@/shadcn/components/ui/switch";
import { Save, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { deletePostAction, updatePostAction } from "../_actions/post-actions";
import type { PostDetail } from "../_types";
import RichEditor from "./rich-editor";

type Props = {
  post: PostDetail;
};

const PostEditorPanel = ({ post }: Props) => {
  const router = useRouter();
  const [title, setTitle] = useState(post.title);
  const [content, setContent] = useState(post.content ?? "");
  const [published, setPublished] = useState(post.published);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    if (!title.trim()) {
      toast.error("タイトルを入力してください");
      return;
    }
    setIsSaving(true);
    try {
      await updatePostAction(post.id, { title: title.trim(), content, published });
      toast.success("保存しました", { description: title.trim() });
      router.refresh();
    } catch {
      toast.error("保存に失敗しました");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      await deletePostAction(post.id);
      toast.success("削除しました", { description: title });
      router.push("/auth/editor");
      router.refresh();
    } catch {
      toast.error("削除に失敗しました");
    }
  };

  return (
    <div className="flex h-full flex-col overflow-hidden">
      {/* タイトル入力エリア */}
      <div className="px-8 pt-6 pb-3">
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="タイトルを入力"
          className="border-0 px-0 text-2xl font-bold shadow-none focus-visible:ring-0 placeholder:text-muted-foreground/50"
          onKeyDown={(e) => {
            if (e.key === "Enter") e.preventDefault();
          }}
        />
      </div>

      <Separator />

      {/* TipTap エディター */}
      <RichEditor content={content} onChange={setContent} />

      <Separator />

      {/* フッター */}
      <div className="flex items-center justify-between px-8 py-3">
        <div className="flex items-center gap-2">
          <Switch
            id="published"
            checked={published}
            onCheckedChange={setPublished}
          />
          <Label htmlFor="published" className="cursor-pointer text-sm">
            {published ? "公開" : "下書き"}
          </Label>
        </div>

        <div className="flex items-center gap-2">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Trash2 className="mr-1.5 size-3.5" />
                削除
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>「{title}」を削除しますか？</AlertDialogTitle>
                <AlertDialogDescription>
                  この記事は完全に削除されます。この操作は取り消せません。
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>キャンセル</AlertDialogCancel>
                <AlertDialogAction
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  onClick={handleDelete}
                >
                  削除する
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          <Button size="sm" onClick={handleSave} disabled={isSaving}>
            <Save className="mr-1.5 size-3.5" />
            {isSaving ? "保存中..." : "保存"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PostEditorPanel;

