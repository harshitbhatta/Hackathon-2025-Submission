import React, { useState, useEffect, useRef } from "react";
import axios from 'axios';
import Plotly from 'plotly.js-dist';
import Button from 'react-bootstrap/Button';
const VisualsPage = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [bubble, setBubble] = useState(false);
    const [bar, setBar] = useState(false);
    const [line, setLine] = useState(true);
    const chartRef = useRef(null);

    const bubblePlot = (e) => {
        e.preventDefault();
        setBubble(true);
        setBar(false);
        setLine(false);
    }
    const barGraph = (e) => {
        e.preventDefault();
        setBar(true);
        setLine(false);
        setBubble(false);
    }
    const lineGraph = (e) => {
        e.preventDefault();
        setLine(true);
        setBar(false);
        setBubble(false);
    }
    function convertToCSV(objArray) {
        var array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
        var str = '';
    
        for (var i = 0; i < array.length; i++) {
            var line = '';
            for (var index in array[i]) {
                if (line != '') line += ','
    
                line += array[i][index];
            }
    
            str += line + '\r\n';
        }
    
        return str;
    }

    const fetchData = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:8000/processed-data/');
            console.log(response.data);
            setData(response.data);
            console.log(response.data[0])
            const csv_data = convertToCSV(JSON.stringify(response.data));
            console.log(csv_data);
        } catch (error) {
            setError('Error fetching data');
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        if (data.length > 0 && chartRef.current) {
            let traces = [];
            let layout = {};
    
            // Check which chart to draw
            if (line) {
                // Prepare the data by grouping them by Fleet Name
                const fleets = {};
                data.forEach((datum) => {
                    const fleet = datum["Fleet Name"];
                    const date = new Date(datum["Log.Event Dt"]);
                    const performance = +datum["Performance"] * 100; // Convert to percentage
    
                    if (!fleets[fleet]) {
                        fleets[fleet] = { x: [], y: [], name: fleet };
                    }
    
                    fleets[fleet].x.push(date);
                    fleets[fleet].y.push(performance);
                });
    
                // Prepare traces for each fleet
                traces = Object.keys(fleets).map((fleet) => ({
                    x: fleets[fleet].x,
                    y: fleets[fleet].y,
                    mode: "lines",
                    name: fleets[fleet].name,
                    line: { width: 2 },
                }));
    
                // Define the layout for the line chart
                layout = {
                    title: "Fleet Performance Over Time",
                    xaxis: {
                        title: "Time",
                        type: "date",
                        rangeselector: {
                            buttons: [
                                {
                                    step: "month",
                                    stepmode: "backward",
                                    count: 1,
                                    label: "1m",
                                },
                                {
                                    step: "month",
                                    stepmode: "backward",
                                    count: 6,
                                    label: "6m",
                                },
                                { step: "year", stepmode: "todate", count: 1, label: "YTD" },
                                { step: "year", stepmode: "backward", count: 1, label: "1y" },
                                { step: "all" },
                            ],
                        },
                        rangeslider: {},
                    },
                    yaxis: {
                        title: "Performance (%)",
                        rangemode: "tozero",
                        autorange: true,
                    },
                };
            } else if (bar) {
                // Define the data for the bar chart
                traces = data.map((datum) => ({
                    x: [datum["Fleet Name"]],
                    y: [+datum["Performance"] * 100], // Convert to percentage
                    type: 'bar',
                    name: datum["Fleet Name"]
                }));
    
                layout = {
                    title: "Fleet Performance Bar Graph",
                    xaxis: {
                        title: "Fleet",
                    },
                    yaxis: {
                        title: "Performance (%)",
                        rangemode: "tozero",
                        autorange: true,
                    },
                };
            } else if (bubble) {
                // Define the data for the bubble plot
                traces = data.map((datum) => ({
                    x: [datum["Fleet Name"]],
                    y: [+datum["Performance"] * 100], // Convert to percentage
                    mode: 'markers',
                    marker: {
                        size: Math.sqrt(+datum["Performance"]) * 20, // Bubble size proportional to performance
                        sizemode: 'area',
                    },
                    name: datum["Fleet Name"],
                }));
    
                layout = {
                    title: "Fleet Performance Bubble Plot",
                    xaxis: {
                        title: "Fleet",
                    },
                    yaxis: {
                        title: "Performance (%)",
                        rangemode: "tozero",
                        autorange: true,
                    },
                };
            }
    
            // Plot the chart
            Plotly.newPlot(chartRef.current, traces, layout);
        }
    }, [data, line, bar, bubble]); // Add line, bar, and bubble as dependencies
    
    
    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <>
            {/* <div>
                <h1>Data Table</h1>
                <table border="1">
                    <thead>
                        <tr>
                            <th>Log.Event Dt</th>
                            <th>Fleet Name</th>
                            <th>Region Name</th>
                            <th>Performance</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.length > 0 ? (
                            data.map((item, index) => (
                                <tr key={index}>
                                    <td>{item["Log.Event Dt"]}</td>
                                    <td>{item["Fleet Name"]}</td>
                                    <td>{item["Region Name"]}</td>
                                    <td>{item["Performance"]}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="4">No data available</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div> */}
            <Button variant="danger" style={{margin: "10px"}} onClick={lineGraph}>Line Graph with Time Range</Button>{' '}
            <Button variant="info" style={{margin: "10px"}} onClick={bubblePlot}>Time Series Bubble Plot</Button>{' '}
            <Button variant="secondary" style={{margin: "10px"}} onClick={barGraph}>Time Series Bar Graph</Button>{' '}
            {line && <div ref={chartRef} style={{ width: "100%", height: "750px" }} />}
        </>
    );
};

