// Rating Time series
import { providerCreator, ProviderName } from "../providers";
import { RLSync } from "../lib/readline";

// TODO: just a test
// Replace with actual plotting
export async function PlotRatingSeries(provName: ProviderName)
{
    const provider = providerCreator(provName);

    let username = RLSync("Enter condeforces handle: ");
    const rating = await provider.getUserRating(username);

    if (rating === undefined) {
        console.log("User not existent or another error occured :/");
    }
    else {
        console.log("Is this your rating? " + rating);
    }

    // second part
    const series = await provider.getUserRatingSeries(username, new Date(2020, 1), new Date(2020, 9));
    if (series === undefined) {
        console.log("Could not retrieve rating history");
    }
    else {
        console.log("I got this rating history for " + username);
        console.log(JSON.stringify(series, null, 2));
    }
}
