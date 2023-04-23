import { API_URL } from "@/config";
var chessust = require("@chessust/types")

export const fetchProfileData = async (name: string) => {
    try {
        // TODO: handle caching more efficiently?
        const res = await fetch(`${API_URL}/v1/users/${name}`, {
            next: { revalidate: 10 }
        });

        if (res && res.status === 200) {
            const data: typeof chessust.User & { recentGames: typeof chessust.Game[] } = await res.json();
            return data;
        }
    } catch (err) {
        console.error(err);
    }
};
