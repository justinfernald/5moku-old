import { h } from "preact";
import { useState, useCallback, useRef, MutableRef } from "preact/hooks";

import { Gomoku, GomokuDTO, PlayMode } from "../../models/game";
import Grid from "./grid";
import style from "./style.css";
import Modal from "react-modal";
import Peer from "peerjs";

Modal.setAppElement("#app");

const Game = ({
    host,
    mode,
    boardSize = 15,
    peer,
    dto,
}: {
    host: boolean;
    mode: PlayMode;
    boardSize: number;
    peer?: Peer;
    dto?: GomokuDTO;
}) => {
    const [, updateState] = useState<object>();
    const forceUpdate = useCallback(() => updateState({}), []);

    let gameRef: MutableRef<Gomoku>;
    if (host) {
        gameRef = useRef(new Gomoku({ width: boardSize, height: boardSize }));
        if (mode === PlayMode.REMOTE && peer) {
            peer.on("connection", (conn) => {
                console.log("connection");

                conn.on("data", (data) => {
                    console.log("data");
                    console.log(data);
                });

                conn.on("open", () => {
                    console.log("open");
                    conn.send({
                        type: "setup",
                        payload: gameRef.current.toDTO(),
                    });
                });
            });
        }
    } else {
        if (!dto) {
            throw new Error("dto is required");
        }
        gameRef = useRef(Gomoku.fromDTO(dto));
    }
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
                {game.winner ? (
                    <div>Way to go {game.winner} player! You won!</div>
                ) : (
                    <div>You are both losers! It was a draw.</div>
                )}
                <div class={style.resetButton} onClick={() => game.reset()}>
                    Play again
                </div>
            </Modal>
        </div>
    );
};

export default Game;
