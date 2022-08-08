import { h } from "preact";
import { c } from "src/utils";
import { CellState, Gomoku, Location } from "src/models/game";
import style from "./style.css";

const Grid = ({
    game,
    onCellClick,
}: {
    game: Gomoku;
    onCellClick: (location: Location) => void;
}) => (
    <div class={style.root}>
        {game.board.map((row, y) => (
            <div key={y} class={style.row}>
                {row.map((cell, x) => (
                    <Cell
                        key={x}
                        game={game}
                        location={{ col: x, row: y }}
                        cellState={cell}
                        onClick={onCellClick}
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
    onClick,
}: {
    game: Gomoku;
    location: Location;
    cellState: CellState;
    onClick?: (location: Location) => void;
}) => (
    <div
        class={c(
            style.cell,
            game.isWinningCell(location) ? style.winning : undefined
        )}
        onClick={() => onClick?.(location)}>
        {cellState === CellState.EMPTY ? null : cellState === CellState.X ? (
            <div class={style.x} />
        ) : (
            <div class={style.o} />
        )}
    </div>
);

export default Grid;
