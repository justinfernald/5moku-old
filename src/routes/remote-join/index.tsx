import { h } from "preact";
import { useEffect, useState } from "preact/hooks";
import RemoteGame from "src/components/game/remote";
import style from "./style.css";

import { v4 as uuid } from "uuid";
import Peer, { DataConnection } from "peerjs";
import { ConnectionHandler } from "src/utils/connection-handler";

const RemoteJoin = ({ id: opponentId }: { id: string }) => {
    const [connectionHandler, setConnectionHandler] =
        useState<ConnectionHandler | null>(null);

    useEffect(() => {
        const newId = uuid();
        const newPeer = new Peer(newId);
        newPeer.on("open", () => {
            const newConnection = newPeer.connect(opponentId);
            const newConnectionHandler = new ConnectionHandler(newConnection);
            newConnection.on("open", () =>
                setConnectionHandler(newConnectionHandler)
            );
        });
    }, []);

    return (
        <div class={style.page}>
            {connectionHandler ? (
                <RemoteGame
                    host={false}
                    connectionHandler={connectionHandler}
                />
            ) : (
                <div>Connecting...</div>
            )}
        </div>
    );
};

export default RemoteJoin;
