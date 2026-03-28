import type { NextConfig } from "next";

// ローカルエディター使用時は output を設定しない（Server Actions が動作するため）
// 静的エクスポート時は EXPORT=1 環境変数を設定して npm run build:export を実行する
const isExport = process.env.EXPORT === "1";

const nextConfig: NextConfig = {
  ...(isExport && { output: "export" }),
  reactCompiler: true,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
