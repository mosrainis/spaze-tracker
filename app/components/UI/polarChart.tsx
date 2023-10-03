import React from 'react';
import dynamic from "next/dynamic";
const Plot = dynamic(() => import("react-plotly.js"), { ssr: false, })

interface PolarInput {
  width: number,
  height: number
}

export default function PolarChart({width, height}: PolarInput) {

  return (
    <Plot
      data={
        [
          {
            type: "scatterpolar",
            mode: "lines+markers",
            r: [1,2,3,4,5],
            theta: [0,90],
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
            width, height,
            // paper_bgcolor: '#c1c1c1',
            autosize: false,
            dragmode: false,
            automargin: true,
            showlegend: false,
            polar: {
              radialaxis: {
                tickfont: {
                  size: 8
                }
              },
              angularaxis: {
                tickfont: {
                  size: 10
                },
                direction: "clockwise"
              }
            }
          }
        }
      />
  );
}