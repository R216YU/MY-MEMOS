import type { getCategoriesTree } from "@/shared/repository/category-repository";
import type { getPostById } from "@/shared/repository/post-repository";

export type CategoriesTree = Awaited<ReturnType<typeof getCategoriesTree>>;
export type CategoryWithSections = CategoriesTree[number];
export type SectionWithPosts = CategoryWithSections["sections"][number];
export type PostSummary = SectionWithPosts["posts"][number];
export type PostDetail = NonNullable<Awaited<ReturnType<typeof getPostById>>>;
