
// Requests the contest list
// For each missing contest, requests and save data about it
// recompute order of contests in "data/contests/order.json"
// structure: {
//     * ord1, ord2 nu sunt neaparat de la 1..N dar sunt numere ce pastreaza ordinea cronologica
//     contests: [ord1, ord2, ....]
//     "ord1": 'cf_id1',
//     "ord2": 'cf_id2'
// }

import { my_file_exists, my_file_write, my_mkdir } from "../lib/util";
import { Contest, SavedContest, StandingsEntry } from "../providers";
import { Provider } from "../providers/provider"

const getContestFilePath = (contest: Contest, path: string): string =>
{
    return `${path}/${contest.id}.json`;
}

const IsContestLoaded = async (contest: Contest, path: string): Promise<boolean> =>
{
    const exists = await my_file_exists(getContestFilePath(contest, path));
    return exists;
}

const MAX_CONTESTS = 10;
const USE_MAX_CONTESTS = true;

const GetContestData = async (contestData: Contest[], provider: Provider, path: string): Promise<void>=>
{
    let weird_fails = 0;

    let promises = contestData.map((contest) => {
        const promise = new Promise<boolean>(async (resolve, reject) => {
            // check if contest is already loaded
            if (await IsContestLoaded(contest, path))
                return resolve(false);
            // get contest data from provider

            const contestData = await provider.getContestData(contest)
                .catch(err => {
                    console.log('Oh well a contest on the given list actually cant be queried')
                    weird_fails += 1;
                    return [];
                });
            console.log(`contestId: ${contest.id}, nr of users: ${contestData.length}`)
            
            let myobj: SavedContest = {};
            contestData.forEach(entry => {
                myobj[entry.handle] = entry;
            })

            // save to file
            const raw_string = JSON.stringify(myobj, null, 2);
            await my_file_write(getContestFilePath(contest, path), raw_string);
            
            resolve(true);
            console.log(`Saved data for contestId: ${contest.id}`);
        });
        return promise;
    });

    const created_new = await Promise.all(promises)
        .then(result => {
            console.log('All contests finished processing.');
            return result.reduce((a, b) => a + (b ? 1 : 0), 0);
        })
        .catch(err => {
            console.log('Promise all rejected:');
            console.log(err);
            return -1;
        })
    
    console.log(`Newly contests downloaded: ${created_new}`);
    console.log(`Weird fails (contests who failed querying for more data): ${weird_fails}`);
}


const ComputeOrder = async (contestData: Contest[], path: string): Promise<void> =>
{
    let order: Contest[] = []
    contestData.forEach(contest => order.push(contest));
    order.sort((a, b) => b.startTime - a.startTime);
    console.log(`First: `);
    console.log(order[0])
    for (let i = 1; i < order.length; ++i) {
        if (order[i - 1].startTime < order[i].startTime) {
            console.log('Ordine invers crescatoare incorecta:');
            console.log(order[i - 1]);
            console.log(order[i]);
        }
    }
    order.sort((a, b) => a.startTime - b.startTime);
    for (let i = 1; i < order.length; ++i) {
        if (order[i - 1].startTime > order[i].startTime) {
            console.log('Ordine crescatoare incorecta:');
            console.log(order[i - 1]);
            console.log(order[i]);
        }
    }
    console.log(`First: `);
    console.log(order[0])
    
    console.log(`Order has ${order.length}`);

    const orderPath = `${path}/order.json`;
    const raw_string = JSON.stringify(order, null, 2);
    await my_file_write(orderPath, raw_string);
} 

// contests are saved in json in format: "data/contests/<id>.json"
const UpdateContestData = async (provider: Provider, path: string): Promise<void> =>
{
    // step 1: Create working folder
    await my_mkdir(path, {recursive: true});

    // step 2: Get contest list
    let contestData = (await provider.getContestList())
        .filter(contest => contest.phase === "FINISHED")

    if (USE_MAX_CONTESTS)
        contestData = contestData.slice(0, MAX_CONTESTS);

    // step3: Get contest data for each
    await GetContestData(contestData, provider, path);

    // step 4: Redo order
    await ComputeOrder(contestData, path);
}

export { UpdateContestData };