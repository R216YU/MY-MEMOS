import { getCategoriesTree } from "@/shared/repository/category-repository";
import { getPostById } from "@/shared/repository/post-repository";
import EditorPageClient from "./_components/editor-page-client";

type Props = {
  searchParams: Promise<{ postId?: string }>;
};

const EditorPage = async ({ searchParams }: Props) => {
  const { postId } = await searchParams;
  const [categories, selectedPost] = await Promise.all([
    getCategoriesTree(),
    postId ? getPostById(Number(postId)) : Promise.resolve(null),
  ]);

  return (
    <EditorPageClient
      categories={categories}
      selectedPost={selectedPost ?? null}
    />
  );
};

export default EditorPage;
