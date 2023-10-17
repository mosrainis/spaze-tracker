import React from 'react';
import dynamic from "next/dynamic";
import icon from '@/app/icons/observe.png';
import { config } from 'process';
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
            mode: "text+lines+markers",
            text: ['Start', 'Max', 'End'],
            textposition: 'bottom center',
            texttemplate: '%{text}',
            textfont: {
              size: 12,
              color: '#000',
            },
            line: {
              color: "#1677ff",
              shape: 'spline'
            },
            marker: {
              color: ["#215399", "#1677ff", "#1677ff"],
              symbol: ["x", "circle", 'triangle-ne'],
              size: 10
            }
          }
        ]
      }
        layout={
          {
            width, height,
            // paper_bgcolor: '#c1c1c1',
            autosize: false,
            dragmode: false,
            showlegend: false,
            polar: {
              radialaxis: {
                tickvals: [0, 1.3, 2.3],
                tickfont: {
                  size: 8
                },
                showline: false,
                // showgrid: false,
                showticklabels: false,
                ticks: ""
              },
              angularaxis: {
                tickvals: [0, 90, 180, 270],
                ticktext: ['N', 'E', 'S', 'W'],
                tickfont: {
                  size: 12
                },
                direction: "clockwise"
              }
            },
            images: [
              {
                source: icon.src,
                x: 0.44,
                y: 0.58,
                xref: 'paper',
                yref: 'paper',
                sizex: 0.15,
                sizey: 0.15,
                opacity: 0.4
              }
            ],
          }
        }
        config={{
          displayModeBar: false,
          
        }}
      />
  );
}