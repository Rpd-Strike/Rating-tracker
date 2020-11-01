export type ProviderName = 
    "Codeforces"

export interface RatingSeries
{
    username: string,
    provider: ProviderName
    series: Array<{
        time: Date,
        rating: number
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