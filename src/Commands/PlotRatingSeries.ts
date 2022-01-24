import { plot, Plot } from 'nodeplotlib';
// import { Shape } from 'nodeplotlib/dist/lib/models/plotly.js';

import { RatingSeries } from "../providers";

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
export function PlotRatingSeries(data: RatingSeries[][],
    startTime: Date, endTime: Date)
{
    let counter = 0;

    const generateRandomColorString = () => {
        const list = [
            "#e41a1c",
            "#4daf4a",
            "#984ea3",
            "#ff7f00",
            "#377eb8",
            "#ffff33",
            "#a65628",
            "#f781bf",
            "#999999"
        ];

        ++counter;

        if (counter <= list.length)
            return list[counter - 1];
    
        return Math.random().toString(16).slice(-6);
    }

    const plotData: Plot[] = [];
    data.forEach(ratingGroup => {
        const color = generateRandomColorString();
        
        ratingGroup.forEach(userRating => {

            const x = userRating.series.map(entry => entry.time);
            const y = userRating.series.map(entry => entry.rating);
            
            plotData.push({
                x: x,
                y: y,
                type: "scatter",
                line: {
                    color: color
                },
                name: userRating.username,
                mode: "lines+markers"
            })
        })
    })

    plot(plotData, {xaxis: {tickangle: 35}, sliders: [{visible: true}], width: 1200});
}

// Useless code that transforms Date in amount of weeks, offsetted with 0

    /// instead of time, have the time in ms 
    // const dataMS = data.map(gr => gr.map(rs => ({
    //     ...rs,
    //     series: rs.series.map(dt => ({
    //         ...dt,
    //         time: dt.time.getTime()
    //     }))
    // })));
    // const minDate = Math.min(...(
    //     dataMS.map(gr => Math.min(...(
    //         gr.map(rs => Math.min(...(
    //             rs.series.map(entry => entry.time)
    //         )))
    //     )))
    // ));
    // const dataWeeks = dataMS.map(gr => 
    //     gr.map(rs => ({
    //         ...rs,
    //         series: rs.series.map(el => ({
    //             ...el,
    //             time: WeeksFromMS(el.time - minDate)
    //         }))
    //     }))    
    // )