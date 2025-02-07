import * as d3 from "d3";
import { useEffect, useRef} from "react";
import style_treeMap from "../styles/style_treemap.module.css";

export default function Treemap({setTreeData, colours}) {
  const chartRef = useRef(null);

  const uid = (prefix = "id") => {
    return `${prefix}-${crypto.randomUUID()}`;
  };

  const resetChart = () => {
    Array.from(document.querySelectorAll('rect')).forEach(rect => {
      rect.classList.remove(style_treeMap.inactive);
      rect.classList.remove(style_treeMap.active);
      rect.classList.remove(style_treeMap.selected);
    });
  }

  useEffect(() => {
    const width = 1600;
    const height = 800;
    

    const margin = {
      top: 10,
      left: 50,
      bottom: 10,
      right: 100,
    };

    d3.csv("/Games.csv").then((games) => {
      //console.log("Raw Data:", games);

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

      //console.log("Hierarchy:", root);

      const svg = d3
        .select(chartRef.current)
        .append("svg")
        .attr("viewBox", [0, 0, width + margin.right + margin.left, height])
        .attr("width", width)
        .attr("height", height)
        .attr("style", "max-width: 100%; height: auto; font: 10px sans-serif;")
        .on("mouseleave", () => {
          resetChart();
        })

      const leafContainer = svg.append("g");

      const leaf = leafContainer
        .selectAll("g")
        .data(root.leaves())
        .join("a")
        .attr("id", "treeLeaf")
        .attr("class", (d) => d.parent.data.id)
        .attr("transform", (d) => `translate(${d.x0},${d.y0})`)
        .attr("href", d => `https://steamdb.info/app/${d.data.data.AppId}/`)
        .attr("target", "_blank")
        .on("mouseover", (event) => {
          let group = event.currentTarget.classList.value;
          let selected = event.currentTarget.querySelector("rect");

          let leaves = Array.from(document.querySelectorAll("#treeLeaf"));

          leaves.forEach((leaf) => {
            let leafRect = leaf.querySelector("rect");
            if (
              leaf !== selected &&
              leafRect.classList.contains(style_treeMap.selected)
            ) {
              leafRect.classList.remove(style_treeMap.selected);
            }
            if (leaf.classList.contains(group)) {
              leafRect.classList.remove(style_treeMap.inactive);
              leafRect.classList.add(style_treeMap.active);
              selected.classList.add(style_treeMap.selected);
            } else {
              leafRect.classList.add(style_treeMap.inactive);
            }
          });
        })

      leaf
        .append("rect")
        .attr("class", style_treeMap.rects)
        .attr("id", (d) => (d.leafUid = uid("leaf")))
        .attr("width", (d) => d.x1 - d.x0)
        .attr("height", (d) => d.y1 - d.y0)
        .attr("fill", (d) => {
          let parent = d.parent;
          while (parent && !colours[parent.data.id]) {
            parent = parent.parent;
          }

          return colours[parent ? parent.data.id : "default"];
        });

      leaf
        .append("clipPath")
        .attr("id", (d) => (d.clipUid = uid("clip-path")))
        .append("use")
        .attr("href", (d) => `#${d.leafUid}`);

      leaf
        .append("text")
        .attr("fill", "white")
        .attr("clip-path", (d) => d.clipUid)
        .attr("font-size", "16px")
        .selectAll("tspan")
        .data((d) =>
          d.data.id
            .split(/(?=[A-Z][a-z])|\s+/g)
            .concat(d3.format(".1f")(d.value))
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

      const legendWrapper = svg
        .append("g")
        .attr("transform-origin", "50 50")
        .attr("transform", `translate(${width}, ${margin.top})`)
        .attr("class", style_treeMap.legendWrapper);

      const legend = legendWrapper
        .selectAll(".legend")
        .data(Object.entries(colours))
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
  }, []);

  return (
    <div>
      <div ref={chartRef}>
      </div>
    </div>
  );
}
