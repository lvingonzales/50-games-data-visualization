import { useEffect, useState } from "react";
import Treemap from "./components/treemap";

export default function App() {
    const [treeData, setTreeData] = useState("");
    return(
        <>
            <div className="treemap">
                <Treemap setTreeData={setTreeData}/>
            </div>
            <div className="beeswarm">
            </div>
        </>
    )
}
