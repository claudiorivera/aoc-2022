const input = await Deno.readTextFile("./07-input.txt");

const lines = input.trim().split("$ ").filter(Boolean);

const FILE_NODE_TYPE = {
  DIR: "DIR",
  FILE: "FILE",
} as const;

const UP = "..";
const DIR = "dir";

type NodeType = typeof FILE_NODE_TYPE[keyof typeof FILE_NODE_TYPE];

type NodeConstructorOptions = {
  name: string;
  type: NodeType;
  size?: number;
};

class Node {
  name: string;
  type: NodeType;
  size?: number;
  parent?: Node;
  children?: Node[];

  constructor({ name, type, size }: NodeConstructorOptions) {
    this.name = name;
    this.type = type;
    this.size = size;
  }

  getName() {
    return this.name;
  }

  getChildren() {
    return this.children;
  }

  getParent() {
    return this.parent;
  }

  getSize() {
    return this.size;
  }

  addChild(node: Node) {
    if (!this.children) {
      this.children = [];
    }

    this.children.push(node);
  }

  setParent(node: Node) {
    this.parent = node;
  }
}

const root = new Node({
  name: "/",
  type: FILE_NODE_TYPE.DIR,
});

function main() {
  let currentNode = root;

  for (const line of lines.slice(1)) {
    const parsedLine = line.split("\n").filter(Boolean);

    const isChangeDirectoryCommand = parsedLine[0].startsWith("cd");

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

        const existingChild = findChild({
          children: currentNode.getChildren(),
          name,
        });

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

  console.log(root);
}

main();

type CommandArgs = {
  currentNode: Node;
  name: string;
};

function changeDirectory({ currentNode, name }: CommandArgs) {
  if (name === UP) {
    return currentNode.getParent();
  }

  const children = currentNode.getChildren();

  const child = findChild({
    children,
    name,
  });

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

type FindChildArgs = {
  children?: Node[];
  name: string;
};

function findChild({ children, name }: FindChildArgs) {
  return children?.find((child) => child.getName() === name);
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
