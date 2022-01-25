export type ProviderName = 
    "Codeforces"

export interface RatingSeries
{
    username: string,
    provider: ProviderName
    series: Array<{
        time: Date,
        rating: number,
        oldRating: number
    }>
}

type ContestType = "CF" | "IOI" | "ICPC";

type ContestPhase = "BEFORE" | "CODING" | "PENDING_TESTING" | "TESTING" | "FINISHED";

export type SavedContest = Record<string, StandingsEntry>;


export interface Contest
{
    id: number,
    name: string,
    type: ContestType,
    phase: ContestPhase,
    duration?: number, // seconds
    startTime: number, // ms Unix time format
    icpcRegion?: string,
    country?: string,
}

export interface CF_Contest 
{
    id: number,
    name: string,
    type: ContestType,
    phase: ContestPhase,
    durationSeconds?: number, // seconds
    startTimeSeconds: number, // Seconds Unix time format
    icpcRegion?: string,
    country?: string,
}

export interface StandingsEntry
{
    contestId: number,
    contestName: string,
    handle: string,
    rank: number,
    oldRating: number,
    newRating: number,
}

export interface CF_User
{
    handle: string,
    email: string,
    vkId?: string,
    openId?: string,
    firstName?: string,
    lastName?: string,
    country?: string,
    city?: string,
    organization?: string,
    contribution: number,
    rank: string,
    rating: number,
    maxRank: string,
    maxRating: number,
    lastOnlineTimeSeconds: number,
    registrationTimeSeconds: number,
    friendOfCount: number,
    avatar: string,
    titlePhoto: string
}

export interface CF_RatingChange
{
    contestId: number,
    contestName: string,
    handle: string,
    rank: number,
    ratingUpdateTimeSeconds: number,
    oldRating: number,
    newRating: number
}


