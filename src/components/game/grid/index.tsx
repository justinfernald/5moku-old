import { h } from "preact";
import { CellState, Gomoku, Location } from "../../../models/game";
import style from "./style.css";

const Grid = ({ game }: { game: Gomoku }) => (
    <div class={style.root}>
        {game.board.map((row, y) => (
            <div key={y} class={style.row}>
                {row.map((cell, x) => (
                    <Cell
                        key={x}
                        game={game}
                        location={{ col: x, row: y }}
                        cellState={cell}
                    />
                ))}
            </div>
        ))}
    </div>
);

const Cell = ({
    game,
    location,
    cellState,
}: {
    game: Gomoku;
    location: Location;
    cellState: CellState;
}) => (
    <div
        class={[
            style.cell,
            game.isWinningCell(location) ? style.winning : undefined,
        ].join(" ")}
        onClick={() => game.placeCell(location.row, location.col)}>
        {cellState === CellState.EMPTY ? null : cellState === CellState.X ? (
            <div class={style.x} />
        ) : (
            <div class={style.o} />
        )}
    </div>
);

export default Grid;
