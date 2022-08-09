import { h } from "preact";
import { useState, useEffect } from "preact/hooks";

import {
    Gomoku,
    isPeerDataTransfer,
    PeerDataTransfer,
    PeerDataTransferType,
    Player,
    Status,
} from "src//models/game";
import Grid from "./grid";
import style from "./style.css";
import Modal from "react-modal";
import { useUpdater } from "src/utils/hooks/useUpdate";
import { ConnectionHandler } from "src/utils/connection-handler";

Modal.setAppElement("#app");

const RemoteGame = ({
    host,
    boardSize = 15,
    connectionHandler,
}: {
    host: boolean;
    boardSize?: number;
    connectionHandler: ConnectionHandler;
}) => {
    const forceUpdate = useUpdater();
    const [game, setGame] = useState<Gomoku | null>(null);
    const [player, setPlayer] = useState<Player | null>(null);

    useEffect(() => {
        if (host) {
            const newGame = new Gomoku({ width: boardSize, height: boardSize });
            setGame(newGame);
            const newPlayer = [Player.X, Player.O][
                Math.floor(Math.random() * 2)
            ];
            setPlayer(newPlayer);

            const newGameData: PeerDataTransfer = {
                type: PeerDataTransferType.SETUP,
                payload: {
                    game: newGame.toDTO(),
                    player: newPlayer === Player.X ? Player.O : Player.X,
                },
            };

            connectionHandler.addListener((data, didHandle) => {
                if (
                    data.type === PeerDataTransferType.STATUS &&
                    data.payload === Status.READY
                ) {
                    connectionHandler.connection.send(newGameData);
                    didHandle();
                }
            });
        } else {
            connectionHandler.connection.send({
                type: PeerDataTransferType.STATUS,
                payload: Status.READY,
            });

            connectionHandler.addListener((data, didHandle) => {
                if (data.type === PeerDataTransferType.SETUP) {
                    setGame(Gomoku.fromDTO(data.payload.game));
                    setPlayer(data.payload.player);
                    didHandle();
                }
            });
        }
    }, []);

    useEffect(() => {
        if (!game) return;
        connectionHandler.addListener((data, didHandle) => {
            if (data.type === PeerDataTransferType.MOVE) {
                game.placeCell(data.payload.row, data.payload.col);
                didHandle();
            }

            if (data.type === PeerDataTransferType.RESET) {
                game.reset();
                setPlayer(data.payload);
                didHandle();
            }
        });
    }, [game]);

    if (!game) return <div>Loading...</div>;

    let isGameOver = game.isGameOver;

    game.addUpdateHandler(forceUpdate);
    return (
        <div class={style.root}>
            <div>
                {game.getTurn() === player ? "Your turn" : "Opponent's turn"}
            </div>
            <Grid
                game={game}
                onCellClick={(location) => {
                    if (
                        player === game.getTurn() &&
                        game.placeCell(location.row, location.col)
                    ) {
                        const placementData: PeerDataTransfer = {
                            type: PeerDataTransferType.MOVE,
                            payload: location,
                        };
                        connectionHandler.connection.send(placementData);
                    }
                }}
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
                    game.winner === player ? (
                        <div>Way to go {game.winner} player! You won!</div>
                    ) : (
                        <div>{game.winner} won! You lost!</div>
                    )
                ) : (
                    <div>You are both losers! It was a draw.</div>
                )}
                <div
                    class={style.resetButton}
                    onClick={() => {
                        const newPlayer = [Player.X, Player.O][
                            Math.floor(Math.random() * 2)
                        ];
                        setPlayer(newPlayer);
                        const newGameData: PeerDataTransfer = {
                            type: PeerDataTransferType.RESET,
                            payload:
                                newPlayer === Player.X ? Player.O : Player.X,
                        };
                        connectionHandler.connection.send(newGameData);
                        game.reset();
                    }}>
                    Play again
                </div>
            </Modal>
        </div>
    );
};

export default RemoteGame;
