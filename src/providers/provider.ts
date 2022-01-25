import { Contest, ProviderName, RatingSeries, StandingsEntry } from "./types";

export abstract class Provider
{
    protected readonly baseURL: string;

    public readonly name: ProviderName;
    
    public abstract getUserRating(username: string): Promise<number | void>;

    public abstract getUserRatingSeries(
        username: string, timeBegin?: Date, timeEnd?: Date): Promise<RatingSeries | void>

    public abstract getContestList(): Promise<Contest[]>

    public abstract getContestData(contest: Contest): Promise<StandingsEntry[]>
}
