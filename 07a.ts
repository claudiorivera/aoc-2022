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

  addChild(node: Node) {
    if (!this.children) {
      this.children = [];
    }

    this.children.push(node);
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

  let output = "";

  if (type === NODE_TYPE.FILE) {
    output += `${"  ".repeat(depth)} - ${name} (file, size=${size})\n`;
  } else {
    output += `${"  ".repeat(depth)} - ${name} (${DIRECTORY}, size=${size})\n`;

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
      const targetDirectory = parsedLine[0].split(" ")[1];

      const newDirectory = changeDirectory({
        currentNode,
        name: targetDirectory,
      });

      if (!newDirectory) throw new Error("Could not change directory 😅");

      currentNode = newDirectory;
    } else {
      const directoryList = parsedLine.slice(1);

      for (const item of directoryList) {
        handleDirectoryListItem({ item, currentNode });
      }
    }
  }
}

type HandleDirectoryListItemArgs = {
  item: string;
  currentNode: Node;
};

function handleDirectoryListItem({
  item,
  currentNode,
}: HandleDirectoryListItemArgs) {
  const [sizeOrDirectory, name] = item.split(" ");

  const isDirectory = sizeOrDirectory.startsWith(DIRECTORY);

  const existingChild = currentNode.findChildByName(name);

  if (existingChild) return;

  if (isDirectory) {
    makeChildDirectory({
      currentNode,
      name,
    });
  } else {
    makeChildFile({
      currentNode,
      name,
      size: parseInt(sizeOrDirectory),
    });
  }
}

type CommandArgs = {
  currentNode: Node;
  name: string;
};

function changeDirectory({ currentNode, name }: CommandArgs) {
  if (name === UP) {
    return currentNode.parent;
  }

  const child = currentNode.findChildByName(name);

  return child;
}

function makeChildDirectory({ currentNode, name }: CommandArgs) {
  return makeChild({
    currentNode,
    name,
    type: NODE_TYPE.DIR,
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
    type: NODE_TYPE.FILE,
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

  newNode.parent = currentNode;

  return newNode;
}
