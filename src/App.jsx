import { useEffect, useState } from "react";
import Treemap from "./components/treemap";
import BeeSwarm from "./components/beeswarm";
import { useElementOnScreen } from "./components/Hooks";

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

export default function App() {
  const [treeData, setTreeData] = useState("");

  const [objectRef, isVisible] = useElementOnScreen({
    root: document.querySelector("#scrollArea"),
    rootMargin: "0px",
    threshold: .6,
  });
  return (
    <>
      <div ref={objectRef} className={isVisible?"heroWrapper isVisible": "heroWrapper"}>
        <h1>Data Visualization Project: 2</h1>
        <h2>An examination of my own top 50 most played video games</h2>
        <p>By: Liam Gonzales</p>
        <img src="/Arrow.svg" alt="Arrow pointing downwards" />
      </div>
      <div ref={objectRef} className={isVisible?"mainContainer isVisible": "mainContainer"}>
        <div className="header"></div>
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