export default VisualsPage;
// import React, { useState, useEffect } from "react";
// import axios from 'axios';
// // import { json2csv } from 'json-2-csv';

// const VisualsPage = () => {
//     const [data, setData] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);
//     const [csvData, setCsvData] = useState('');

//     function convertToCSV(objArray) {
//         var array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
//         var str = '';
    
//         for (var i = 0; i < array.length; i++) {
//             var line = '';
//             for (var index in array[i]) {
//                 if (line != '') line += ','
    
//                 line += array[i][index];
//             }
    
//             str += line + '\r\n';
//         }
    
//         return str;
//     }

//     const fetchData = async () => {
//         try {
//             const response = await axios.get('http://127.0.0.1:8000/processed-data/');
//             // const jsonData = typeof(response.data);
//             console.log(response.data);
//             console.log("eg");
//             // console.log(typeof(jsonData));
//             // var csv_data = JSON.parse(response.data);
//             // console.log(csv_data);
//             setData(response.data);
//             console.log(response.data[0])
//             const csv_data = convertToCSV(JSON.stringify(response.data));
//             console.log(csv_data);
//         } catch (error) {
//             setError('Error fetching data');
//             console.error('Error fetching data:', error);
//         } finally {
//             setLoading(false);
//         }
//     };

//     useEffect(() => {
//         fetchData();
//     }, []);
    
//     if (loading) return <div>Loading...</div>;
//     if (error) return <div>{error}</div>;

//     // Ensure data is an array before mapping
//     // if (!Array.isArray(data)) {
//     //     return <div>Data is not in the expected format</div>;
//     // }

//     return (
//         <>
//             <div>
//             <h1>Data Table</h1>
//             <table border="1">
//                 <thead>
//                     <tr>
//                         <th>Log.Event Dt</th>
//                         <th>Fleet Name</th>
//                         <th>Region Name</th>
//                         <th>Performance</th>
//                         {/* Add more headers as needed */}
//                     </tr>
//                 </thead>
//                 <tbody>
//                     {data.length > 0 ? (
//                         data.map((item, index) => (
//                             <tr key={index}>
//                                 <td>{item["Log.Event Dt"]}</td>
//                                 <td>{item["Fleet Name"]}</td>
//                                 <td>{item["Region Name"]}</td>
//                                 <td>{item["Performance"]}</td>
//                                 {/* Render other fields as needed */}
//                             </tr>
//                         ))
//                     ) : (
//                         <tr>
//                             <td colSpan="3">No data available</td>
//                         </tr>
//                     )}
//                 </tbody>
//             </table>
//         </div>
//         </>
//         // <div>
//         //     <h1>Data Visualization</h1>
//         //     <table>
//         //         <thead>
//         //             <tr>
//         //                 {data[0] && Object.keys(data[0]).map((key) => (
//         //                     <th key={key}>{key}</th>
//         //                 ))}
//         //             </tr>
//         //         </thead>
//         //         <tbody>
//         //             {data.map((row, index) => (
//         //                 <tr key={index}>
//         //                     {Object.values(row).map((value, i) => (
//         //                         <td key={i}>{value}</td>
//         //                     ))}
//         //                 </tr>
//         //             ))}
//         //         </tbody>
//         //     </table>
//         // </div>
//     );
// };

// export default VisualsPage;

// import React, { useEffect, useState } from 'react';
// import Plotly from 'plotly.js-dist';
// import Plot from 'react-plotly.js';
// import * as d3 from 'd3';

// const PerformancePlot = () => {
//     const [traces, setTraces] = useState([]);
//     const [frames, setFrames] = useState([]);
//     const [sliderSteps, setSliderSteps] = useState([]);
//     const [allDates, setAllDates] = useState([]);

//     useEffect(() => {
//         d3.csv('df_performance.csv', function (err, data) {
//             if (err) {
//                 console.error(err);
//                 return;
//             }

//             const fleet_dict = {};
//             const all_dates = [...new Set(data.map(d => d['Log.Event Dt']))];

//             // Prepare data grouped by fleet and time
//             data.forEach(datum => {
//                 let performance = Math.min(datum['Performance'], 100); // Cap performance at 100%
//                 if (performance === 0) performance = 0.0001; // Handle zero performance
//                 if (datum['Stages Completed'] === 0) datum['Stages Completed'] = 0.0001; // Handle zero stages

