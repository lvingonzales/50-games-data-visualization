import { useEffect, useState } from "react";
import Treemap from "./components/treemap";
import BeeSwarm from "./components/beeswarm";
import { useElementOnScreen } from "./components/Hooks";
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
    threshold: .6,
  }

export default function App() {
  const [treeData, setTreeData] = useState("");

  const [heroSection, heroVisible] = useElementOnScreen(options);
  const [mainSection, mainVisible] = useElementOnScreen({...options, threshold: 0.7});
  return (
    <>
      <div ref={heroSection} className={heroVisible?"heroWrapper isVisible": "heroWrapper"}>
        <h1>Data Visualization Project: 2</h1>
        <h2>An examination of my own top 50 most played video games</h2>
        <p>By: Liam Gonzales</p>
        <img src="/Arrow.svg" alt="Arrow pointing downwards" />
      </div>
      <div ref={mainSection} className={mainVisible?"mainContainer isVisible": "mainContainer"}>
        <div className="header">
          <Button callback={() => console.log("pressed")} text={"Click Me!"} />
        </div>
        <div className="chartSpace"></div>
        <div className="infoPanel"></div>
      </div>
      {/* <div className="treemap">
                <Treemap setTreeData={setTreeData} colours={colorMapping}/>
            </div>
            <div className="beeswarm">
                <BeeSwarm colours={colorMapping} />
            </div> */}
    </>
  );
}
