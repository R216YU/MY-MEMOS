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
import { Badge } from "@/shadcn/components/ui/badge";
import { Button } from "@/shadcn/components/ui/button";
import { ScrollArea } from "@/shadcn/components/ui/scroll-area";
import { Separator } from "@/shadcn/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/shadcn/components/ui/tooltip";
import {
  ChevronDown,
  ChevronRight,
  FilePlus2,
  FolderPlus,
  Pencil,
  Plus,
  Trash2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  createCategoryAction,
  deleteCategoryAction,
  updateCategoryAction,
} from "../_actions/category-actions";
import {
  createPostAction,
  deletePostAction,
} from "../_actions/post-actions";
import {
  createSectionAction,
  deleteSectionAction,
  updateSectionAction,
} from "../_actions/section-actions";
import type { CategoryWithSections } from "../_types";

type AddingState =
  | { type: "category" }
  | { type: "section"; categoryId: number }
  | { type: "post"; sectionId: number }
  | null;

type RenamingState =
  | { type: "category"; id: number; value: string }
  | { type: "section"; id: number; value: string }
  | null;

type Props = {
  categories: CategoryWithSections[];
  selectedPostId: number | null;
};

/** アイコンボタン + ツールチップのヘルパー */
const TooltipIconButton = ({
  label,
  onClick,
  className,
  children,
}: {
  label: string;
  onClick?: (e: React.MouseEvent) => void;
  className?: string;
  children: React.ReactNode;
}) => (
  <Tooltip>
    <TooltipTrigger asChild>
      <Button
        variant="ghost"
        size="icon-xs"
        className={className}
        onClick={onClick}
      >
        {children}
      </Button>
    </TooltipTrigger>
    <TooltipContent side="right">{label}</TooltipContent>
  </Tooltip>
);

/** 削除確認ダイアログ */
const DeleteDialog = ({
  itemName,
  itemType,
  onDelete,
  children,
}: {
  itemName: string;
  itemType: string;
  onDelete: () => Promise<void>;
  children: React.ReactNode;
}) => (
  <AlertDialog>
    <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>「{itemName}」を削除しますか？</AlertDialogTitle>
        <AlertDialogDescription>
          この{itemType}と、含まれるすべてのデータが削除されます。この操作は取り消せません。
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel>キャンセル</AlertDialogCancel>
        <AlertDialogAction
          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          onClick={onDelete}
        >
          削除する
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
);

/** インライン追加入力フィールド */
const InlineInput = ({
  placeholder,
  onSubmit,
  onCancel,
}: {
  placeholder: string;
  onSubmit: (v: string) => void;
  onCancel: () => void;
}) => (
  <input
    // biome-ignore lint/a11y/noAutofocus: インライン入力はすぐにフォーカスが必要
    autoFocus
    placeholder={placeholder}
    className="w-full rounded-md border border-ring bg-background px-2 py-1 text-sm outline-none ring-1 ring-ring/50 placeholder:text-muted-foreground"
    onBlur={(e) => {
      if (e.target.value.trim()) onSubmit(e.target.value.trim());
      else onCancel();
    }}
    onKeyDown={(e) => {
      if (e.key === "Enter") {
        const v = (e.target as HTMLInputElement).value.trim();
        if (v) onSubmit(v);
        else onCancel();
      }
      if (e.key === "Escape") onCancel();
    }}
  />
);

/** インラインリネーム入力フィールド */
const RenameInput = ({
  defaultValue,
  onSubmit,
  onCancel,
}: {
  defaultValue: string;
  onSubmit: (v: string) => void;
  onCancel: () => void;
}) => (
  <input
    // biome-ignore lint/a11y/noAutofocus: リネーム入力はすぐにフォーカスが必要
    autoFocus
    defaultValue={defaultValue}
    className="w-full rounded-md border border-ring bg-background px-2 py-0.5 text-sm outline-none ring-1 ring-ring/50"
    onBlur={(e) => {
      const v = e.target.value.trim();
      if (v && v !== defaultValue) onSubmit(v);
      else onCancel();
    }}
    onKeyDown={(e) => {
      if (e.key === "Enter") {
        const v = (e.target as HTMLInputElement).value.trim();
        if (v) onSubmit(v);
        else onCancel();
      }
      if (e.key === "Escape") onCancel();
    }}
  />
);

