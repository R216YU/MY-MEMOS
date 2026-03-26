# ルール

1. 回答はすべて日本語で行う
2. React, Next.jsのベストプラクティスに従う
3. Linter, Formatter, Testで常にコード品質を保つ

## コマンド一覧

- `npm run lint`: Linterを実行する
- `npm run format`: Formatterを実行する
- `npm run build`: ビルドを実行する
- `npm run test`: Testを実行する

## 命名規則

- ファイル名は常に小文字で、単語はハイフンで区切る (例: `my-component.tsx`)
- コンポーネント名は常に大文字で、単語はキャメルケースで区切る (例: `MyComponent`)
- ディレクトリは常に小文字で、単語はハイフンで区切る (例: `components/my-component`)

## クラウドアーキテクチャ

- AWSを利用する
- S3, CloudFront, Route53, Certificate Managerを利用する
- IaCで管理する

## ソフトウェアアーキテクチャ

- 常にテストのしやすいコンポーネント、関数を実装する
- 単一責任の原則を守る
- ディレクトリはshared, page固有フォルダ(\_xxx)に分け、共通コードはshared, ページ固有コードはページ固有フォルダに配置する
