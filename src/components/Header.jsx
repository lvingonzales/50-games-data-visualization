import style_header from "../styles/style_header.module.css";
import Button from "../components/Button";

export default function Header({mainBtns, controlBtns}) {
  return (
    <>
      <div className={style_header.header}>
        <div className={style_header.hero}>
          <h2>Firstly lets decide what we would like to see: </h2>
          <div>
            {mainBtns.map(btn => (
              btn
            ))}
          </div>
        </div>
        <div className={style_header.controlPanel}>
          <p>Customize the Distribution</p>
          <div className={style_header.controls}>
            {controlBtns.map(btn => (
              btn
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
