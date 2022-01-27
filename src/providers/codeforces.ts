import { CF_Contest, CF_RatingChange, CF_User, Contest, ProviderName, RatingSeries, StandingsEntry } from "./types";
import { Provider } from "./provider";
import RateLimiterQueue from "../Queues/RateLimiterQueue";
import "isomorphic-fetch"

class CodeforcesProvider extends Provider
{
    name: ProviderName = "Codeforces";

    baseURL = "https://codeforces.com/api/";
    
    /// time in seconds of the last 5 requests
    protected queue: number[] = [];
    protected readonly timeBetweenRequests = 2020; // milli-seconds
    protected lastTimeQuery = new Date(2000, 1, 1);

    protected rateLimiter: RateLimiterQueue = new RateLimiterQueue(2000, 1);

    protected convert_CF_Contest_to_Contest(CF_contest: CF_Contest): Contest
    {
        const obj = {
            ...CF_contest,
            startTime: CF_contest.startTimeSeconds * 1000
        }
        return obj;
    }

    readonly msToTime = (ms: number): string =>
    {
        const dt = new Date(ms);
        const str = dt.getHours().toString() + ":" + dt.getMinutes().toString() + ":" + dt.getSeconds().toString()  +" :" + dt.getMilliseconds().toString();
        return str;
    }
    
    private async waitInQueue(username: string)
    {
        console.log("Wait in queue, last time Query: ", new Date())

        const wait = async (ms: number) => {
            return new Promise(resolve => setTimeout(resolve, ms));
        }

        const waitTimeForQueue = (): number =>
        {
            console.log(`Queue length: ${this.queue.length} for user: ${username}`);
    
            let nowMS = new Date().getTime();   
            let whenAllowed = this.lastTimeQuery.getTime() + this.timeBetweenRequests;
            return Math.max(0, whenAllowed - nowMS);
        }

        let qq = waitTimeForQueue();
        while (qq > 0) {
            // console.log(`User ${username} waiting ${qq} ms`);
            await wait(qq);
            qq = waitTimeForQueue();
        }

        this.lastTimeQuery = new Date();

        console.log("Start at time: " + new Date());
    }

    private popFromQueue()
    {
        console.log("Finish at time: " + this.msToTime(new Date().getTime()))
    }

    async getUserRating(username: string): Promise<number>
    {
        const queryString = `user.info?handles=${username}`;
        
        await this.waitInQueue(username);
        
        let resp = await fetch(this.baseURL + queryString)
            .then(resp => resp.json())
            .then(resp => {
                if (resp.status == "OK")
                    return resp.result[0] as CF_User;
                throw new Error(`Status not OK from codeforces (user: ${username})`);
            })
            .catch(err => {
                console.log("I got this error: " + err);
            });
        
        if (typeof resp == "undefined") {
            return ;
        }

        this.popFromQueue();

        return resp.rating;
    }

    async getUserRatingSeries(username: string, timeBegin?: Date, timeEnd?: Date): Promise<RatingSeries | void>
    {
        const queryString = `user.rating?handle=${username}`;
        const that = this;

        await this.waitInQueue(username);

        let resp = await fetch(this.baseURL + queryString)
            .then(resp => resp.json())
            .then(resp => {
                if (resp.status != "OK") {
                    console.log(JSON.stringify(resp, null, 2));
                    throw new Error(`Status not OK from codeforces (user: ${username})`);
                }

                const result = resp.result as CF_RatingChange[];

                const series: RatingSeries = {
                    provider: that.name,
                    username: username,
                    series: result.map(entry => {
                        return {
                            time: new Date(entry.ratingUpdateTimeSeconds * 1000),
                            rating: entry.newRating,
                            oldRating: entry.oldRating
                        }
                    })
                };

                return series;
            })
            .catch(err => {
                console.log("Fetch error: " + err);
            });
        
        if (typeof resp === "undefined") {
            return ;
        }

        resp.series = resp.series.filter(change => {
            if (timeBegin !== undefined && timeBegin > change.time)
                return false;
            if (timeEnd !== undefined && timeEnd < change.time)
                return false;
            return true;
        });

        this.popFromQueue();

        return resp;
    }

    public async getContestList(): Promise<Contest[]> {
        const queryString = `contest.list`;
        
        await this.rateLimiter.getInQueue();

        let resp: Contest[] = await fetch(this.baseURL + queryString)
            .then(resp => resp.json())
            .then(resp => {
                console.log("contest data: ", resp.status)
                if (resp.status == "OK") {
                    const contests = resp.result as CF_Contest[];
                    return contests.map(this.convert_CF_Contest_to_Contest);
                }
                throw new Error('Status not OK from cf: contest.list');
            })
            .catch(err => {
                console.log("Error when fetching contest list: ", err);
                return [];
            })


        return resp;
    }

    public async getContestData(contest: Contest): Promise<StandingsEntry[]> {
        const queryString = `contest.ratingChanges?contestId=${contest.id}`;
        
        await this.rateLimiter.getInQueue();

        let resp = await fetch(this.baseURL + queryString)
            .then(resp => resp.json())
            .then(resp => {
                if (resp.status == "OK") {
                    return resp.result as StandingsEntry[];
                }
                throw new Error(`Status NOT OK from cf: ${this.baseURL + queryString}\n` +
                    `Reason: ${resp.comment ? resp.comment : '<???>'}`);
            })
            .catch(err => {
                console.log("Error when fetching contestData: ", err);
            })

        if (typeof resp == "undefined") {
            return [];
        }

        return resp;
    }
}

export { CodeforcesProvider };