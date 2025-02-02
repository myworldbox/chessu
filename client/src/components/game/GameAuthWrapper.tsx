"use client";

import { useContext } from "react";
import { SessionContext } from "@/context/session";
import GamePage from "./GamePage";
import type { Game } from "@chessust/types";

export default function GameAuthWrapper({ initialLobby }: { initialLobby: Game }) {
  const session = useContext(SessionContext);

  if (!session?.user || !session.user?.id) {
    return (
      <div className="flex flex-col items-center justify-center gap-4">
        <div className="text-2xl font-bold">Loading</div>
        <div className="text-xl">Waiting for authentication...</div>
      </div>
    );
  }

  return <GamePage initialLobby={initialLobby} />;
}
