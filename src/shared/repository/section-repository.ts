import { prisma } from "../libs/prisma";

export type CreateSectionInput = {
  name: string;
  categoryId: number;
  order?: number;
};

export type UpdateSectionInput = {
  name?: string;
  order?: number;
};

export const getSectionsByCategoryId = async (categoryId: number) => {
  return prisma.section.findMany({
    where: { categoryId },
    orderBy: { order: "asc" },
  });
};

export const getSectionById = async (id: number) => {
  return prisma.section.findUnique({ where: { id } });
};

export const createSection = async (data: CreateSectionInput) => {
  return prisma.section.create({ data });
};

export const updateSection = async (id: number, data: UpdateSectionInput) => {
  return prisma.section.update({ where: { id }, data });
};

export const deleteSection = async (id: number) => {
  return prisma.section.delete({ where: { id } });
};
