import * as d3 from "d3";
import { useEffect, useRef } from "react";

export default function BeeSwarm({colours}) {
  const chartRef = useRef(null);

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
    const chartDimensions = {
      width: 800,
      height: 200,
    };

    const margins = {
      right: 20,
      left: 20,
      bottom: 20,
    };

    const radius = 10;
    const padding = 2;

    d3.csv("/Games.nonHier.csv").then((data) => {
      console.log("Raw Data: ", data);
      const x = d3
        .scaleLinear()
        .domain(d3.extent(data, (datum) => datum["Release Year"]))
        .range([margins.left, chartDimensions.width - margins.right]);

      const svg = d3
        .select(chartRef.current)
        .append("svg")
        .attr("width", chartDimensions.width)
        .attr("height", chartDimensions.height)
        .attr("viewBox", [0, 0, chartDimensions.width, chartDimensions.height])
        .attr("style", "max-width: 100%; height: auto; border: 1px solid black;");

      svg
        .append("g")
        .attr(
          "transform",
          `translate(0, ${chartDimensions.height - margins.bottom})`
        )
        .call(d3.axisBottom(x).tickSizeOuter(0).tickFormat(d3.format("d")));

      svg
        .append("g")
        .attr("transform", `translate(0, 75)`)
        .attr("style", "border: 1px solid black;")
        .selectAll("circle")
        .data(
          dodge(data, {
            radius: radius * 2 + padding,
            x: (datum) => x(datum["Release Year"]),
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
          let genre = datum.genre;
          return colours[genre ? datum.data.Genre : "default"];
        })
        .append("title")
        .text((datum) => datum.data.Game);
    });
  }, []);

  return <div ref={chartRef}></div>;
}
