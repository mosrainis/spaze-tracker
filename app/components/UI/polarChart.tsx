import React from 'react';
import dynamic from "next/dynamic";
const Plot = dynamic(() => import("react-plotly.js"), { ssr: false, })

interface PolarInput {
  width:  number,
  height: number,
  theta:  number[],
  radian: number[]
}

export default function PolarChart({width, height, theta, radian}: PolarInput) {

  return (
    <Plot
      data={
        [
          {
            theta,
            r: radian,
            type: "scatterpolar",
            mode: "lines+markers",
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