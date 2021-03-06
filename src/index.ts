import { PlotRatingSeries } from "./Commands"
import { getUserGroupsFromFile } from "./lib/readUserGroups";
import { providerCreator, ProviderName, RatingSeries } from "./providers";


async function main()
{
    const filePath = "input/CF-handles.txt";
    const provName: ProviderName = "Codeforces";
    const startTime = new Date(2020, 1);
    const endTime = new Date(2020, 4);

    // Read users
    const userGroups = getUserGroupsFromFile(filePath);

    console.log(`Read user groups: ${userGroups.length} groups and ` +
        `${userGroups.map(el => el.length).reduce((sum, el) => sum + el)} users`);

    // Create provider and get RatingSeries
    const provider = providerCreator(provName);

    let receivedData = await Promise.all(userGroups.map(group => 
        Promise.all(group.map(username => 
            provider.getUserRatingSeries(username, startTime, endTime))
        )
    ));

    if (receivedData.some(group => group.some(series => !series))) {
        throw new Error("Error getting RatingSeries from codeforces");
    }

    // Plot the ratings
    PlotRatingSeries(receivedData as RatingSeries[][]);
}

function startRatingTracker()
{
    try {
        main()
    }
    catch (err) {
        console.error("Error caught in the main process:")
        console.error(err);
    }
}

startRatingTracker()