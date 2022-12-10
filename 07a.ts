const input = await Deno.readTextFile("./07-input.txt");

const lines = input.trim().split("$ ").filter(Boolean);

const NODE_TYPE = {
  DIR: "DIR",
  FILE: "FILE",
} as const;

const UP = "..";
const DIRECTORY = "dir";
const SMALL_FILE_LIMIT = 100_000;

type NodeType = typeof NODE_TYPE[keyof typeof NODE_TYPE];

type NodeConstructorOptions = {
  name: string;
  type: NodeType;
  size?: number;
};

class Node {
  name: string;
  type: NodeType;
  private size?: number;
  parent?: Node;
  children?: Node[];

  constructor({ name, type, size }: NodeConstructorOptions) {
    this.name = name;
    this.type = type;
    this.size = size;
  }

  getSize(): number {
    if (this.type === NODE_TYPE.FILE) {
      return this.size ?? 0;
    } else {
      if (!this.children) return 0;

      return this.children.reduce((acc, child) => acc + child.getSize(), 0);
    }
  }

  makeChild(name: string, type: NodeType, size?: number) {
    const newNode = new Node({
      name,
      type,
      size,
    });

    if (!this.children) {
      this.children = [];
    }

    this.children.push(newNode);

    newNode.parent = this;
  }

  findChildByName(name: string) {
    return this.children?.find((child) => child.name === name);
  }
}

function main() {
  const root = new Node({
    name: "/",
    type: NODE_TYPE.DIR,
  });

  createFileSystem(root);

  console.log(formatTree(root));

  const totalSizeOfSmallDirectories = findSmallDirectories(root).reduce(
    (acc, cur) => acc + cur.getSize(),
    0
  );

  console.log({ totalSizeOfSmallDirectories });
}

main();

function findSmallDirectories(node: Node): Node[] {
  const smallDirectories = [];

  if (node.type === NODE_TYPE.DIR) {
    const isSmallDirectory = node.getSize() < SMALL_FILE_LIMIT;

    if (isSmallDirectory) {
      smallDirectories.push(node);
    }

    const children = node.children;

    if (children?.length) {
      for (const child of children) {
        const childSmallDirectories = findSmallDirectories(child);

        smallDirectories.push(...childSmallDirectories);
      }
    }
  }

  return smallDirectories;
}

function formatTree(node: Node, depth = 0) {
  const { name, type } = node;
  const size = node.getSize();

  const nodeDetails = (type: NodeType) =>
    `${"  ".repeat(depth)} - ${name} (${type}, size=${size})\n`;

  let output = nodeDetails(type);

  if (type === NODE_TYPE.DIR) {
    const children = node.children;

    if (children?.length) {
      output += `${children
        .map((child) => formatTree(child, depth + 1))
        .join("")}`;
    }
  }

  return output;
}

function createFileSystem(root: Node) {
  let currentNode = root;

  for (const line of lines.slice(1)) {
    const parsedLine = line.split("\n").filter(Boolean);

    const isChangeDirectoryCommand = parsedLine.length === 1;

    if (isChangeDirectoryCommand) {
      const targetDirectory = changeDirectory(
        currentNode,
        parsedLine[0].split(" ")[1]
      );

      if (!targetDirectory) throw new Error("Could not change directory 😅");

      currentNode = targetDirectory;
    } else {
      const directoryList = parsedLine.slice(1);

      for (const item of directoryList) {
        handleDirectoryListItem(currentNode, item);
      }
    }
  }
}

function handleDirectoryListItem(currentNode: Node, item: string) {
  const [sizeOrDirectory, name] = item.split(" ");

  const isDirectory = sizeOrDirectory.startsWith(DIRECTORY);

  const existingChild = currentNode.findChildByName(name);

  if (existingChild) return;

  currentNode.makeChild(
    name,
    isDirectory ? NODE_TYPE.DIR : NODE_TYPE.FILE,
    parseInt(sizeOrDirectory)
  );
}

function changeDirectory(currentNode: Node, targetDirectory: string) {
  if (targetDirectory === UP) {
    return currentNode.parent;
  }

  const child = currentNode.findChildByName(targetDirectory);

  return child;
}
