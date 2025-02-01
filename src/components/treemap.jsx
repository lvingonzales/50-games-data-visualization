import * as d3 from "d3";
import { useEffect, useRef, useState } from "react";

export default function Treemap() {
  const chartRef = useRef(null);

  useEffect(() => {
    const width = 800;
    const height = 600;

    d3.csv("/Games.csv").then((games) => {
      console.log("Raw Data:", games);

      games.forEach((game) => {
        game.Hours = +game.Hours;
        game["Price (current)"] = +game["Price (current)"];
        game["Ratings(% positive)"] = +game["Ratings (% positive)"].replace(
          "%",
          ""
        );
      });

      const stratifiedGames = d3
        .stratify()
        .id((d) => d.Game)
        .parentId((d) => d.Genre)(games);

      const root = d3.treemap().size([width, height]).padding(1).round(true)(
        d3
          .hierarchy(stratifiedGames)
          .sum((d) => d.data.Hours)
          .sort((a, b) => b.value - a.value)
      );

      console.log("Hierarchy:", root);

      const svg = d3
        .select(chartRef.current)
        .append("svg")
        .attr("viewBox", [0, 0, width, height])
        .attr("width", width)
        .attr("height", height)
        .attr("style", "max-width: 100%; height: auto; font: 10px sans-serif;");

      const leaf = svg
        .selectAll("g")
        .data(root.leaves())
        .join("rect")
        .attr("fill", `blue`)
        .attr("fill-opacity", 0.6)
        .attr("width", (d) => d.x1 - d.x0)
        .attr("height", (d) => d.y1 - d.y0)
        .attr("x", (d) => d.x0)
        .attr("y", (d) => d.y0);
    });
  });

  return <div ref={chartRef}></div>;
}
