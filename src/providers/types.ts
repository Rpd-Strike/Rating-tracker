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