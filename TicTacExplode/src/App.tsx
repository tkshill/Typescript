import { appMachine } from './fsm'
import React, { useContext } from 'react'
import { useMachine } from '@xstate/react'
import { Grid, Cell, createOpeningGrid } from './gamedata'
import { Button, Container, Row, Col } from 'react-bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'

const FSMeventContext = React.createContext<any>(undefined)

const CellComp = (props: { cell: Cell; rownum: number; colnum: number }) => {
    const display = props.cell.status === 'Covered' ? '  ' : props.cell.value

    const send = useContext(FSMeventContext)
    const style = { width: 'fill', height: 'fill' }
    return (
        <div>

            <Button
                style={style}
                key={props.colnum}
                onClick={(_) =>
                    send({
                        type: 'CLICKCELL',
                        position: {
                            row: props.rownum,
                            column: props.colnum
                        }
                    })
                }
            >
                {display}
            </Button>
        </div>
    )
}

const RowComp = (props: { row: Cell[]; rownumber: number }) => (
    <div>
        {[...props.row].map((cell, colnumber) => (
            <CellComp
                key={colnumber}
                cell={cell}
                rownum={props.rownumber}
                colnum={colnumber}
            />
        ))}
    </div>
)

const GridComp = (props: { grid: Grid }) => {
    const rows = [...props.grid]

    return (
        <div
            style={{
                display: 'grid',
                gridTemplateColumns: `repeat(${rows.length}, 1fr)`
            }}
        >
            {rows.map((row, index) => (
                <RowComp key={index} row={row} rownumber={index} />
            ))}
        </div>
    )
}


const RowComp = (props: { row: Cell[]; rownumber: number }) => {
    const row = [...props.row]

    return (
        <Row xs={row.length}>
            {row.map((cell, colnumber) => (
                <CellComp
                    key={colnumber}
                    cell={cell}
                    rownum={props.rownumber}
                    colnum={colnumber}
                />
            ))}
        </Row>
    )
}

const GridComp = (props: { grid: Grid }) => (
    <div>
        {[...props.grid].map((row, index) => (
            <RowComp key={index} row={row} rownumber={index} />
        ))}
    </div>
)


export default function App() {
    const [current, send] = useMachine(appMachine)
    console.log(current.context)

    const Main = () => {
        if (current.matches('preGame')) {
            return (
                <div className="container">
                    <select
                        value={current.context.size}
                        onChange={(e) =>
                            send({
                                type: 'CHOOSESIZE',
                                size: parseInt(e.target.value, 10)
                            })
                        }
                    >
                        <option value={3}>3 x 3</option>
                        <option value={5}>5 x 5</option>
                        <option value={10}>10 x 10</option>
                    </select>
                    <button onClick={(_) => send({ type: 'STARTGAME' })}>
                        Start Game
                    </button>
                </div>
            )
        } else if (current.matches('inGame.openingGame')) {
            const grid: Grid = createOpeningGrid(current.context.size)
            return (
                <div>
                    <div>{current.context.duration}</div>
                    <GridComp grid={grid} />
                </div>
            )
        } else if (current.matches('inGame.activeGame')) {
            return (
                <div>
                    <div>{current.context.duration}</div>
                    <GridComp grid={current.context.grid} />
                </div>
            )
        } else if (current.matches('endGame.win')) {
            return (
                <div>
                    <div>You won!</div>
                    <GridComp grid={current.context.grid} />
                </div>
            )
        } else if (current.matches('endGame.lose')) {
            return (
                <div>
                    <div>You lost!</div>
                    <GridComp grid={current.context.grid} />
                </div>
            )
        } else {
            return <div></div>
        }
    }
    return (
        <div className="container">
            <FSMeventContext.Provider value={send}>
                <Main />
            </FSMeventContext.Provider>
        </div>
    )
}
