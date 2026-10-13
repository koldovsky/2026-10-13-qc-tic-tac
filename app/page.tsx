import TicTacToe from "./tic-tac-toe";

export default function Home() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-8 bg-zinc-50 px-4 py-12 font-sans dark:bg-black">
      <h1 className="text-3xl font-semibold tracking-tight text-black dark:text-zinc-50">
        Tic-tac-toe
      </h1>
      <TicTacToe />
    </main>
  );
}
