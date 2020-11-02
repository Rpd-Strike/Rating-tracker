import { CF_RatingChange, CF_User, ProviderName, RatingSeries } from "./types";
import { Provider } from "./provider";
import "isomorphic-fetch"

class CodeforcesProvider extends Provider
{
    name: ProviderName = "Codeforces";

    baseURL = "https://codeforces.com/api/";
    
    async getUserRating(username: string): Promise<number | void>
    {
        const queryString = `user.info?handles=${username}`;
        let resp = await fetch(this.baseURL + queryString)
            .then(resp => resp.json())
            .then(resp => {
                if (resp.status == "OK")
                    return resp.result[0] as CF_User;
                throw new Error("Status not OK from codeforces");
            })
            .catch(err => {
                console.log("I got this error: " + err);
            });
        
        if (typeof resp == "undefined") {
            return ;
        }
        return resp.rating;
    }

    async getUserRatingSeries(username: string, timeBegin?: Date, timeEnd?: Date): Promise<RatingSeries | void>
    {
        const queryString = `user.rating?handle=${username}`;
        const that = this;

        let resp = await fetch(this.baseURL + queryString)
            .then(resp => resp.json())
            .then(resp => {
                if (resp.status != "OK")
                    throw new Error("Status not OK from codeforces");

                // console.log(JSON.stringify(resp.result, null, 2));

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

        return resp;
    }
}

export { CodeforcesProvider };