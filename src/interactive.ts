import * as inquirer from "inquirer";
import { Game, Stream, GameList } from "./rest/Schedule";

export const chooseGame = async (gameList: GameList): Promise<Game> => {
    const queryDate = gameList.queryDate;
    const backDate = queryDate.minus({ days: 1 });
    const forwardDate = queryDate.plus({ days: 1 });

    let gamesOptions: inquirer.DistinctChoice<inquirer.ListChoiceMap>[] = [
        {
            name: `⤺  one day back (${backDate.toFormat("yyyy-MM-dd")})`,
            value: backDate
        },
        new inquirer.Separator(" "),
        new inquirer.Separator(queryDate.toFormat("yyyy-MM-dd")),
        new inquirer.Separator(" "),
    ];

    if (gameList.games.length > 0) {
        gameList.games.forEach(game => {
            gamesOptions.push({
                name: `${game.away_name}${game.status !== "Pre Game" ? ` (${game.away_score}) ` : " "}@ ${game.home_name}${game.status !== "Pre Game" ? ` (${game.home_score}) ` : " "}- ${game.status}`,
                value: game
            });
        });
    } else {
        gamesOptions.push(new inquirer.Separator("  No games for the specified day"));
    }

    gamesOptions.push(new inquirer.Separator(" "));
    gamesOptions.push({
        name: `⤻  one day forward (${forwardDate.toFormat("yyyy-MM-dd")})`,
        value: forwardDate
    });

    const questionsGame: inquirer.ListQuestion[] = [
        {
            type: "list",
            pageSize: 22,
            name: "game",
            message: "Choose game to watch",
            choices: gamesOptions
        }
    ];

    const gameSelected = await inquirer.prompt(questionsGame);
    return gameSelected.game;
};

export const chooseFeed = async (game: Game): Promise<Stream> => {
    let feedsOptions: inquirer.DistinctChoice<inquirer.ListChoiceMap>[] = [];

    if (game.stream_available) {
        game.streams.forEach(stream => {
            feedsOptions.push({
                name: stream.name,
                value: stream
            });
        });
    } else {
        feedsOptions.push(new inquirer.Separator("  No feeds available"));
    }

    const questionsFeed: inquirer.ListQuestion[] = [
        {
            type: "list",
            pageSize: 6,
            name: "feed",
            message: "Choose feed to watch",
            choices: feedsOptions
        }
    ];

    const feedSelected = await inquirer.prompt(questionsFeed);
    return feedSelected.feed;
};

export const chooseRegion = async (stream: Stream): Promise<Stream> => {
    let regionsOptions: inquirer.DistinctChoice<inquirer.ListChoiceMap>[] = [
        {
            name: "NA East 1",
            value: "na-east-1"
        },
        {
            name: "NA East 2",
            value: "na-east-2"
        },
        {
            name: "NA West 1",
            value: "na-west-1"
        },
        {
            name: "NA West 2",
            value: "na-west-2"
        },
        {
            name: "NA Central 1",
            value: "na-central-1"
        },
        {
            name: "NA Central 2",
            value: "na-central-2"
        }
    ];

    const questionsRegion: inquirer.ListQuestion[] = [
        {
            type: "list",
            pageSize: 22,
            name: "region",
            message: "Choose region to watch",
            choices: regionsOptions
        }
    ];

    const selectedRegion = await inquirer.prompt(questionsRegion);
    const region = selectedRegion.region;

    stream.url = stream.url.replace(/(na-([\w]+)-[1-3])/g, region);
    return stream;
};