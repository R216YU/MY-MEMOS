# 要件定義

## アプリケーション概要

**名称**: MY-MEMOS  
**種別**: 学習記録メモ（静的公開サイト + ローカルエディター）  
**目的**: 自分が学習してきたライブラリ・フレームワーク・言語などの知識をツリー構造で整理・公開する

---

## ユーザー

| ユーザー種別 | 説明 |
|---|---|
| 一般閲覧者 | 公開サイトを閲覧するユーザー（読み取り専用） |
| 管理者（自分） | ローカル環境でエディターを使い記事を作成・管理する |

---

## 機能要件

### 1. 公開サイト（閲覧機能）

#### 1-1. インデックスページ（`/`）
- 大項目（カテゴリ）の一覧を表示する
- サイドバーにツリー形式でナビゲーションを表示する（ドキュメントサイト形式）

#### 1-2. 記事閲覧ページ
- ツリー構造（3階層固定）で記事を管理・表示する

| 階層 | 名称 | 説明 |
|---|---|---|
| 大項目 | カテゴリ | React、TypeScript など |
| 中項目 | セクション | フックスについて、型システム など |
| 小項目 | 記事 | useStateについて、useEffectについて など |

- 本文コンテンツは **小項目（記事）のみ** 持つ
- サイドバーのツリーから記事を選択して表示できる
- 本文はMarkdownをHTMLレンダリングして表示する

### 2. ローカルエディター（記事管理機能）

#### 2-1. エディターページ（`/auth/editor`）
- 認証不要（ローカル環境でのみ使用）
- 大項目・中項目・小項目のCRUD操作ができる
- 各階層の表示順序（並び順）を管理できる

#### 2-2. 記事エディター
- **エディターライブラリ**: TipTap（Markdownベース）
- リッチなエディター体験を提供する（見出し、コードブロック、リスト、太字、斜体 等）
- 記事の保存・更新・削除ができる

---

## 非機能要件

### デプロイ・インフラ
- Next.js の静的ビルド（`next export`）で公開サイトを生成する
- AWS S3 + CloudFront + Route53 でホスティングする
- IaCは CloudFormation で管理する（`aws/cfn_template/`）

### データ管理
- データベースは SQLite（`sqlite.db`）を使用する
- 記事の作成・更新はローカル環境のエディターで行い、静的ビルド後にデプロイする

### 技術スタック
| カテゴリ | 使用技術 |
|---|---|
| フレームワーク | Next.js (App Router) |
| 言語 | TypeScript |
| スタイリング | Tailwind CSS、shadcn/ui |
| エディター | TipTap |
| DB | SQLite（Prisma + Better SQLite3） |
| テスト | Vitest + Testing Library |
| Linter/Formatter | Biome |

---

## データモデル

```prisma
// 大項目
model Category {
  id         Int         @id @default(autoincrement())
  name       String
  order      Int         @default(0)
  sections   Section[]
}

// 中項目
model Section {
  id         Int      @id @default(autoincrement())
  name       String
  order      Int      @default(0)
  category   Category @relation(fields: [categoryId], references: [id])
  categoryId Int
  posts      Post[]
}

// 小項目（記事）
model Post {
  id        Int     @id @default(autoincrement())
  title     String
  content   String?
  order     Int     @default(0)
  published Boolean @default(false)
  section   Section @relation(fields: [sectionId], references: [id])
  sectionId Int
}
```

---

## ページ構成（ルーティング）

| パス | 説明 |
|---|---|
| `/` | インデックスページ（大項目一覧・ツリーナビゲーション） |
| `/[category]/[section]/[post]` | 記事閲覧ページ |
| `/auth/editor` | ローカルエディター（記事管理） |

---

## 画面レイアウト概要

### 公開サイト
```
┌──────────────┬────────────────────────────┐
│  サイドバー   │  コンテンツエリア            │
│              │                            │
│ ▼ React      │  # useStateについて         │
│   ▼ フックス  │                            │
│     useState │  本文（Markdownレンダリング）│
│     useEffect│                            │
│ ▶ TypeScript │                            │
└──────────────┴────────────────────────────┘
```

### ローカルエディター
```
┌──────────────┬────────────────────────────┐
│  ツリー管理   │  エディターエリア            │
│              │                            │
│ ▼ React      │  タイトル入力               │
│   ▼ フックス  │                            │
│     useState │  TipTap リッチエディター    │
│     [+追加]  │                            │
│ [+大項目追加]│  [保存] [削除]              │
└──────────────┴────────────────────────────┘
```
