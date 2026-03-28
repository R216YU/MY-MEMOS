/**
 * 環境変数は必ずこのファイルで定義すること。
 * また、このアプリは静的ビルディングするため、すべての環境変数はクライアントサイドで利用できるようにする
 */
import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  shared: {
    NODE_ENV: z.enum(["development", "production"]),
  },
  runtimeEnv: {
    NODE_ENV: process.env.NODE_ENV,
  },
});
