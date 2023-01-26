import { patch } from "./fetchPatch";
import {
    Game,
    Stream,
    getGames,
    streamHasGeoblock
} from "./rest/Schedule";
import { chooseGame, chooseFeed, chooseRegion } from "./interactive";

(async () => {
    patch(); // Avoid warnings

    const gameList = await getGames();
    const game = await chooseGame(gameList);
    const feed = await chooseFeed(game);
    const regionFeed = await chooseRegion(feed);
    console.log(regionFeed.url);
    /* const games = gameList.games;
    games.forEach((game: Game) => {
        const anyStreams = game.stream_available;
        const streamsPlanned = game.stream_planned;
        const streamsPremium = game.stream_premium;

        const streamsAvailable: string[] = [];
        game.streams.forEach((stream: Stream) => {
            if (!streamHasGeoblock(stream)) // NHLTV not supported at the moment, VPN will be needed for these
                streamsAvailable.push(stream.name);
        });

        console.log(anyStreams ? streamsAvailable.join(" - ") : "No streams available");
    }); */
})();