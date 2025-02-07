import style_header from "../styles/style_header.module.css";
import Button from "../components/Button";

export default function Header() {
  return (
    <>
      <div className={style_header.header}>
        <div className={style_header.hero}>
          <h2>Firstly lets decide what we would like to see: </h2>
          <div>
            <Button text={"Comparisons"} />
            <Button text={"Distributions"} />
          </div>
        </div>
        <div className={style_header.controlPanel}>
          <p>Now Customise</p>
          <div className={style_header.controls}>
            <Button
              callback={() => console.log("pressed")}
              text={"Click Me!"}
            />
          </div>
        </div>
      </div>
    </>
  );
}
