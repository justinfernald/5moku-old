import { h } from "preact";
import { useEffect, useState } from "preact/hooks";
import RemoteGame from "src/components/game/remote";
import style from "./style.css";

import { v4 as uuid } from "uuid";
import Peer, { DataConnection } from "peerjs";

const RemoteJoin = ({ id: opponentId }: { id: string }) => {
    const [connection, setConnection] = useState<DataConnection | null>(null);

    useEffect(() => {
        const newId = uuid();
        const newPeer = new Peer(newId);
        newPeer.on("open", () => {
            console.log("connecting");
            const newConnection = newPeer.connect(opponentId);
            newConnection.on("open", () => {
                console.log("connected");
                // newConnection.send("connected");
                setConnection(newConnection);
            });

            newConnection.on("data", console.log);
        });
    }, []);

    return (
        <div class={style.page}>
            {connection ? (
                <RemoteGame host={false} connection={connection} />
            ) : (
                <div>Connecting...</div>
            )}
        </div>
    );
};

export default RemoteJoin;
