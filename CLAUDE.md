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
