import { shuffle } from './helpers'

export type Position = { row: number; column: number }
export type CellValue = 'Bomb' | number
export type Cell =
    | { status: 'Covered'; value: CellValue }
    | { status: 'Uncovered'; value: CellValue }

export type Grid = Cell[][]

const getSurroundingIndexes = (position: Position, grid: Grid): Position[] =>
    [
        { row: position.row + 1, column: position.column + 1 }, // top right
        { row: position.row + 0, column: position.column + 1 }, // right
        { row: position.row - 1, column: position.column + 1 }, // bottom right
        { row: position.row + 1, column: position.column + 0 }, // top
        { row: position.row - 1, column: position.column + 0 }, // bottom
        { row: position.row + 1, column: position.column - 1 }, // top left
        { row: position.row + 0, column: position.column - 1 }, // left
        { row: position.row - 1, column: position.column - 1 } // bottom left
    ].filter(
        (key) =>
            key.row >= 0 &&
            key.column >= 0 &&
            key.row < grid.length &&
            key.column < grid.length
    )

/*
Given a row index, a column index and a grid of cells,
if the cell contains a bomb, leave it unchanged,
otherwise the cell contains a number representing the number of
bombs surrounding it.
*/
function mineOrNumber(i: number, j: number, grid: Grid): Cell {
    if (grid[i][j].value === 'Bomb') {
        return grid[i][j]
    } else {
        const surrondingBombs = getSurroundingIndexes(
            { row: i, column: j },
            grid
        )
            .map((pos) => grid[pos.row][pos.column])
            .filter((cell) => cell.value === 'Bomb').length
        return { status: 'Covered', value: surrondingBombs }
    }
}

// create of initial grid of zeros
const createOpeningGrid = (size: number): Grid =>
    Array.from(Array(size), () =>
        Array.from(Array(size), () => ({ status: 'Covered', value: 0 }))
    )
/*
Create the initial grid for a game of minesweeper
*/
function createGrid(
    size: number,
    initialCellClicked: Position,
    minesWanted: number
): Grid {
    // given a grid size and a clicked cell, return a grid
    const newGrid = createOpeningGrid(size)

    // convert the inital click position to a single number
    const initPosIndex =
        initialCellClicked.row * size + initialCellClicked.column

    // create a pool of numbers the size of all the cells in the grid. filter out
    // the initial position clicked since you never want the first click to be a bomb.
    const pool = [...Array(size * size).keys()].filter(
        (n) => n !== initPosIndex
    )

    const mineNumbers = shuffle(pool).slice(0, minesWanted)

    // add the bombs to the grid
    mineNumbers.forEach((n) => {
        const row = Math.floor(n / size)
        const column = n % size
        newGrid[row][column] = { status: 'Covered', value: 'Bomb' }
    })

    // update the counts of the cells
    newGrid.forEach((row, i) => {
        row.forEach((_, j) => {
            newGrid[i][j] = mineOrNumber(i, j, newGrid)
        })
    })
    return newGrid
}

const isBomb = (position: Position, grid: Grid) =>
    grid[position.row][position.column].value === 'Bomb'

const isWin = (grid: Grid) => {
    // if all non bombs are uncovered, you win
    const allCells = ([] as Cell[]).concat(...grid)
    const bombs = allCells.filter((cell) => cell.value === 'Bomb')
    const notBombs = allCells.filter((cell) => cell.value !== 'Bomb')

    return (
        bombs.every((cell) => cell.status === 'Covered') &&
        notBombs.every((cell) => cell.status === 'Uncovered')
    )
}

const getCoveredZeroes = (position: Position, grid: Grid): Position[] =>
    getSurroundingIndexes(position, grid).filter(
        (pos) =>
            grid[pos.row][pos.column].value === 0 &&
            grid[pos.row][pos.column].status === 'Covered'
    )

const getNonZeroAdjacents = (position: Position, grid: Grid): Position[] =>
    // get cells adjacent to a position that aren't uncovered
    getSurroundingIndexes(position, grid).filter(
        (pos) =>
            grid[pos.row][pos.column].value !== 0 &&
            grid[pos.row][pos.column].status === 'Covered'
    )

const uncoverAllCells = (grid: Grid): Grid => {
    grid.forEach((row, i) =>
        row.forEach((_, j) => (grid[i][j].status = 'Uncovered'))
    )
    return grid
}

const propogateZeroes = (position: Position, grid: Grid): void => {
    // takes the position of a zero cell and blooms to all adjacent zero
    // cells.
    grid[position.row][position.column].status = 'Uncovered'

    const nonZeroAdjacents = getNonZeroAdjacents(position, grid)

    nonZeroAdjacents.map(
        (adj) => (grid[adj.row][adj.column].status = 'Uncovered')
    )

    const zeroes = getCoveredZeroes(position, grid)

    zeroes.map((pos) => propogateZeroes(pos, grid))
}

const updateGrid = (position: Position, grid: Grid): Grid => {
    // given the position of the latest clicked cell, update the grid based on the result
    // and return the updated  grid
    grid[position.row][position.column].status = 'Uncovered'

    if (grid[position.row][position.column].value === 'Bomb') {
        return grid
        // } else if (grid[position.row][position.column].value === 0) {
        //     propogateZeroes(position, grid)
        //     return grid
    } else {
        const coveredZeroes = getCoveredZeroes(position, grid)
        coveredZeroes.map((pos) => propogateZeroes(pos, grid))
        return grid
    }
}

export {
    createOpeningGrid,
    updateGrid,
    isBomb,
    isWin,
    uncoverAllCells,
    createGrid
}
