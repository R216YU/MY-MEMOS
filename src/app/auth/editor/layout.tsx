import type { Metadata } from "next";
import type React from "react";

export const metadata: Metadata = {
  title: "MY-MEMOS - Editor",
};

const EditorLayout = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>;
};

export default EditorLayout;
