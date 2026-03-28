import { beforeEach, describe, expect, it, vi } from "vitest";

const mockSection = vi.hoisted(() => ({
  findMany: vi.fn(),
  findUnique: vi.fn(),
  create: vi.fn(),
  update: vi.fn(),
  delete: vi.fn(),
}));

vi.mock("../libs/prisma", () => ({
  prisma: { section: mockSection },
}));

import {
  createSection,
  deleteSection,
  getSectionById,
  getSectionsByCategoryId,
  updateSection,
} from "./section-repository";

describe("section-repository", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getSectionsByCategoryId", () => {
    it("カテゴリIDに一致するセクションをorder昇順で取得する", async () => {
      const sections = [
        { id: 1, name: "フックス", order: 0, categoryId: 1 },
        { id: 2, name: "コンポーネント", order: 1, categoryId: 1 },
      ];
      mockSection.findMany.mockResolvedValue(sections);

      const result = await getSectionsByCategoryId(1);

      expect(mockSection.findMany).toHaveBeenCalledWith({
        where: { categoryId: 1 },
        orderBy: { order: "asc" },
      });
      expect(result).toEqual(sections);
    });

    it("該当セクションが存在しない場合は空配列を返す", async () => {
      mockSection.findMany.mockResolvedValue([]);

      const result = await getSectionsByCategoryId(999);

      expect(result).toEqual([]);
    });
  });

  describe("getSectionById", () => {
    it("IDに一致するセクションを取得する", async () => {
      const section = { id: 1, name: "フックス", order: 0, categoryId: 1 };
      mockSection.findUnique.mockResolvedValue(section);

      const result = await getSectionById(1);

      expect(mockSection.findUnique).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(result).toEqual(section);
    });

    it("存在しないIDの場合はnullを返す", async () => {
      mockSection.findUnique.mockResolvedValue(null);

      const result = await getSectionById(999);

      expect(result).toBeNull();
    });
  });

  describe("createSection", () => {
    it("新しいセクションを作成する", async () => {
      const input = { name: "非同期処理", categoryId: 1, order: 2 };
      const created = { id: 3, ...input };
      mockSection.create.mockResolvedValue(created);

      const result = await createSection(input);

      expect(mockSection.create).toHaveBeenCalledWith({ data: input });
      expect(result).toEqual(created);
    });

    it("orderを省略した場合もデータをそのまま渡す", async () => {
      const input = { name: "基礎", categoryId: 1 };
      const created = { id: 4, name: "基礎", order: 0, categoryId: 1 };
      mockSection.create.mockResolvedValue(created);

      const result = await createSection(input);

      expect(mockSection.create).toHaveBeenCalledWith({ data: input });
      expect(result).toEqual(created);
    });
  });

  describe("updateSection", () => {
    it("IDに一致するセクションを更新する", async () => {
      const data = { name: "フックス Updated" };
      const updated = { id: 1, name: "フックス Updated", order: 0, categoryId: 1 };
      mockSection.update.mockResolvedValue(updated);

      const result = await updateSection(1, data);

      expect(mockSection.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data,
      });
      expect(result).toEqual(updated);
    });

    it("orderのみ更新する", async () => {
      const data = { order: 3 };
      const updated = { id: 1, name: "フックス", order: 3, categoryId: 1 };
      mockSection.update.mockResolvedValue(updated);

      const result = await updateSection(1, data);

      expect(mockSection.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data,
      });
      expect(result).toEqual(updated);
    });
  });

  describe("deleteSection", () => {
    it("IDに一致するセクションを削除する", async () => {
      const deleted = { id: 1, name: "フックス", order: 0, categoryId: 1 };
      mockSection.delete.mockResolvedValue(deleted);

      const result = await deleteSection(1);

      expect(mockSection.delete).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(result).toEqual(deleted);
    });
  });
});
