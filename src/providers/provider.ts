import { ProviderName, RatingSeries } from "./types";

export abstract class Provider
{
    protected readonly baseURL: string;

    public readonly name: ProviderName;
    
    public async abstract getUserRating(username: string): Promise<number | void>;

    public async abstract getUserRatingSeries(
        username: string, timeBegin?: Date, timeEnd?: Date): Promise<RatingSeries | void>
}