const TreeSidebar = ({ categories, selectedPostId }: Props) => {
  const router = useRouter();

  const [expandedCategories, setExpandedCategories] = useState<Set<number>>(
    () => {
      const cats = new Set<number>();
      if (!selectedPostId) return cats;
      for (const cat of categories) {
        for (const sec of cat.sections) {
          if (sec.posts.some((p) => p.id === selectedPostId)) cats.add(cat.id);
        }
      }
      return cats;
    },
  );

  const [expandedSections, setExpandedSections] = useState<Set<number>>(() => {
    const secs = new Set<number>();
    if (!selectedPostId) return secs;
    for (const cat of categories) {
      for (const sec of cat.sections) {
        if (sec.posts.some((p) => p.id === selectedPostId)) secs.add(sec.id);
      }
    }
    return secs;
  });

  const [adding, setAdding] = useState<AddingState>(null);
  const [renaming, setRenaming] = useState<RenamingState>(null);

  const toggleCategory = (id: number) =>
    setExpandedCategories((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  const toggleSection = (id: number) =>
    setExpandedSections((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  const handleAdd = async (value: string) => {
    if (!adding) return;
    if (adding.type === "category") {
      await createCategoryAction(value);
    } else if (adding.type === "section") {
      await createSectionAction({ name: value, categoryId: adding.categoryId });
      setExpandedCategories((p) => new Set(p).add(adding.categoryId));
    } else if (adding.type === "post") {
      const post = await createPostAction({ title: value, sectionId: adding.sectionId });
      setExpandedSections((p) => new Set(p).add(adding.sectionId));
      router.push(`/auth/editor?postId=${post.id}`);
    }
    setAdding(null);
    router.refresh();
  };

  const handleRename = async (value: string) => {
    if (!renaming) return;
    if (renaming.type === "category") {
      await updateCategoryAction(renaming.id, { name: value });
    } else {
      await updateSectionAction(renaming.id, { name: value });
    }
    setRenaming(null);
    router.refresh();
  };

  const isEmpty = categories.length === 0;

  return (
    <aside className="flex w-72 flex-col border-r border-border bg-sidebar">
      {/* ヘッダー */}
      <div className="flex h-14 items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <span className="text-base font-semibold tracking-tight">MY-MEMOS</span>
          <Badge variant="secondary" className="text-[10px]">Editor</Badge>
        </div>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="icon-sm"
              onClick={() => setAdding({ type: "category" })}
            >
              <Plus className="size-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right">カテゴリを追加</TooltipContent>
        </Tooltip>
      </div>

      <Separator />

      {/* ツリー */}
      <ScrollArea className="flex-1">
        <div className="py-2">
          {isEmpty && (
            <div className="px-4 py-8 text-center text-sm text-muted-foreground">
              <p>カテゴリがありません</p>
              <p className="mt-1 text-xs">右上の ＋ から追加してください</p>
            </div>
          )}

          {categories.map((cat) => (
            <div key={cat.id}>
              {/* カテゴリ行 */}
              <div className="group flex items-center gap-0.5 px-2 py-0.5 hover:bg-accent/50">
                <button
                  type="button"
                  className="flex-shrink-0 text-muted-foreground/70 hover:text-foreground"
                  onClick={() => toggleCategory(cat.id)}
                >
                  {expandedCategories.has(cat.id) ? (
                    <ChevronDown className="size-3.5" />
                  ) : (
                    <ChevronRight className="size-3.5" />
                  )}
                </button>

                {renaming?.type === "category" && renaming.id === cat.id ? (
                  <div className="flex-1 px-1">
                    <RenameInput
                      defaultValue={renaming.value}
                      onSubmit={handleRename}
                      onCancel={() => setRenaming(null)}
                    />
                  </div>
                ) : (
                  <button
                    type="button"
                    className="flex-1 truncate px-1 text-left text-sm font-medium"
                    onClick={() => toggleCategory(cat.id)}
                  >
                    {cat.name}
                  </button>
                )}

                <div className="hidden shrink-0 items-center gap-0.5 group-hover:flex">
                  <TooltipIconButton
                    label="セクションを追加"
                    onClick={() => {
                      setAdding({ type: "section", categoryId: cat.id });
                      setExpandedCategories((p) => new Set(p).add(cat.id));
                    }}
                  >
                    <FolderPlus className="size-3" />
                  </TooltipIconButton>
                  <TooltipIconButton
                    label="名前を変更"
                    onClick={() =>
                      setRenaming({ type: "category", id: cat.id, value: cat.name })
                    }
                  >
                    <Pencil className="size-3" />
                  </TooltipIconButton>
                  <DeleteDialog
                    itemName={cat.name}
                    itemType="カテゴリ"
                    onDelete={async () => {
                      await deleteCategoryAction(cat.id);
                      router.refresh();
                    }}
                  >
                    <Button variant="ghost" size="icon-xs">
                      <Trash2 className="size-3 text-destructive" />
                    </Button>
                  </DeleteDialog>
                </div>
              </div>

              {/* セクション一覧 */}
              {expandedCategories.has(cat.id) && (
                <div className="ml-3 border-l border-border/50 pl-2">
                  {cat.sections.map((sec) => (
                    <div key={sec.id}>
                      {/* セクション行 */}
                      <div className="group flex items-center gap-0.5 px-1 py-0.5 hover:bg-accent/50">
                        <button
                          type="button"
                          className="flex-shrink-0 text-muted-foreground/70 hover:text-foreground"
                          onClick={() => toggleSection(sec.id)}
                        >
                          {expandedSections.has(sec.id) ? (
                            <ChevronDown className="size-3.5" />
                          ) : (
                            <ChevronRight className="size-3.5" />
                          )}
                        </button>

                        {renaming?.type === "section" && renaming.id === sec.id ? (
                          <div className="flex-1 px-1">
                            <RenameInput
                              defaultValue={renaming.value}
                              onSubmit={handleRename}
                              onCancel={() => setRenaming(null)}
                            />
                          </div>
                        ) : (
                          <button
                            type="button"
                            className="flex-1 truncate px-1 text-left text-sm text-muted-foreground"
                            onClick={() => toggleSection(sec.id)}
                          >
                            {sec.name}
                          </button>
                        )}

                        <div className="hidden shrink-0 items-center gap-0.5 group-hover:flex">
                          <TooltipIconButton
                            label="記事を追加"
                            onClick={() => {
                              setAdding({ type: "post", sectionId: sec.id });
                              setExpandedSections((p) => new Set(p).add(sec.id));
                            }}
                          >
                            <FilePlus2 className="size-3" />
                          </TooltipIconButton>
                          <TooltipIconButton
                            label="名前を変更"
                            onClick={() =>
                              setRenaming({ type: "section", id: sec.id, value: sec.name })
                            }
                          >
                            <Pencil className="size-3" />
                          </TooltipIconButton>
                          <DeleteDialog
                            itemName={sec.name}
                            itemType="セクション"
                            onDelete={async () => {
                              await deleteSectionAction(sec.id);
                              router.refresh();
                            }}
                          >
                            <Button variant="ghost" size="icon-xs">
                              <Trash2 className="size-3 text-destructive" />
                            </Button>
                          </DeleteDialog>
                        </div>
                      </div>

                      {/* 記事一覧 */}
                      {expandedSections.has(sec.id) && (
                        <div className="ml-3 border-l border-border/50 pl-2">
                          {sec.posts.map((post) => {
                            const isSelected = selectedPostId === post.id;
                            return (
                              <div
                                key={post.id}
                                role="button"
                                tabIndex={0}
                                className={`group flex cursor-pointer items-center gap-1 rounded-md px-2 py-1 transition-colors hover:bg-accent ${
                                  isSelected
                                    ? "bg-accent font-medium text-accent-foreground"
                                    : "text-muted-foreground hover:text-foreground"
                                }`}
                                onClick={() =>
                                  router.push(`/auth/editor?postId=${post.id}`)
                                }
                                onKeyDown={(e) => {
                                  if (e.key === "Enter" || e.key === " ")
                                    router.push(`/auth/editor?postId=${post.id}`);
                                }}
                              >
                                <span className="flex-1 truncate text-xs">
                                  {post.title}
                                </span>
                                {!post.published && (
                                  <Badge
                                    variant="outline"
                                    className="h-4 px-1 text-[9px] text-muted-foreground"
                                  >
                                    下書き
                                  </Badge>
                                )}
                                <DeleteDialog
                                  itemName={post.title}
                                  itemType="記事"
                                  onDelete={async () => {
                                    await deletePostAction(post.id);
                                    if (selectedPostId === post.id) {
                                      router.push("/auth/editor");
                                    }
                                    router.refresh();
                                  }}
                                >
                                  <Button
                                    variant="ghost"
                                    size="icon-xs"
                                    className="hidden shrink-0 group-hover:flex"
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    <Trash2 className="size-3 text-destructive" />
                                  </Button>
                                </DeleteDialog>
                              </div>
                            );
                          })}

                          {/* 記事追加インライン入力 */}
                          {adding?.type === "post" && adding.sectionId === sec.id && (
                            <div className="px-2 py-1">
                              <InlineInput
                                placeholder="記事タイトルを入力..."
                                onSubmit={handleAdd}
                                onCancel={() => setAdding(null)}
                              />
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}

                  {/* セクション追加インライン入力 */}
                  {adding?.type === "section" && adding.categoryId === cat.id && (
                    <div className="px-1 py-1">
                      <InlineInput
                        placeholder="セクション名を入力..."
                        onSubmit={handleAdd}
                        onCancel={() => setAdding(null)}
                      />
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}

          {/* カテゴリ追加インライン入力 */}
          {adding?.type === "category" && (
            <div className="px-3 py-1">
              <InlineInput
                placeholder="カテゴリ名を入力..."
                onSubmit={handleAdd}
                onCancel={() => setAdding(null)}
              />
            </div>
          )}
        </div>
      </ScrollArea>
    </aside>
  );
};

export default TreeSidebar;
