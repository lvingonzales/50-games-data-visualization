import style_chart from "../styles/style_chart.module.css"
import Treemap from "./treemap"

export default function Chart({children}) {

    return (
        <>
            <div className={style_chart.chartWrapper}>
                {children}
            </div>
        </>
    )
}
