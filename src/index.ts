import { PlotRatingSeries } from "./Commands"

function main()
{
    PlotRatingSeries("Codeforces");
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