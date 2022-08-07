import { h } from "preact";
import Game from "../../components/game";
import style from "./style.css";

const Home = () => (
    <div class={style.home}>
        <p>This is a Gomoku game created by Justin in a day for fun.</p>
        <Game />
    </div>
);

export default Home;
