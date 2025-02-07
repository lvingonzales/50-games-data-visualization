import { useEffect, useState } from "react";
import Treemap from "./components/treemap";
import BeeSwarm from "./components/beeswarm";
import { useElementOnScreen } from "./components/Hooks";
import Header from "./components/Header";
import Chart from "./components/Chart";
import Button from "./components/Button";

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

const options = {
  root: null,
  rootMargin: "0px",
  threshold: 1.0,
};

export default function App() {
  // const [treeData, setTreeData] = useState("");

  const [activeChart, setActiveChart] = useState("tree");
  const [activeCriteria, setActiveCriteria] = useState("Release Year");

  const [heroSection, heroVisible] = useElementOnScreen({
    ...options,
    threshold: 0.2,
  });
  const [mainSection, mainVisible] = useElementOnScreen({
    ...options,
    threshold: 0.5,
  });
  return (
    <>
      <div
        ref={heroSection}
        className={heroVisible ? "heroWrapper isVisible" : "heroWrapper"}
      >
        <h1>Data Visualization Project: 2</h1>
        <h2>An examination of my own top 50 most played video games</h2>
        <p>By: Liam Gonzales</p>
        <img src="/Arrow.svg" alt="Arrow pointing downwards" />
      </div>
      <div
        ref={mainSection}
        className={mainVisible ? "mainContainer isVisible" : "mainContainer"}
      >
        <Header
          mainBtns={[
            <Button
              key={crypto.randomUUID()}
              callback={() => setActiveChart("tree")}
              text={"Comparisons"}
              activeChart={activeChart}
              associatedChart={"tree"}
            />,
            <Button
              key={crypto.randomUUID()}
              callback={() => setActiveChart("bee")}
              text={"Distributions"}
              activeChart={activeChart}
              associatedChart={"bee"}
            />,
          ]}
          controlBtns={[
            <Button
              key={crypto.randomUUID()}
              text={"Price"}
              callback={() => setActiveCriteria("Price (current)")}
              activeChart={activeChart}
              associatedChart={"bee"}
              activeCriteria={activeCriteria}
              associatedCriteria={"Price (current)"}
            />,
            <Button
              key={crypto.randomUUID()}
              text={"Release Year"}
              callback={() => setActiveCriteria("Release Year")}
              activeChart={activeChart}
              associatedChart={"bee"}
              activeCriteria={activeCriteria}
              associatedCriteria={"Release Year"}
            />,
            <Button
              key={crypto.randomUUID()}
              text={"Ratings"}
              callback={() => setActiveCriteria("Ratings (% positive)")}
              activeChart={activeChart}
              associatedChart={"bee"}
              activeCriteria={activeCriteria}
              associatedCriteria={"Ratings (% positive)"}
            />,
          ]}
        />

        <Chart>
          <Treemap colours={colorMapping} activeChart={activeChart} />
          <BeeSwarm colours={colorMapping} activeChart={activeChart} activeCriteria={activeCriteria} />
        </Chart>
        <div className="infoPanel"></div>
      </div>
    </>
  );
}
