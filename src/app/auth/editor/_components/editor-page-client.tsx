"use client";

import { TooltipProvider } from "@/shadcn/components/ui/tooltip";
import type { CategoryWithSections, PostDetail } from "../_types";
import PostEditorPanel from "./post-editor-panel";
import TreeSidebar from "./tree-sidebar";

type Props = {
  categories: CategoryWithSections[];
  selectedPost: PostDetail | null;
};

const EditorPageClient = ({ categories, selectedPost }: Props) => {
  return (
    <TooltipProvider delayDuration={400}>
      <div className="flex h-screen overflow-hidden bg-background">
        <TreeSidebar
          categories={categories}
          selectedPostId={selectedPost?.id ?? null}
        />
        <main className="flex flex-1 flex-col overflow-hidden">
          {selectedPost ? (
            <PostEditorPanel key={selectedPost.id} post={selectedPost} />
          ) : (
            <div className="flex h-full flex-col items-center justify-center gap-2 text-muted-foreground">
              <span className="text-4xl">📝</span>
              <p className="text-sm">左のツリーから記事を選択してください</p>
            </div>
          )}
        </main>
      </div>
    </TooltipProvider>
  );
};

export default EditorPageClient;
