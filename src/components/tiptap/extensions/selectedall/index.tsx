import { Extension } from "@tiptap/core";
import { TextSelection } from "prosemirror-state";

export const SelectAllExtension = Extension.create({
  name: "SelectAllExtension",

  addKeyboardShortcuts() {
    let selectAllCount = 0;

    return {
      "Mod-a": ({ editor }) => {
        const { state, view } = editor;
        const { selection, tr } = state;
        const { $from } = selection;
        const node = $from.node();

        selectAllCount++;

        if (selectAllCount === 1) {
          if (node.isTextblock && node.content.size > 0) {
            const start = $from.start();
            const end = $from.end();
            tr.setSelection(
              new TextSelection(
                state.doc.resolve(start),
                state.doc.resolve(end)
              )
            );
          } else {
            tr.setSelection(
              new TextSelection(
                state.doc.resolve(0),
                state.doc.resolve(state.doc.content.size)
              )
            );
          }
        } else {
          tr.setSelection(
            new TextSelection(
              state.doc.resolve(0),
              state.doc.resolve(state.doc.content.size)
            )
          );
        }

        view.dispatch(tr);

        setTimeout(() => (selectAllCount = 0), 500);
        return true;
      },
    };
  },
});
