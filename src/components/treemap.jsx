import * as d3 from "d3";
import { useEffect, useRef, useState } from "react";
import style_treeMap from "../styles/style_treemap.module.css";

export default function Treemap() {
  const chartRef = useRef(null);

  const uid = (prefix = "id") => {
    return `${prefix}-${crypto.randomUUID()}`;
  }

  const colorMapping = {
    Action: "#9E0031", //Red
    Adventure: "#386C0B", //Green
    Strategy: "#183059", //Blue
    Casual: "#F40076", // Pink
    "Role-Playing": "#571F4E", //Deep Purple
    "Colony Builder": "#2A2D34", // Dark Grey , Slate
    Fighting: "#7B0828", //Claret
    Sandbox: "#41292C", //Van Dyke
    Survival: "#3A015C", //Violet
    "Tower-Defense": "#362417", //Bistre
  };

  useEffect(() => {
    const width = 1000;
    const height = 800;

    const margin = {
      top: 10,
      left: 50,
      bottom: 10,
      right: 100,
    };

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

      const root = d3.treemap().size([width, height]).padding(1.5).round(true)(
        d3
          .hierarchy(stratifiedGames)
          .sum((d) => d.data.Hours)
          .sort((a, b) => b.value - a.value)
      );

      console.log("Hierarchy:", root);

      const svg = d3
        .select(chartRef.current)
        .append("svg")
        .attr("viewBox", [0, 0, width + margin.right + margin.left, height])
        .attr("width", width)
        .attr("height", height)
        .attr("style", "max-width: 100%; height: auto; font: 10px sans-serif;");

      const leafContainer = svg.append("g");

      const leaf = leafContainer
        .selectAll("g")
        .data(root.leaves())
        .join("rect")
        .attr("id", (d) => (d.leafUid = uid("leaf"))) 
        .attr("width", (d) => d.x1 - d.x0)
        .attr("height", (d) => d.y1 - d.y0)
        .attr("x", (d) => d.x0)
        .attr("y", (d) => d.y0)
        .attr("fill", (d) => {
          let parent = d.parent;
          while (parent && !colorMapping[parent.data.id]) {
            parent = parent.parent;
          }

          return colorMapping[parent ? parent.data.id : "default"];
        });

      leaf
        .append("clipPath")
        .attr("id", (d) => (d.clipUid = uid("clip-path")))
        .append("use")
        .attr("href", (d) => `#${d.leafUid}`);

      leaf
        .append("text")
        .attr("clip-path", (d) => d.clipUid)
        .selectAll("tspan")
        .data((d) =>
          d.data.id.split(/(?=[A-Z][a-z])|\s+/g).concat(d3.format(d.value))
        )
        .join("tspan") // Create/update/remove <tspan> elements based on data
        .attr("x", 3) // Set horizontal position
        .attr(
          "y",
          (
            d,
            i,
            nodes // Set vertical position
          ) => `${(i === nodes.length - 1) * 0.3 + 1.1 + i * 0.9}em`
        )
        .attr(
          "fill-opacity",
          (
            d,
            i,
            nodes // Adjust opacity for the last <tspan>
          ) => (i === nodes.length - 1 ? 0.7 : null)
        )
        .text((d) => d); // Set text content

      svg
        .selectAll("text")
        .data(root.leaves())
        .enter()
        .append("text")
        .attr("x", function (d) {
          return d.x0 + 5;
        }) // +10 to adjust position (more right)
        .attr("y", function (d) {
          return d.y0 + 20;
        }) // +20 to adjust position (lower)
        .text(function (d) {
          return d.data.id;
        })
        .attr("font-size", "19px")
        .attr("fill", "white");

      svg
        .selectAll("vals")
        .data(root.leaves())
        .enter()
        .append("text")
        .attr("x", function (d) {
          return d.x0 + 5;
        }) // +10 to adjust position (more right)
        .attr("y", function (d) {
          return d.y0 + 35;
        }) // +20 to adjust position (lower)
        .text(function (d) {
          return d.data.data.Hours;
        })
        .attr("font-size", "11px")
        .attr("fill", "white");

      const legendWrapper = svg
        .append("g")
        .attr("transform-origin", "50 50")
        .attr("transform", `translate(${width}, ${margin.top})`)
        .attr("class", style_treeMap.legendWrapper);

      const legend = legendWrapper
        .selectAll(".legend")
        .data(Object.entries(colorMapping))
        .enter()
        .append("g")
        .attr("class", style_treeMap.legend)
        .attr("transform", (d, i) => `translate(0, ${i * 50})`);

      legend
        .append("rect")
        .attr("width", 18)
        .attr("height", 18)
        .attr("fill", (d) => d[1]);

      legend
        .append("text")
        .attr("class", style_treeMap.legendText)
        .attr("x", 20)
        .attr("y", 14)
        .text((d) => d[0]);
    });
  });

  return <div ref={chartRef}></div>;
}
