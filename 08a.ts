const file = await Deno.readTextFile("./08-input.txt");

const input = file
  .trim()
  .split("\n")
  .map((line) => line.split(""));

class Cell {
  value: number;
  isVisible: boolean;

  constructor(value: number, isVisible: boolean) {
    this.value = value;
    this.isVisible = isVisible;
  }
}

class Grid {
  cells: Cell[][];

  constructor(input: string[][]) {
    this.cells = this.initializeGrid(input);
  }

  draw() {
    this.cells.forEach((row) => {
      console.log(row.map((cell) => cell.value).join(""));
    });
  }

  getVisibleCellsCount() {
    return this.cells.reduce((acc, row) => {
      return acc.concat(row.filter((cell) => cell.isVisible));
    }, []).length;
  }

  getCellByRowIndexAndColumnIndex(rowIndex: number, columnIndex: number) {
    return this.cells[rowIndex][columnIndex];
  }

  isVisible(cell: Cell) {
    if (cell.isVisible) return true;

    const isVisible = this._isVisible(cell);

    cell.isVisible = isVisible;

    return cell.isVisible;
  }

  private _isVisible(cell: Cell) {
    const cellsToRight = this.getCellsToRight(cell);
    const cellsToLeft = this.getCellsToLeft(cell);
    const cellsAbove = this.getCellsAbove(cell);
    const cellsBelow = this.getCellsBelow(cell);

    const isVisible =
      cellsToRight.every((c) => c.value < cell.value) ||
      cellsToLeft.every((c) => c.value < cell.value) ||
      cellsAbove.every((c) => c.value < cell.value) ||
      cellsBelow.every((c) => c.value < cell.value);

    return isVisible;
  }

  private getCellsBelow(cell: Cell) {
    return this.getCellsInColumn(cell).slice(this.getRowIndex(cell) + 1);
  }

  private getCellsInColumn(cell: Cell) {
    return this.cells.map((row) => row[this.getColumnIndex(cell)]);
  }

  private getCellsAbove(cell: Cell) {
    return this.getCellsInColumn(cell)
      .slice(0, this.getRowIndex(cell))
      .reverse();
  }

  private getCellsToRight(cell: Cell) {
    return this.cells[this.getRowIndex(cell)].slice(
      this.getColumnIndex(cell) + 1
    );
  }

  private getCellsToLeft(cell: Cell) {
    return this.cells[this.getRowIndex(cell)]
      .slice(0, this.getColumnIndex(cell))
      .reverse();
  }

  private getRowIndex(cell: Cell) {
    return this.cells.findIndex((row) => row.includes(cell));
  }

  private getColumnIndex(cell: Cell) {
    return this.cells[this.getRowIndex(cell)].findIndex((c) => c === cell);
  }

  private initializeGrid(input: string[][]) {
    return input.map((row, rowIndex) =>
      row.map((column, columnIndex) => {
        const isEdgeCell =
          rowIndex === 0 ||
          columnIndex === 0 ||
          rowIndex === input.length - 1 ||
          columnIndex === row.length - 1;

        return new Cell(parseInt(column), isEdgeCell ? true : false);
      })
    );
  }
}

function main() {
  const grid = new Grid(input);

  const cells = grid.cells;

  for (const cell of cells) {
    for (const c of cell) {
      grid.isVisible(c);
    }
  }

  console.log({ visibleCellsCount: grid.getVisibleCellsCount() });
}

main();
