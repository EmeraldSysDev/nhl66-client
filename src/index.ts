import { patch } from "./fetchPatch";
import { getGames } from "./rest/Schedule";
import { chooseGame, chooseFeed, chooseRegion } from "./interactive";

import { spawn } from "child_process";

(async () => {
    patch(); // Avoid warnings

    const gameList = await getGames();
    const game = await chooseGame(gameList);
    const feed = await chooseFeed(game);
    const regionFeed = await chooseRegion(feed);

    spawn("streamlink", [
        "--hls-segment-key-uri",
        "https://api.nhl66.ir/api/get_key_url{path}{query}",
        regionFeed.url,
        "720p_alt2"
    ]);
})();