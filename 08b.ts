const file = await Deno.readTextFile("./08-input.txt");

const input = file
  .trim()
  .split("\n")
  .map((line) => line.split(""));

const DIRECTION = {
  ABOVE: "ABOVE",
  BELOW: "BELOW",
  LEFT: "LEFT",
  RIGHT: "RIGHT",
} as const;

type Direction = typeof DIRECTION[keyof typeof DIRECTION];

class Tree {
  height: number;
  scenicScore?: number;

  constructor(height: number, scenicScore?: number) {
    this.height = height;
    this.scenicScore = scenicScore;
  }
}

class Grid {
  trees: Tree[][];

  constructor(input: string[][]) {
    this.trees = this.initializeGrid(input);
  }

  draw() {
    this.trees.forEach((row) => {
      console.log(row.map((tree) => tree.height).join(""));
    });
  }

  getMostScenicTree() {
    let mostScenicTree: Tree | undefined;

    for (const row of this.trees) {
      for (const tree of row) {
        if (
          !mostScenicTree ||
          this.getScenicScore(tree) > this.getScenicScore(mostScenicTree)
        ) {
          mostScenicTree = tree;
        }
      }
    }

    return mostScenicTree;
  }

  getScenicScore(tree: Tree) {
    if (typeof tree.scenicScore === "number") return tree.scenicScore;

    const {
      aboveScenicScore,
      rightScenicScore,
      belowScenicScore,
      leftScenicScore,
    } = this._getScenicScores(tree);

    const score =
      aboveScenicScore * rightScenicScore * belowScenicScore * leftScenicScore;

    tree.scenicScore = score;

    return score;
  }

  private _getScenicScores(tree: Tree) {
    const aboveScenicScore = this._getScenicScore(tree, DIRECTION.ABOVE);
    const rightScenicScore = this._getScenicScore(tree, DIRECTION.RIGHT);
    const belowScenicScore = this._getScenicScore(tree, DIRECTION.BELOW);
    const leftScenicScore = this._getScenicScore(tree, DIRECTION.LEFT);

    return {
      aboveScenicScore,
      rightScenicScore,
      belowScenicScore,
      leftScenicScore,
    };
  }

  private _getScenicScore(tree: Tree, direction: Direction) {
    let scenicScore = 0;

    const comparisonTrees = this.getComparisonTrees(tree, direction);

    for (const comparisonTree of comparisonTrees) {
      if (
        comparisonTree.height >= tree.height ||
        this.comparisonTreeIsAtEdge(comparisonTree, direction)
      ) {
        scenicScore = this.distanceBetweenTrees(
          tree,
          comparisonTree,
          direction
        );
        break;
      }
    }

    return scenicScore;
  }

  private distanceBetweenTrees(
    tree: Tree,
    comparisonTree: Tree,
    direction: Direction
  ) {
    switch (direction) {
      case DIRECTION.ABOVE:
        return this.getRowIndex(tree) - this.getRowIndex(comparisonTree);
      case DIRECTION.BELOW:
        return this.getRowIndex(comparisonTree) - this.getRowIndex(tree);
      case DIRECTION.LEFT:
        return this.getColumnIndex(tree) - this.getColumnIndex(comparisonTree);
      case DIRECTION.RIGHT:
        return this.getColumnIndex(comparisonTree) - this.getColumnIndex(tree);
    }
  }

  private comparisonTreeIsAtEdge(comparisonTree: Tree, direction: Direction) {
    switch (direction) {
      case DIRECTION.ABOVE:
        return this.getRowIndex(comparisonTree) === 0;
      case DIRECTION.BELOW:
        return this.getRowIndex(comparisonTree) === this.trees.length - 1;
      case DIRECTION.LEFT:
        return this.getColumnIndex(comparisonTree) === 0;
      case DIRECTION.RIGHT:
        return this.getColumnIndex(comparisonTree) === this.trees[0].length - 1;
    }
  }

  private getComparisonTrees(tree: Tree, direction: Direction) {
    switch (direction) {
      case DIRECTION.ABOVE:
        return this.getTreesAbove(tree);
      case DIRECTION.BELOW:
        return this.getTreesBelow(tree);
      case DIRECTION.LEFT:
        return this.getTreesToLeft(tree);
      case DIRECTION.RIGHT:
        return this.getTreesToRight(tree);
    }
  }

  private getTreesAbove(tree: Tree) {
    return this.getTreesInColumn(tree)
      .slice(0, this.getRowIndex(tree))
      .reverse();
  }

  private getTreesToRight(tree: Tree) {
    return this.trees[this.getRowIndex(tree)].slice(
      this.getColumnIndex(tree) + 1
    );
  }

  private getTreesBelow(tree: Tree) {
    return this.getTreesInColumn(tree).slice(this.getRowIndex(tree) + 1);
  }

  private getTreesToLeft(tree: Tree) {
    return this.trees[this.getRowIndex(tree)]
      .slice(0, this.getColumnIndex(tree))
      .reverse();
  }

  private getTreesInColumn(tree: Tree) {
    return this.trees.map((row) => row[this.getColumnIndex(tree)]);
  }

  private getRowIndex(tree: Tree) {
    return this.trees.findIndex((row) => row.includes(tree));
  }

  private getColumnIndex(tree: Tree) {
    return this.trees[this.getRowIndex(tree)].findIndex((c) => c === tree);
  }

  private initializeGrid(input: string[][]) {
    return input.map((row, rowIndex) =>
      row.map((column, columnIndex) => {
        const isEdgeTree =
          rowIndex === 0 ||
          columnIndex === 0 ||
          rowIndex === input.length - 1 ||
          columnIndex === row.length - 1;

        return new Tree(parseInt(column), isEdgeTree ? 0 : undefined);
      })
    );
  }
}

function main() {
  const grid = new Grid(input);

  const tree = grid.getMostScenicTree();

  if (!tree) throw new Error("Unable to find most scenic tree 😿");

  console.log(grid.getScenicScore(tree));
}

main();
