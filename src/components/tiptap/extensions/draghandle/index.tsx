import "./styles.css";

import { mergeAttributes, Node } from "@tiptap/core";
import {
  ReactNodeViewRenderer,
  NodeViewContent,
  NodeViewWrapper,
} from "@tiptap/react";
import { DotsSixVertical } from "@phosphor-icons/react";

const DragHandleItem = () => {
  return (
    <NodeViewWrapper className="draggable-item">
      <span
        className="drag-handle"
        contentEditable={false}
        draggable="true"
        data-drag-handle
      >
        <DotsSixVertical size={18} weight="bold" />
      </span>
      <NodeViewContent />
    </NodeViewWrapper>
  );
};

export const DragHandleExtension = Node.create({
  name: "draggableItem",
  group: "block",
  content: "block+",
  draggable: true,

  parseHTML() {
    return [
      {
        tag: 'div[data-type="draggable-item"]',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "div",
      mergeAttributes(HTMLAttributes, { "data-type": "draggable-item" }),
      0,
    ];
  },

  addNodeView() {
    return ReactNodeViewRenderer(DragHandleItem);
  },
});
