import React, { useEffect, useRef } from "react";
import Plotly from "plotly.js-dist";

const FleetPerformanceChart = ({ data }) => {
  const chartRef = useRef(null);

  useEffect(() => {
    if (data && chartRef.current) {
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
      const traces = Object.keys(fleets).map((fleet) => ({
        x: fleets[fleet].x,
        y: fleets[fleet].y,
        mode: "lines",
        name: fleets[fleet].name,
        line: { width: 2 },
      }));

      // Define the layout for the line chart
      const layout = {
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

      // Plot the line chart
      Plotly.newPlot(chartRef.current, traces, layout);
    }
  }, [data]);

  return <div ref={chartRef} style={{ width: "100%", height: "750px" }} />;
};