import type { User } from "../../../generated/prisma/client";

type Props = {
  users: User[];
};

/**
 * データを表示するプレゼンテーションコンポーネント
 * @param users ユーザーデータの配列
 * @returns ユーザーデータを表示するJSX要素
 */
const IndexPresentation = ({ users }: Props) => {
  return (
    <div>
      <h1>Users:</h1>
      <ul>
        {users.map((user) => (
          <li key={user.id}>{user.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default IndexPresentation;
