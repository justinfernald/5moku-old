import { h } from "preact";
import { useEffect, useState } from "preact/hooks";
import Game from "../../components/game";
import style from "./style.css";
import Modal from "react-modal";

import { v4 as uuid } from "uuid";
import Peer from "peerjs";
import { GomokuDTO, PlayMode } from "../../models/game";

Modal.setAppElement("#app");

const RemoteJoin = ({ id: opponentId }: { id: string }) => {
    const [boardSize, setBoardSize] = useState(15);
    const [hasConnected, setHasConnected] = useState(false);
    const [id, setId] = useState<string | null>(null);
    const [peer, setPeer] = useState<Peer | null>(null);
    const [dto, setDto] = useState<GomokuDTO | null>(null);

    useEffect(() => {
        const newId = uuid();
        setId(newId);
        const newPeer = new Peer(newId);
        console.log({ remote: newId, host: opponentId });
        setPeer(newPeer);
        newPeer.on("open", () => {
            const connection = newPeer.connect(opponentId);
            connection.on("open", () => {
                setHasConnected(true);
                console.log("connected");
                // connection.send("hi!");
            });

            connection.on("data", (data: any) => {
                console.log("data");
                console.log(data);
                if (data.type === "setup") {
                    setDto(data.payload);
                }
            });
        });
    }, []);

    return (
        <div class={style.home}>
            <p>This is a Gomoku game created by Justin in a day for fun.</p>

            {hasConnected && peer && dto ? (
                <Game
                    host={false}
                    mode={PlayMode.REMOTE}
                    boardSize={boardSize}
                    peer={peer}
                    dto={dto}
                />
            ) : (
                <div>Connecting...</div>
            )}
        </div>
    );
};

export default RemoteJoin;
