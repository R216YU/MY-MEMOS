import { prisma } from "../libs/prisma";

export type CreateCategoryInput = {
  name: string;
  order?: number;
};

export type UpdateCategoryInput = {
  name?: string;
  order?: number;
};

export const getCategories = async () => {
  return prisma.category.findMany({ orderBy: { order: "asc" } });
};

export const getCategoryById = async (id: number) => {
  return prisma.category.findUnique({ where: { id } });
};

/** エディターのツリー表示用：カテゴリ > セクション > 記事（タイトルのみ）を一括取得 */
export const getCategoriesTree = async () => {
  return prisma.category.findMany({
    orderBy: { order: "asc" },
    include: {
      sections: {
        orderBy: { order: "asc" },
        include: {
          posts: {
            orderBy: { order: "asc" },
            select: { id: true, title: true, order: true, published: true },
          },
        },
      },
    },
  });
};

export const createCategory = async (data: CreateCategoryInput) => {
  return prisma.category.create({ data });
};

export const updateCategory = async (
  id: number,
  data: UpdateCategoryInput,
) => {
  return prisma.category.update({ where: { id }, data });
};

export const deleteCategory = async (id: number) => {
  return prisma.category.delete({ where: { id } });
};
