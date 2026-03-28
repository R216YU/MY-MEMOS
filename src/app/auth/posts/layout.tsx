import type { Metadata } from "next";
import type React from "react";

type Props = {
  children: React.ReactNode;
};

export const metadata: Metadata = {
  title: "MY-MEMOS - Auth/Posts",
};

const AuthPostsLayout = ({ children }: Props) => {
  return <>{children}</>;
};

export default AuthPostsLayout;
