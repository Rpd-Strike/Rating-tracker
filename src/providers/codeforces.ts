import { CF_User, ProviderName, RatingSeries } from "./types";
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

    async getRatingSeries(username: string): Promise<RatingSeries>
    {
        throw new Error('NOT IMPLEMENTED');
    }
}

export { CodeforcesProvider };