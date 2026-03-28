"use server";

import { revalidatePath } from "next/cache";
import {
  createCategory,
  deleteCategory,
  updateCategory,
  type CreateCategoryInput,
  type UpdateCategoryInput,
} from "@/shared/repository/category-repository";

export const createCategoryAction = async (name: string) => {
  const category = await createCategory({ name });
  revalidatePath("/auth/editor");
  return category;
};

export const updateCategoryAction = async (
  id: number,
  data: UpdateCategoryInput,
) => {
  const category = await updateCategory(id, data);
  revalidatePath("/auth/editor");
  return category;
};

export const deleteCategoryAction = async (id: number) => {
  await deleteCategory(id);
  revalidatePath("/auth/editor");
};
