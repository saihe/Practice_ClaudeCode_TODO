import { Board } from "@/components/Board";

export default function Home() {
  return (
    <main className="h-screen flex flex-col bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex-shrink-0">
        <h1 className="text-xl font-bold text-gray-800">Kanban Board</h1>
      </header>
      <div className="flex-1 overflow-hidden p-6">
        <Board />
      </div>
    </main>
  );
}
