import * as d3 from "d3";
import { useEffect, useRef } from "react";
import style_treeMap from "../styles/style_treemap.module.css";

export default function BeeSwarm({ colours, activeChart, activeCriteria }) {
  const chartRef = useRef(null);

  const renderChart = () => {
    const chartDimensions = {
      width: 1000,
      height: 300,
    };

    const margins = {
      right: 20,
      left: 20,
      bottom: 20,
    };

    const radius = 10;
    const padding = 2;

    d3.select(chartRef.current).html('');

    d3.csv("/Games.nonHier.csv").then((data) => {
      console.log("Raw Data: ", data);
      const x = d3
        .scaleLinear()
        .domain(d3.extent(data, (datum) => {
          console.log(datum[toString(activeCriteria)]);
          return datum[activeCriteria]
        }))
        .range([margins.left, chartDimensions.width - margins.right]);

      const svg = d3
        .select(chartRef.current)
        .append("svg")
        .attr("width", chartDimensions.width)
        .attr("height", chartDimensions.height)
        .attr("viewBox", [0, 0, chartDimensions.width, chartDimensions.height])
        .attr(
          "style",
          "max-width: 100%; height: auto; border: 1px solid black;"
        );

      svg
        .append("g")
        .attr(
          "transform",
          `translate(0, ${chartDimensions.height - margins.bottom})`
        )
        .call(d3.axisBottom(x).tickSizeOuter(0).tickFormat(d3.format("d")));

      svg
        .append("g")
        .attr("transform", `translate(0, 125)`)
        .attr("style", "border: 1px solid black;")
        .selectAll("circle")
        .data(
          dodge(data, {
            radius: radius * 2 + padding,
            x: (datum) => x(datum[activeCriteria]),
          })
        )
        .join("circle")
        .attr("cx", (datum) => datum.x)
        .attr(
          "cy",
          (datum) => chartDimensions.height / 2 - radius - padding - datum.y
        )
        .attr("r", radius)
        .attr("fill", (datum) => {
          let genre = datum.data.Genre;

          return colours[genre ? genre : "default"];
        })
        .append("title")
        .text((datum) => datum.data.Game);
    });
  }

  useEffect(() => {
    if (activeChart === "bee") {
      chartRef.current.classList.add(style_treeMap.activeChart);
    } else {
      chartRef.current.classList.remove(style_treeMap.activeChart);
    }
  }, [activeChart]);

  const dodge = (data, { radius, x }) => {
    const radius2 = radius ** 2;
    const circles = data
      .map((datum) => ({ x: x(datum), data: datum }))
      .sort((a, b) => a.x - b.x);
    const epsilon = 1e-3;
    let head = null,
      tail = null;

    // True if circle intersects
    const intersects = (x, y) => {
      let a = head;
      while (a) {
        if (radius2 - epsilon > (a.x - x) ** 2 + (a.y - y) ** 2) {
          // need to figure out what this does
          return true;
        }
        a = a.next; // this as well
      }
      return false;
    };

    for (const b of circles) {
      while (head && head.x < b.x - radius2) head = head.next;
      if (intersects(b.x, (b.y = 0))) {
        let a = head;
        b.y = Infinity;
        do {
          let y = a.y + Math.sqrt(radius2 - (a.x - b.x) ** 2);
          if (y < b.y && !intersects(b.x, y)) b.y = y;
          a = a.next;
        } while (a);
      }

      b.next = null;
      if (head === null) head = tail = b;
      else tail = tail.next = b;
    }
    return circles;
  };

  useEffect(() => {
    renderChart();
  }, [activeCriteria]);

  return <div className={style_treeMap.swarmWrapper} ref={chartRef}></div>;
}
