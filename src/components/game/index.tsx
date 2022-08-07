import { h } from "preact";
import { useState, useCallback, useRef } from "preact/hooks";

import { Gomoku } from "../../models/game";
import Grid from "./grid";
import style from "./style.css";
import Modal from "react-modal";

Modal.setAppElement("#app");

const Game = () => {
    const [, updateState] = useState<object>();
    const forceUpdate = useCallback(() => updateState({}), []);

    const gameRef = useRef(new Gomoku({ width: 15, height: 15 }));
    const game = gameRef.current;

    let isGameOver = game.isGameOver;

    game.addUpdateHandler(forceUpdate);
    return (
        <div class={style.root}>
            <Grid game={game} />
            <Modal
                style={{
                    content: {
                        top: "50%",
                        left: "50%",
                        right: "auto",
                        bottom: "auto",
                        marginRight: "-50%",
                        transform: "translate(-50%, -50%)",
                    },
                }}
                onRequestClose={() => (isGameOver = false)}
                isOpen={isGameOver}>
                <div>Way to go {game.winner} player! You won!</div>
                <div class={style.resetButton} onClick={() => game.reset()}>
                    Play again!
                </div>
            </Modal>
        </div>
    );
};

export default Game;
