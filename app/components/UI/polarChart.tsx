import React from 'react';
import dynamic from "next/dynamic";
const Plot = dynamic(() => import("react-plotly.js"), { ssr: false, })


export default function PolarChart() {

  return (
    <Plot
      data={
        [
          {
            type: "scatterpolar",
            mode: "lines+markers",
            r: [1,2,3,4,5],
            theta: [0,90,180,360,0],
            line: {
              color: "#ff66ab"
            },
            marker: {
              color: "#8090c7",
              symbol: "square",
              size: 8
            },
            subplot: "polar"
          }
        ]
      }
        layout={
          {
            dragmode: false,
            automargin: true,
            showlegend: false,
            polar: {
              domain: {
                x: [0,0.4],
                y: [0,1]
              },
              radialaxis: {
                tickfont: {
                  size: 8
                }
              },
              angularaxis: {
                tickfont: {
                  size: 8
                },
                direction: "clockwise"
              }
            }
          }
        }
      />
  );
}