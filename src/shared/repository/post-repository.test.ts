import { beforeEach, describe, expect, it, vi } from "vitest";

const mockPost = vi.hoisted(() => ({
  findMany: vi.fn(),
  findUnique: vi.fn(),
  create: vi.fn(),
  update: vi.fn(),
  delete: vi.fn(),
}));

vi.mock("../libs/prisma", () => ({
  prisma: { post: mockPost },
}));

import {
  createPost,
  deletePost,
  getPostById,
  getPostsBySectionId,
  updatePost,
} from "./post-repository";

describe("post-repository", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getPostsBySectionId", () => {
    it("セクションIDに一致する記事をorder昇順で取得する", async () => {
      const posts = [
        { id: 1, title: "useStateについて", content: null, order: 0, published: true, sectionId: 1 },
        { id: 2, title: "useEffectについて", content: null, order: 1, published: true, sectionId: 1 },
      ];
      mockPost.findMany.mockResolvedValue(posts);

      const result = await getPostsBySectionId(1);

      expect(mockPost.findMany).toHaveBeenCalledWith({
        where: { sectionId: 1 },
        orderBy: { order: "asc" },
      });
      expect(result).toEqual(posts);
    });

    it("該当記事が存在しない場合は空配列を返す", async () => {
      mockPost.findMany.mockResolvedValue([]);

      const result = await getPostsBySectionId(999);

      expect(result).toEqual([]);
    });
  });

  describe("getPostById", () => {
    it("IDに一致する記事を取得する", async () => {
      const post = {
        id: 1,
        title: "useStateについて",
        content: "# useState\n本文",
        order: 0,
        published: true,
        sectionId: 1,
      };
      mockPost.findUnique.mockResolvedValue(post);

      const result = await getPostById(1);

      expect(mockPost.findUnique).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(result).toEqual(post);
    });

    it("存在しないIDの場合はnullを返す", async () => {
      mockPost.findUnique.mockResolvedValue(null);

      const result = await getPostById(999);

      expect(result).toBeNull();
    });
  });

  describe("createPost", () => {
    it("新しい記事を作成する", async () => {
      const input = {
        title: "useContextについて",
        sectionId: 1,
        content: "# useContext",
        order: 2,
        published: false,
      };
      const created = { id: 3, ...input };
      mockPost.create.mockResolvedValue(created);

      const result = await createPost(input);

      expect(mockPost.create).toHaveBeenCalledWith({ data: input });
      expect(result).toEqual(created);
    });

    it("オプション項目を省略した場合もデータをそのまま渡す", async () => {
      const input = { title: "概要", sectionId: 1 };
      const created = {
        id: 4,
        title: "概要",
        content: null,
        order: 0,
        published: false,
        sectionId: 1,
      };
      mockPost.create.mockResolvedValue(created);

      const result = await createPost(input);

      expect(mockPost.create).toHaveBeenCalledWith({ data: input });
      expect(result).toEqual(created);
    });
  });

  describe("updatePost", () => {
    it("IDに一致する記事を更新する", async () => {
      const data = { title: "useState詳細", content: "更新された本文" };
      const updated = {
        id: 1,
        title: "useState詳細",
        content: "更新された本文",
        order: 0,
        published: true,
        sectionId: 1,
      };
      mockPost.update.mockResolvedValue(updated);

      const result = await updatePost(1, data);

      expect(mockPost.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data,
      });
      expect(result).toEqual(updated);
    });

    it("publishedのみ更新する", async () => {
      const data = { published: true };
      const updated = {
        id: 1,
        title: "useStateについて",
        content: null,
        order: 0,
        published: true,
        sectionId: 1,
      };
      mockPost.update.mockResolvedValue(updated);

      const result = await updatePost(1, data);

      expect(mockPost.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data,
      });
      expect(result).toEqual(updated);
    });
  });

  describe("deletePost", () => {
    it("IDに一致する記事を削除する", async () => {
      const deleted = {
        id: 1,
        title: "useStateについて",
        content: null,
        order: 0,
        published: true,
        sectionId: 1,
      };
      mockPost.delete.mockResolvedValue(deleted);

      const result = await deletePost(1);

      expect(mockPost.delete).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(result).toEqual(deleted);
    });
  });
});
