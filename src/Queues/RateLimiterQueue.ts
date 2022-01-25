import { randomInt } from "crypto";
import { waitMS } from "../lib/time";

// args: 
// timePeriod: milliseconds
// maxRequests: maximum requests in given time window
class RateLimiterQueue 
{
    protected readonly timePeriod: number; // ms
    protected readonly maxRequests: number;  // how many requests can you do in 'timePeriod'
    protected readonly MIN_ADDAGE: number = 10; // minimum ms to add to wait
    protected readonly MAX_ADDAGE: number = 400; // maximum ms to add to wait

    // holds the previous times of executed queries in order
    protected queue: number[] = [];
    
    // args: 
    // timePeriod: milliseconds
    // maxRequests: maximum requests in given time window
    constructor(timePeriod: number = 1000, maxRequests: number = 1)
    {
        if (maxRequests < 1)
            throw new Error(`Can not create RateLimiterQueue with ${maxRequests} maxRequests`);

        this.timePeriod = timePeriod;
        this.maxRequests = maxRequests;
    }

    protected RandomAddage(): number
    {
        return randomInt(this.MIN_ADDAGE, this.MAX_ADDAGE);
    }
    
    protected clearOld(): void
    {
        const timeNow = new Date().getTime();
        while (this.queue.length > 0 && this.queue[0] < timeNow - this.timePeriod)
        {
            this.queue.shift();
        }
    }
    
    public executedInLastPeriod(): number 
    {
        this.clearOld();
        return this.queue.length;
    }

    public canRun(): boolean
    {
        return this.executedInLastPeriod() < this.maxRequests;
    }

    protected timeToWait(): number
    {
        if (this.canRun())
            return 0;

        const timeNow = new Date().getTime();
        const elapsedTime = timeNow - this.queue[0];
        
        return Math.max(0, this.timePeriod - elapsedTime);
    }

    protected async waitToRun(): Promise<void>
    {
        await waitMS(this.timeToWait());
    }

    public async getInQueue(): Promise<void>
    {
        while (!this.canRun()) {
            const waitTime = this.timeToWait() + this.RandomAddage();
            await waitMS(waitTime);
        }
        this.queue.push(new Date().getTime());
    }
}

export default RateLimiterQueue;
