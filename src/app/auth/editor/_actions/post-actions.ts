"use server";

import { revalidatePath } from "next/cache";
import {
  createPost,
  deletePost,
  updatePost,
  type CreatePostInput,
  type UpdatePostInput,
} from "@/shared/repository/post-repository";

export const createPostAction = async (data: CreatePostInput) => {
  const post = await createPost(data);
  revalidatePath("/auth/editor");
  return post;
};

export const updatePostAction = async (id: number, data: UpdatePostInput) => {
  await updatePost(id, data);
  revalidatePath("/auth/editor");
};

export const deletePostAction = async (id: number) => {
  await deletePost(id);
  revalidatePath("/auth/editor");
};
