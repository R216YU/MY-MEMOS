import { beforeEach, describe, expect, it, vi } from "vitest";

const mockCategory = vi.hoisted(() => ({
  findMany: vi.fn(),
  findUnique: vi.fn(),
  create: vi.fn(),
  update: vi.fn(),
  delete: vi.fn(),
}));

vi.mock("../libs/prisma", () => ({
  prisma: { category: mockCategory },
}));

import {
  createCategory,
  deleteCategory,
  getCategoryById,
  getCategoriesTree,
  getCategories,
  updateCategory,
} from "./category-repository";

describe("category-repository", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getCategories", () => {
    it("order昇順で全カテゴリを取得する", async () => {
      const categories = [
        { id: 1, name: "React", order: 0 },
        { id: 2, name: "TypeScript", order: 1 },
      ];
      mockCategory.findMany.mockResolvedValue(categories);

      const result = await getCategories();

      expect(mockCategory.findMany).toHaveBeenCalledWith({
        orderBy: { order: "asc" },
      });
      expect(result).toEqual(categories);
    });

    it("カテゴリが存在しない場合は空配列を返す", async () => {
      mockCategory.findMany.mockResolvedValue([]);

      const result = await getCategories();

      expect(result).toEqual([]);
    });
  });

  describe("getCategoryById", () => {
    it("IDに一致するカテゴリを取得する", async () => {
      const category = { id: 1, name: "React", order: 0 };
      mockCategory.findUnique.mockResolvedValue(category);

      const result = await getCategoryById(1);

      expect(mockCategory.findUnique).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(result).toEqual(category);
    });

    it("存在しないIDの場合はnullを返す", async () => {
      mockCategory.findUnique.mockResolvedValue(null);

      const result = await getCategoryById(999);

      expect(result).toBeNull();
    });
  });

  describe("createCategory", () => {
    it("新しいカテゴリを作成する", async () => {
      const input = { name: "Vue", order: 2 };
      const created = { id: 3, ...input };
      mockCategory.create.mockResolvedValue(created);

      const result = await createCategory(input);

      expect(mockCategory.create).toHaveBeenCalledWith({ data: input });
      expect(result).toEqual(created);
    });

    it("orderを省略した場合もデータをそのまま渡す", async () => {
      const input = { name: "Angular" };
      const created = { id: 4, name: "Angular", order: 0 };
      mockCategory.create.mockResolvedValue(created);

      const result = await createCategory(input);

      expect(mockCategory.create).toHaveBeenCalledWith({ data: input });
      expect(result).toEqual(created);
    });
  });

  describe("updateCategory", () => {
    it("IDに一致するカテゴリを更新する", async () => {
      const data = { name: "React Updated" };
      const updated = { id: 1, name: "React Updated", order: 0 };
      mockCategory.update.mockResolvedValue(updated);

      const result = await updateCategory(1, data);

      expect(mockCategory.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data,
      });
      expect(result).toEqual(updated);
    });

    it("orderのみ更新する", async () => {
      const data = { order: 5 };
      const updated = { id: 1, name: "React", order: 5 };
      mockCategory.update.mockResolvedValue(updated);

      const result = await updateCategory(1, data);

      expect(mockCategory.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data,
      });
      expect(result).toEqual(updated);
    });
  });

  describe("deleteCategory", () => {
    it("IDに一致するカテゴリを削除する", async () => {
      const deleted = { id: 1, name: "React", order: 0 };
      mockCategory.delete.mockResolvedValue(deleted);

      const result = await deleteCategory(1);

      expect(mockCategory.delete).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(result).toEqual(deleted);
    });
  });

  describe("getCategoriesTree", () => {
    it("カテゴリ・セクション・記事を階層的に取得する", async () => {
      const tree = [
        {
          id: 1,
          name: "React",
          order: 0,
          sections: [
            {
              id: 1,
              name: "フックス",
              order: 0,
              categoryId: 1,
              posts: [{ id: 1, title: "useStateについて", order: 0, published: true }],
            },
          ],
        },
      ];
      mockCategory.findMany.mockResolvedValue(tree);

      const result = await getCategoriesTree();

      expect(mockCategory.findMany).toHaveBeenCalledWith({
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
      expect(result).toEqual(tree);
    });
  });
});
