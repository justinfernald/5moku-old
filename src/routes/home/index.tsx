import { h } from "preact";
import { useEffect, useState } from "preact/hooks";
import Game from "../../components/game";
import style from "./style.css";
import Modal from "react-modal";

import { v4 as uuid } from "uuid";
import Peer from "peerjs";
import { ClipboardCopy } from "../../components/clipboard-copy";
import { PlayMode } from "../../models/game";

Modal.setAppElement("#app");

const Home = () => {
    const [mode, setMode] = useState(PlayMode.UNSET);
    const [boardSize, setBoardSize] = useState(15);
    const [hasConnected, setHasConnected] = useState(false);
    const [id, setId] = useState<string | null>(null);
    const [peer, setPeer] = useState<Peer | null>(null);

    useEffect(() => {
        if (mode !== PlayMode.REMOTE) return;
        const newId = uuid();
        setId(newId);
        const newPeer = new Peer(newId);
        console.log({ host: newId });

        newPeer.on("connection", (conn) => {
            setHasConnected(true);
        });

        setPeer(newPeer);
    }, [mode]);

    return (
        <div class={style.home}>
            <p>This is a Gomoku game created by Justin in a day for fun.</p>
            <Modal
                style={{
                    content: {
                        top: "50%",
                        left: "50%",
                        right: "auto",
                        bottom: "auto",
                        marginRight: "-50%",
                        transform: "translate(-50%, -50%)",
                        border: "none",
                        boxShadow:
                            "0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23)",
                    },
                    overlay: {
                        background: "unset",
                    },
                }}
                isOpen={mode === PlayMode.UNSET}>
                <div>How would you like to play?</div>
                <br />
                <div>
                    <label for="board-size">{"Board Size: "}</label>
                    <select
                        name="board-size"
                        onChange={(e) =>
                            setBoardSize(+(e.target as HTMLOptionElement).value)
                        }>
                        <option value={10}>10x10</option>
                        <option value={15} selected>
                            15x15
                        </option>
                        <option value={19}>19x19</option>
                    </select>
                </div>
                <div class={style.buttonWrapper}>
                    <div
                        class={style.button}
                        onClick={() => setMode(PlayMode.LOCAL)}>
                        Local
                    </div>
                    <div
                        class={style.button}
                        onClick={() => setMode(PlayMode.REMOTE)}>
                        Online
                    </div>
                </div>
            </Modal>
            <Modal
                style={{
                    content: {
                        top: "50%",
                        left: "50%",
                        right: "auto",
                        bottom: "auto",
                        marginRight: "-50%",
                        transform: "translate(-50%, -50%)",
                        border: "none",
                        boxShadow:
                            "0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23)",
                    },
                    overlay: {
                        background: "unset",
                    },
                }}
                isOpen={mode === PlayMode.REMOTE && !hasConnected}>
                <div>
                    Send this link to your friend...
                    <br />
                    or enemy.
                </div>
                <br />
                <ClipboardCopy
                    copyText={`${window.location.origin}/${id}`}
                />{" "}
            </Modal>
            {mode !== PlayMode.UNSET && (
                <Game
                    host={true}
                    mode={mode}
                    boardSize={boardSize}
                    peer={peer ?? undefined}
                />
            )}
        </div>
    );
};

export default Home;
