const input = await Deno.readTextFile("./07-input.txt");

const lines = input.trim().split("\n");

const FILE_NODE_TYPE = {
  DIR: "DIR",
  FILE: "FILE",
} as const;

const UP = "..";

type FileNodeType = typeof FILE_NODE_TYPE[keyof typeof FILE_NODE_TYPE];

type FileNodeConstructorOptions = {
  name: string;
  type: FileNodeType;
  size?: number;
};

class FileNode {
  name: string;
  type: FileNodeType;
  size?: number;
  parent?: FileNode;
  children?: FileNode[];

  constructor({ name, type, size }: FileNodeConstructorOptions) {
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

  addChild(fileNode: FileNode) {
    if (!this.children) {
      this.children = [];
    }

    this.children.push(fileNode);
  }

  setParent(fileNode: FileNode) {
    this.parent = fileNode;
  }
}

const COMMAND = {
  CHANGE_DIRECTORY: "cd",
  LIST: "ls",
} as const;

const root = new FileNode({
  name: "/",
  type: FILE_NODE_TYPE.DIR,
});

function main() {
  let currentFileNode = root;

  for (const line of lines) {
    const isCommand = line.startsWith("$");

    if (isCommand) {
      const [_, command, arg] = line.split(" ");

      switch (command) {
        case COMMAND.CHANGE_DIRECTORY:
          console.log({
            currentFileNodeName: currentFileNode.getName(),
            changingTo: arg,
          });
          currentFileNode = changeDirectory({
            currentFileNode,
            directoryName: arg,
          });
          break;
        case COMMAND.LIST:
          console.log("listing directory");
          break;
        default:
          break;
      }
    }
  }
}

main();

type ChangeDirectoryArgs = {
  currentFileNode: FileNode;
  directoryName: string;
};

function changeDirectory({
  currentFileNode,
  directoryName,
}: ChangeDirectoryArgs) {
  if (directoryName === UP) {
    const parent = currentFileNode.getParent();

    if (parent) {
      return parent;
    }

    return root;
  }

  const children = currentFileNode.getChildren();

  if (!children) {
    return makeChildDirectory({
      currentFileNode,
      directoryName,
    });
  }

  return childIfExists({
    children,
    currentFileNode,
    directoryName,
  });
}

type ChildIfExistsArgs = {
  children: FileNode[];
  currentFileNode: FileNode;
  directoryName: string;
};

function childIfExists({
  children,
  currentFileNode,
  directoryName,
}: ChildIfExistsArgs) {
  const targetChild = children.find(
    (child) => child.getName() === directoryName
  );

  if (targetChild) {
    return targetChild;
  }

  return currentFileNode;
}

function makeChildDirectory({
  currentFileNode,
  directoryName,
}: ChangeDirectoryArgs) {
  const newNode = new FileNode({
    name: directoryName,
    type: FILE_NODE_TYPE.DIR,
  });

  newNode.setParent(currentFileNode);

  return newNode;
}
