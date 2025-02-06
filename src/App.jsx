import { useEffect, useState } from "react";
import Treemap from "./components/treemap";
import BeeSwarm from "./components/beeswarm";

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
    return(
        <>
            <div className="treemap">
                <Treemap setTreeData={setTreeData} colours={colorMapping}/>
            </div>
            <div className="beeswarm">
                <BeeSwarm colours={colorMapping} />
            </div>
        </>
    )
}
