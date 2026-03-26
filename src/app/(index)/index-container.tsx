import { prisma } from "@/shared/libs/prisma";
import IndexPresentation from "./index-presentation";

const fetchUsers = async () => {
  const users = await prisma.user.findMany();
  return users;
};

const users = await fetchUsers();

/**
 * データを取得するコンテナコンポーネント
 * @returns IndexPresentationコンポーネント
 */
const IndexContainer = async () => {
  return <IndexPresentation users={users} />;
};

export default IndexContainer;
