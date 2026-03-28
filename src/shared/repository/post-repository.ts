import { prisma } from "../libs/prisma";

export type CreatePostInput = {
  title: string;
  sectionId: number;
  content?: string;
  order?: number;
  published?: boolean;
};

export type UpdatePostInput = {
  title?: string;
  content?: string;
  order?: number;
  published?: boolean;
};

export const getPostsBySectionId = async (sectionId: number) => {
  return prisma.post.findMany({
    where: { sectionId },
    orderBy: { order: "asc" },
  });
};

export const getPostById = async (id: number) => {
  return prisma.post.findUnique({ where: { id } });
};

export const createPost = async (data: CreatePostInput) => {
  return prisma.post.create({ data });
};

export const updatePost = async (id: number, data: UpdatePostInput) => {
  return prisma.post.update({ where: { id }, data });
};

export const deletePost = async (id: number) => {
  return prisma.post.delete({ where: { id } });
};
