import { $insertNodeToNearestRoot } from "@lexical/utils";

import { ImageNode } from "./ImageNode";

export const insertImage = (editor: any, url: string) => {
  editor.update(() => {
    const imageNode = new ImageNode(url);
    $insertNodeToNearestRoot(imageNode);
  });
};
