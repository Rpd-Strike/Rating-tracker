// Rating Time series
import * as fs from "fs";

import { providerCreator, ProviderName, RatingSeries } from "../providers";



function showSummmary(receivedData: RatingSeries[][])
{
    const showData = receivedData.map(group => 
        group.map(data => ({
            ...data,
            series: data.series.length // Show only the length
        }))
    )

    console.log(JSON.stringify(showData, null, 2));
}

// TODO: What library to use for plotting?
export function PlotRatingSeries(data: RatingSeries[][])
{
    showSummmary(data);
}