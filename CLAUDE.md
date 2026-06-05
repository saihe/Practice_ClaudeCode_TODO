# Kanban Board — Claude Code Project

## Project Overview
シンプルなカンバンボード。Next.js のみを使用し、バックエンド・DB なし。
localStorage で状態を永続化する AI 駆動開発の練習プロジェクト。

## Tech Stack
| 役割 | 採用技術 |
|------|---------|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v3 |
| Headless UI | @headlessui/react v2 |
| Drag & Drop | @dnd-kit/core v6 |
| Persistence | localStorage (useLocalStorage hook) |

## Directory Structure
```
src/
├── app/
│   ├── layout.tsx        # Root layout (Server Component)
│   ├── page.tsx          # Home page (Server Component)
│   └── globals.css       # Tailwind directives + html/body height
├── components/
│   ├── Board.tsx         # Kanban board root (Client Component)
│   ├── Column.tsx        # Column with useDroppable
│   ├── Card.tsx          # Card with useDraggable + inline edit
│   └── AddCardDialog.tsx # @headlessui/react Dialog for adding cards
├── hooks/
│   └── useLocalStorage.ts # SSR-safe localStorage hook
└── types/
    └── index.ts          # Card, Status types + COLUMNS constant
```

## Data Model
```typescript
type Status = 'TODO' | 'DOING' | 'DONE';

interface Card {
  id: string;        // crypto.randomUUID()
  text: string;      // card content (text only)
  status: Status;    // which column the card belongs to
  createdAt: number; // Unix timestamp (ms)
}
```

All cards are stored as a flat array in `localStorage` under the key `"kanban-cards"`.

## Development
```bash
npm install   # install dependencies (requires Node.js 18+)
npm run dev   # dev server → http://localhost:3000
npm run build # production build
npm run lint  # ESLint
```

## Key Design Decisions

### Drag & Drop
- Columns are `useDroppable` targets; cards are `useDraggable` items.
- `pointerWithin` collision detection: the card moves to whichever column the pointer is over.
- `PointerSensor` with `activationConstraint: { distance: 8 }` — requires 8 px of movement before drag starts, so a simple click on a card triggers inline edit instead.

### SSR Safety
`useLocalStorage` initialises with `initialValue` on both server and client to avoid hydration mismatch. On mount, a `useEffect` reads localStorage and updates state. Subsequent writes are guarded by an `isHydrated` flag so the initial empty state is never written back over stored data.

### Constraints (intentional)
- Column names (TODO / DOING / DONE) are fixed; cannot be added or renamed.
- Cards contain text only — no due dates, assignees, tags, or other metadata.

---

## Instruction Recording Rule

> **必須ルール**: ユーザーから新しい指示・方針決定があった場合、必ず以下の **Instruction Log** セクションに日付・内容・背景を追記すること。このファイルは毎会話自動ロードされるため、指示の永続記録として機能する。

## Instruction Log

### 2026-06-05 — Azure App Service デプロイ環境構築

**指示内容:**
- TerraformでAzure App ServiceのF1（完全無料）プランを構築
- SSR対応のDockerfileを作成
- mainブランチへのPRマージにより自動デプロイするGitHub Actionsワークフローを作成
- カスタムドメイン不要、スペック不問
- 指示の履歴を必ずCLAUDE.mdに残すルールを追加すること

**実装内容:**
- `next.config.ts`: `output: "standalone"` 追加（standalone buildsでSSR対応デプロイ）
- `Dockerfile`: ローカル開発・Docker対応環境向け多段ビルド
- `terraform/`: F1プランのApp Service（Node.js 20 LTS ランタイム）
- `.github/workflows/deploy.yml`: mainブランチpush時に自動デプロイ

**制約・注意事項:**
- Azure App Service F1（無料）はDockerカスタムコンテナ非対応（B1以上が必要）
- そのためApp ServiceへのデプロイはNode.jsランタイム + standalone outputで実施
- DockerfileはローカルまたはDocker対応有料環境向け

**初回セットアップ手順（README参照）:**
1. `terraform/variables.tf` の `app_name` をグローバル一意な名前に変更
2. `az login` でAzureにログイン後、`cd terraform && terraform init && terraform apply`
3. `terraform output publish_profile_command` のコマンドを実行しXMLを取得
4. GitHubリポジトリの Settings > Secrets に `AZURE_WEBAPP_PUBLISH_PROFILE` として登録
5. Settings > Variables に `AZURE_WEBAPP_NAME` として App Service 名を登録

### 2026-06-05 — Azure Container Apps へ切り替え（App Service VM クォータ問題対応）

**背景・問題:**
- `terraform apply` 失敗: `Current Limit (Total VMs): 0` エラー
- Azure サブスクリプションの VM クォータが 0 のため App Service プランが作成不可
- 無料試用版・学生版サブスクリプションで発生しやすい既知の制限

**方針変更:**
- App Service → **Azure Container Apps**（サーバーレス、VM クォータとは別枠）
- Docker コンテナを直接動かせるためユーザーの当初希望を実現
- 無料枠: 月 180,000 vCPU秒・360,000 GiB秒・200万リクエスト
- スケールゼロ（`min_replicas=0`）でアクセスなし時はコスト0

**実装内容（更新）:**
- `terraform/main.tf`: Container Apps 環境 + Log Analytics Workspace + Container App
- `.github/workflows/deploy.yml`: Dockerビルド → ghcr.io push → Container Apps デプロイ
- イメージレジストリ: GitHub Container Registry (ghcr.io、無料)

**初回セットアップ手順（更新）:**
1. リソースグループが既に作成済みの場合: `terraform apply`（差分のみ適用）
2. `terraform output service_principal_command` コマンドを実行 → JSON 取得
3. GitHub Settings > Secrets に `AZURE_CREDENTIALS`（JSON まるごと）を登録
4. GitHub Settings > Variables に `AZURE_CONTAINER_APP_NAME`・`AZURE_RESOURCE_GROUP` を登録
5. 初回 PR マージ後、GitHub の Packages ページでイメージを **Public** に変更（Azure が pull できるよう）
