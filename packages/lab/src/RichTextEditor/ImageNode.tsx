import { DecoratorNode, NodeKey } from "lexical";

type SerializedImageNode = {
  type: "image";
  version: 1;
  src: string;
};

export class ImageNode extends DecoratorNode<JSX.Element> {
  __src: string;

  constructor(src = "", key?: NodeKey) {
    super(key);
    this.__src = src;
  }

  static getType() {
    return "image";
  }

  static clone(node: ImageNode) {
    return new ImageNode(node.__src, node.__key);
  }

  static importJSON(serializedNode: SerializedImageNode) {
    return new ImageNode(serializedNode.src);
  }

  exportJSON(): SerializedImageNode {
    return {
      type: "image",
      version: 1,
      src: this.__src,
    };
  }

  createDOM() {
    const div = document.createElement("div");
    return div;
  }

  updateDOM() {
    return false;
  }

  decorate() {
    return (
      <img
        src={this.__src}
        style={{
          maxWidth: "100%",
          display: "block",
        }}
      />
    );
  }
}
