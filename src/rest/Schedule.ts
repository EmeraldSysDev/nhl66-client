import { DateTime } from "luxon";

export interface Schedule {
    games: Game[]
}

export interface Game {
    id: number
    src_id: string
    status: string
    winner: string
    start_datetime: string
    is_recent: boolean // Within 12 hours?
    // Home
    home_id: number
    home_abr: string
    home_odd: string
    home_score: number
    home_name: string
    home_short: string
    // Away
    away_id: number
    away_abr: string
    away_odd: string
    away_score: number
    away_name: string
    away_short: string
    streams: Stream[]
    stream_available: boolean
    stream_planned: boolean
    stream_premium: boolean
}

export interface Stream {
    mediaid: string
    name: StreamType
    url: string
    download_info?: Object // Always null, specified as object at the moment
    is_live: boolean // Usually true, unless stream is late or finished
    keys: Object // Usually empty (keys are gotten from an endpoint), specified as object at the moment
    sharestream_uid: string // Premium users
    sharestream_engine: string // Premium users
    sharestream_url: string | boolean // Never shown, requested by premium users at another endpoint
    archive_path?: string // Not sure what this is, possibly for time machine
}

export enum StreamType {
    HOME = "Home",
    HOME_GEO = "Home (NET)",
    AWAY = "Away",
    AWAY_GEO = "Away (NET)",
    NATIONAL = "National",
    NATIONAL_GEO = "National (NET)",
    FRENCH = "French",
    FRENCH_GEO = "French (NET)",
    ESPN_SW = "Star Watch"
}

export interface GameList {
    queryDate: DateTime
    games: Game[]
}

export const getGames = async () => {
    return fetch("https://api.nhl66.ir/api/sport/schedule")
        .then(res => res.json())
        .then((data: Schedule) => {
            const query: GameList = {
                queryDate: DateTime.now(),
                games: data.games
            };
            return query;
        });
};

export const streamHasGeoblock = (stream: Stream) => (
    stream.name === StreamType.NATIONAL_GEO ||
    stream.name === StreamType.AWAY_GEO ||
    stream.name === StreamType.HOME_GEO ||
    stream.name === StreamType.FRENCH_GEO
);