import { h } from "preact";
import { useEffect, useState } from "preact/hooks";
import style from "./style.css";
import Modal from "react-modal";

import { v4 as uuid } from "uuid";
import Peer, { DataConnection } from "peerjs";
import { ClipboardCopy } from "src/components/clipboard-copy";
import { PlayMode } from "src/models/game";
import RemoteGame from "src/components/game/remote";
import LocalGame from "src/components/game/local";

Modal.setAppElement("#app");

const Home = () => {
    const [mode, setMode] = useState(PlayMode.UNSET);
    const [boardSize, setBoardSize] = useState(15);
    const [connection, setConnection] = useState<DataConnection | null>(null);
    const [id, setId] = useState<string | null>(null);
    const [peer, setPeer] = useState<Peer | null>(null);

    useEffect(() => {
        if (mode !== PlayMode.REMOTE) return;
        const newId = uuid();
        setId(newId);
        const newPeer = new Peer(newId);

        newPeer.on("connection", (conn) => {
            console.log("connected");

            setConnection(conn);
        });

        setPeer(newPeer);
    }, [mode]);

    return (
        <div class={style.page}>
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
                isOpen={mode === PlayMode.REMOTE && !connection}>
                <div>
                    Send this link to your friend...
                    <br />
                    or enemy.
                </div>
                <br />
                <ClipboardCopy
                    copyText={`${window.location.origin}?g=${id}`}
                />{" "}
            </Modal>
            {mode !== PlayMode.UNSET && mode === PlayMode.LOCAL ? (
                <LocalGame boardSize={boardSize} />
            ) : (
                peer &&
                connection && (
                    <RemoteGame
                        host={true}
                        boardSize={boardSize}
                        connection={connection}
                    />
                )
            )}
        </div>
    );
};

export default Home;
