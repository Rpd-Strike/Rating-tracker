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
        return ;
    }
    
    console.log("Is this your rating? " + rating);
}
