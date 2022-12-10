const input = await Deno.readTextFile("./07-input.txt");

const lines = input.trim().split("$ ").filter(Boolean);

const FILE_NODE_TYPE = {
  DIR: "DIR",
  FILE: "FILE",
} as const;

const UP = "..";
const DIR = "dir";
const SMALL_FILE_LIMIT = 100_000;

type NodeType = typeof FILE_NODE_TYPE[keyof typeof FILE_NODE_TYPE];

type NodeConstructorOptions = {
  name: string;
  type: NodeType;
  size?: number;
};

class Node {
  private name: string;
  private type: NodeType;
  private size?: number;
  private parent?: Node;
  private children: Node[];

  constructor({ name, type, size }: NodeConstructorOptions) {
    this.name = name;
    this.type = type;
    this.size = size;
    this.children = [];
  }

  getName() {
    return this.name;
  }

  getType() {
    return this.type;
  }

  getChildren() {
    return this.children;
  }

  getParent() {
    return this.parent;
  }

  getSize(): number {
    if (this.type === FILE_NODE_TYPE.FILE) {
      return this.size ?? 0;
    } else {
      return this.children.reduce((acc, child) => acc + child.getSize(), 0);
    }
  }

  addChild(node: Node) {
    this.children.push(node);
  }

  setParent(node: Node) {
    this.parent = node;
  }

  findChildByName(name: string) {
    const foundChild = this.children?.find((child) => child.getName() === name);

    return foundChild;
  }
}

const root = new Node({
  name: "/",
  type: FILE_NODE_TYPE.DIR,
});

function main() {
  createFileSystem();

  console.log(formatTree(root));

  const smallDirectories = findSmallDirectories(root);

  const totalSizeOfSmallDirectories = smallDirectories.reduce(
    (acc, cur) => acc + cur.getSize(),
    0
  );

  console.log({ totalSizeOfSmallDirectories });
}

main();

function findSmallDirectories(node: Node): Node[] {
  const smallDirectories = [];

  if (node.getType() === FILE_NODE_TYPE.DIR) {
    const isSmallDirectory = node.getSize() < SMALL_FILE_LIMIT;

    if (isSmallDirectory) {
      smallDirectories.push(node);
    }

    const children = node.getChildren();

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
  const size = node.getSize();
  const name = node.getName();
  const type = node.getType();

  let output = "";

  if (type === FILE_NODE_TYPE.FILE) {
    output += `${"  ".repeat(depth)} - ${name} (file, size=${size})\n`;
  } else if (type === FILE_NODE_TYPE.DIR) {
    output += `${"  ".repeat(depth)} - ${name} (${DIR}, size=${size})\n`;

    const children = node.getChildren();

    if (children?.length) {
      output += `${children
        .map((child) => formatTree(child, depth + 1))
        .join("")}`;
    }
  }

  return output;
}

function createFileSystem() {
  let currentNode = root;

  for (const line of lines.slice(1)) {
    const parsedLine = line.split("\n").filter(Boolean);

    const isChangeDirectoryCommand = parsedLine.length === 1;

    if (isChangeDirectoryCommand) {
      const targetDirectory = parsedLine[0].split(" ")[1];

      const newDirectory = changeDirectory({
        currentNode,
        name: targetDirectory,
      });

      if (!newDirectory) throw new Error("Directory not found");

      currentNode = newDirectory;
    } else {
      const directoryList = parsedLine.slice(1);

      for (const item of directoryList) {
        const [sizeOrDirectory, name] = item.split(" ").filter(Boolean);

        const isDirectory = sizeOrDirectory.startsWith(DIR);

        const existingChild = currentNode.findChildByName(name);

        if (!existingChild) {
          if (isDirectory) {
            makeChildDirectory({
              currentNode,
              name,
            });
          } else {
            makeChildFile({
              currentNode,
              name,
              size: parseInt(sizeOrDirectory, 10),
            });
          }
        }
      }
    }
  }
}

type CommandArgs = {
  currentNode: Node;
  name: string;
};

function changeDirectory({ currentNode, name }: CommandArgs) {
  if (name === UP) {
    return currentNode.getParent();
  }

  const child = currentNode.findChildByName(name);

  return child;
}

function makeChildDirectory({ currentNode, name }: CommandArgs) {
  return makeChild({
    currentNode,
    name,
    type: FILE_NODE_TYPE.DIR,
  });
}

function makeChildFile({
  currentNode,
  name,
  size,
}: CommandArgs & { size: number }) {
  return makeChild({
    currentNode,
    name,
    type: FILE_NODE_TYPE.FILE,
    size,
  });
}

type MakeChildArgs = CommandArgs & {
  type: NodeType;
  size?: number;
};

function makeChild({ currentNode, name, type, size }: MakeChildArgs) {
  const newNode = new Node({
    name,
    type,
    size,
  });

  currentNode.addChild(newNode);

  newNode.setParent(currentNode);

  return newNode;
}
