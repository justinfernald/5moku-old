import { h } from "preact";
import { useRef } from "preact/hooks";

import { Gomoku } from "src/models/game";
import Grid from "./grid";
import style from "./style.css";
import Modal from "react-modal";
import { useUpdater } from "src/utils/hooks/useUpdate";

Modal.setAppElement("#app");

const LocalGame = ({ boardSize = 15 }: { boardSize: number }) => {
    const forceUpdate = useUpdater();

    const gameRef = useRef(new Gomoku({ width: boardSize, height: boardSize }));
    const game = gameRef.current;

    let isGameOver = game.isGameOver;

    game.addUpdateHandler(forceUpdate);
    return (
        <div class={style.root}>
            <Grid
                game={game}
                onCellClick={(location) =>
                    game.placeCell(location.row, location.col)
                }
            />
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
                {game.winner ? (
                    <div>Way to go {game.winner} player! You won!</div>
                ) : (
                    <div>You are both losers! It was a draw.</div>
                )}
                <div class={style.resetButton} onClick={game.reset}>
                    Play again
                </div>
            </Modal>
        </div>
    );
};

export default LocalGame;
