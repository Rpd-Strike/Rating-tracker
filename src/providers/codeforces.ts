import { CF_RatingChange, CF_User, ProviderName, RatingSeries } from "./types";
import { Provider } from "./provider";
import "isomorphic-fetch"

class CodeforcesProvider extends Provider
{
    name: ProviderName = "Codeforces";

    baseURL = "https://codeforces.com/api/";
    
    /// time in seconds of the last 5 requests
    protected queue: number[] = [];
    protected readonly timeBetweenRequests = 2020; // milli-seconds
    protected lastTimeQuery = new Date(2000, 1, 1);

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
}

export { CodeforcesProvider };