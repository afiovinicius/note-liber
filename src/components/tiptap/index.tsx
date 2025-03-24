import "./styles.css";

import { useEffect } from "react";
import {
  useEditor,
  EditorContent,
  FloatingMenu,
  BubbleMenu,
} from "@tiptap/react";
import { toast } from "react-toastify";

import { invoke } from "@tauri-apps/api/core";
import { listen } from "@tauri-apps/api/event";

import Bold from "@tiptap/extension-bold";
import Italic from "@tiptap/extension-italic";
import Underline from "@tiptap/extension-underline";
import Strike from "@tiptap/extension-strike";
import Code from "@tiptap/extension-code";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import BulletList from "@tiptap/extension-bullet-list";
import ListItem from "@tiptap/extension-list-item";
import OrderedList from "@tiptap/extension-ordered-list";
import TaskItem from "@tiptap/extension-task-item";
import TaskList from "@tiptap/extension-task-list";
import Document from "@tiptap/extension-document";
import Paragraph from "@tiptap/extension-paragraph";
import Text from "@tiptap/extension-text";
import Heading from "@tiptap/extension-heading";

import { fetchNotes } from "../../functions";

import { ToolBar } from "../toolbar";
import { FloatMenu } from "../floatingmenu";

export const EditorTiptap = ({ fileName }: { fileName: string }) => {
  const { contentNotes, setContentNotes } = fetchNotes();

  const editor = useEditor({
    extensions: [
      Bold,
      Italic,
      Underline,
      Strike,
      Code,
      BulletList,
      OrderedList,
      ListItem,
      TaskList.configure({
        itemTypeName: "taskItem",
      }),
      TaskItem.configure({
        nested: true,
      }),
      Text,
      Document,
      Paragraph,
      Heading.configure({
        levels: [1, 2, 3],
      }),
      Placeholder.configure({
        placeholder: ({ node }) => {
          if (node.type.name === "heading") return "Digite seu título aqui...";
          return "Comece a escrever...";
        },
      }),
      Link.configure({
        openOnClick: true,
        autolink: true,
        defaultProtocol: "https",
        HTMLAttributes: {
          class: "tiptap-link",
          target: "_blank",
        },
      }),
    ],
    content: contentNotes,
    onUpdate: ({ editor }) => {
      const jsonContent = editor.getJSON();
      const position = editor.state.selection.anchor;

      setContentNotes(jsonContent);

      invoke("update_content_note", {
        fileName,
        newContent: jsonContent,
      }).catch(toast.error);

      requestAnimationFrame(() => {
        editor.commands.setTextSelection(position);
      });
    },
  });

  const fetchNote = async () => {
    try {
      const data = await invoke("get_content_note", { fileName });

      if (editor && data) {
        editor.commands.setContent(data);
      }
    } catch (error) {
      toast.error(`Erro ao carregar a nota: ${error}`);
    }
  };

  useEffect(() => {
    fetchNote();

    const unlisten = listen("note_updated", (event) => {
      if (editor) {
        editor.commands.setContent(event.payload as any);
      }
    });

    return () => {
      unlisten.then((fn) => fn());
    };
  }, [editor]);

  if (!editor) {
    return null;
  }

  return (
    <div id="editor">
      <ToolBar isEditor={editor} />

      <FloatingMenu
        editor={editor}
        shouldShow={({ state }) => {
          const { $from } = state.selection;
          const currentLineText = $from.nodeBefore?.textContent;
          return currentLineText === "/";
        }}
      >
        <FloatMenu isEditor={editor} />
      </FloatingMenu>

      <BubbleMenu editor={editor}>
        <FloatMenu isEditor={editor} />
      </BubbleMenu>

      <EditorContent id="box-tiptap" editor={editor} />
    </div>
  );
};
