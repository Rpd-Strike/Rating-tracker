import { hsl, rgb } from 'd3';
import { plot, stack, clear, Plot, Layout } from 'nodeplotlib';
import { Shape } from 'nodeplotlib/dist/lib/models/plotly.js';

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
    const WeeksFromMS = (ms: number) => {
        return ms / 1000 / 60 / 60 / 24 / 7;
    }

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
        if (this.cnt === undefined) {
            this.cnt = 0;
        }

        ++this.cnt;
        console.log("this cnt: ", this.cnt);

        if (this.cnt <= list.length)
            return list[this.cnt - 1];
    
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
                // marker: {
                //     colorbar: {
                //         tickformat: "%Y %M %D"
                //     }
                // }
                mode: "lines+markers"
            })
        })
    })

    const shapes: Partial<Shape>[] = [
    // {
    //     type: "line", 
    //     x0: startTime, x1: endTime, 
    //     y0: 2100, y1: 2100, 
    //     opacity: 0.4
    // }
    ];

    plot(plotData, {xaxis: {tickangle: 35}, shapes: shapes});
    
    // showSummmary(data);
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