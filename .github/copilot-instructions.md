# ルール

1. 回答はすべて日本語で行う
2. React, Next.jsのベストプラクティスに従う
3. Linter, Formatter, Testで常にコード品質を保つ

## コマンド一覧

- `npm run lint`: Linterを実行する
- `npm run format`: Formatterを実行する
- `npm run build`: ビルドを実行する
- `npm run test`: Testを実行する
- `npm run prisma:generate`: Prisma Clientを生成する(Prismaの型定義を生成・更新する)
- `npm run prisma:migrate`: Prisma Migrateを実行する(データベースのマイグレーションを実行する)

## 命名規則

- ファイル名は常に小文字で、単語はハイフンで区切る (例: `my-component.tsx`)
- コンポーネント名は常に大文字で、単語はキャメルケースで区切る (例: `MyComponent`)
- ディレクトリは常に小文字で、単語はハイフンで区切る (例: `components/my-component`)

## ドキュメント

- **docs/cloud-architecture.md**: クラウドアーキテクチャに関するドキュメント
- **docs/software-architecture.md**: ソフトウェアアーキテクチャに関するドキュメント
