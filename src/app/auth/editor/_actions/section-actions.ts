"use server";

import { revalidatePath } from "next/cache";
import {
  createSection,
  deleteSection,
  updateSection,
  type CreateSectionInput,
  type UpdateSectionInput,
} from "@/shared/repository/section-repository";

export const createSectionAction = async (data: CreateSectionInput) => {
  const section = await createSection(data);
  revalidatePath("/auth/editor");
  return section;
};

export const updateSectionAction = async (
  id: number,
  data: UpdateSectionInput,
) => {
  const section = await updateSection(id, data);
  revalidatePath("/auth/editor");
  return section;
};

export const deleteSectionAction = async (id: number) => {
  await deleteSection(id);
  revalidatePath("/auth/editor");
};