//                 if (!fleet_dict[datum['Fleet Name']]) {
//                     fleet_dict[datum['Fleet Name']] = {
//                         x: [],
//                         y: [],
//                         text: [],
//                         marker: { size: [] },
//                         dates_seen: new Set(),
//                     };
//                 }

//                 fleet_dict[datum['Fleet Name']].x.push(datum['Log.Event Dt']);
//                 fleet_dict[datum['Fleet Name']].dates_seen.add(datum['Log.Event Dt']);
//                 fleet_dict[datum['Fleet Name']].y.push(performance);
//                 fleet_dict[datum['Fleet Name']].marker.size.push(performance * 10);
//                 fleet_dict[datum['Fleet Name']].text.push(datum['Fleet Name']);
//             });

//             // Handle missing dates for each fleet
//             for (let fleet in fleet_dict) {
//                 let fleet_data = fleet_dict[fleet];
//                 all_dates.forEach(date => {
//                     if (!fleet_data.dates_seen.has(date)) {
//                         fleet_data.x.push(date);
//                         fleet_data.y.push(0.0001);
//                         fleet_data.marker.size.push(0.0001 * 10);
//                         fleet_data.text.push(fleet);
//                     }
//                 });

//                 // Sort fleet data by date
//                 const sorted_indices = fleet_data.x
//                     .map((date, index) => [date, index])
//                     .sort((a, b) => new Date(a[0]) - new Date(b[0]))
//                     .map(pair => pair[1]);

//                 fleet_data.x = sorted_indices.map(i => fleet_data.x[i]);
//                 fleet_data.y = sorted_indices.map(i => fleet_data.y[i]);
//                 fleet_data.marker.size = sorted_indices.map(i => fleet_data.marker.size[i]);
//                 fleet_data.text = sorted_indices.map(i => fleet_data.text[i]);
//             }

//             const fleet_traces = [];
//             for (let fleet in fleet_dict) {
//                 fleet_traces.push({
//                     name: fleet,
//                     x: fleet_dict[fleet].x,
//                     y: fleet_dict[fleet].y,
//                     mode: 'markers',
//                     text: fleet_dict[fleet].text,
//                     marker: {
//                         size: fleet_dict[fleet].marker.size,
//                         sizemode: 'area',
//                         sizeref: 0.01,
//                     },
//                 });
//             }

//             const fleet_frames = [];
//             all_dates.forEach((date, i) => {
//                 const frame_data = fleet_traces.map(trace => ({
//                     x: [trace.x[i]],
//                     y: [trace.y[i]],
//                     marker: { size: [trace.marker.size[i]] },
//                     text: [trace.name],
//                 }));
//                 fleet_frames.push({
//                     name: date,
//                     data: frame_data,
//                 });
//             });

//             const fleet_sliderSteps = all_dates.map(date => ({
//                 method: 'animate',
//                 label: date,
//                 args: [[date], {
//                     mode: 'immediate',
//                     transition: { duration: 300 },
//                     frame: { duration: 300, redraw: false },
//                 }],
//             }));

//             setTraces(fleet_traces);
//             setFrames(fleet_frames);
//             setSliderSteps(fleet_sliderSteps);
//             setAllDates(all_dates);
//         });
//     }, []);

//     const layout = {
//         xaxis: { title: 'Time (Log.Event Dt)', type: 'date' },
//         yaxis: {
//             title: 'Performance (%)',
//             tickformat: ',.0%',
//             range: [0, 1], // Set Y-axis range from 0 to 100%
//         },
//         height: 800,
//         hovermode: 'closest',
//         updatemenus: [{
//             x: 0,
//             y: 0,
//             yanchor: 'top',
//             xanchor: 'left',
//             showactive: false,
//             direction: 'left',
//             type: 'buttons',
//             pad: { t: 87, r: 10 },
//             buttons: [{
//                 method: 'animate',
//                 args: [null, {
//                     mode: 'immediate',
//                     fromcurrent: true,
//                     transition: { duration: 300 },
//                     frame: { duration: 500, redraw: false },
//                 }],
//                 label: 'Play',
//             }, {
//                 method: 'animate',
//                 args: [[null], {
//                     mode: 'immediate',
//                     transition: { duration: 0 },
//                     frame: { duration: 0, redraw: false },
//                 }],
//                 label: 'Pause',
//             }],
//         }],
//         sliders: [{
//             pad: { l: 130, t: 55 },
//             currentvalue: {
//                 visible: true,
//                 prefix: 'Date:',
//                 xanchor: 'right',
//                 font: { size: 20, color: '#666' },
//             },
//             steps: sliderSteps,
//         }],
//     };

//     return (
//         <Plot
//             data={traces}
//             layout={layout}
//             frames={frames}
//             config={{ showSendToCloud: true }}
//         />
//     );
// };

// export default PerformancePlot;
