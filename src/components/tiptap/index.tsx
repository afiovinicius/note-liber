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

import { all, createLowlight } from "lowlight";

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
import ListKeymap from "@tiptap/extension-list-keymap";
import TaskItem from "@tiptap/extension-task-item";
import TaskList from "@tiptap/extension-task-list";
import Document from "@tiptap/extension-document";
import Paragraph from "@tiptap/extension-paragraph";
import Text from "@tiptap/extension-text";
import Heading from "@tiptap/extension-heading";
import History from "@tiptap/extension-history";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";

import css from "highlight.js/lib/languages/css";
import js from "highlight.js/lib/languages/javascript";
import ts from "highlight.js/lib/languages/typescript";
import py from "highlight.js/lib/languages/python";
import json from "highlight.js/lib/languages/json";
import html from "highlight.js/lib/languages/xml";
import markdown from "highlight.js/lib/languages/markdown";

import "highlight.js/styles/github-dark.css";

const lowlight = createLowlight(all);

lowlight.register("css", css);
lowlight.register("js", js);
lowlight.register("ts", ts);
lowlight.register("py", py);
lowlight.register("json", json);
lowlight.register("html", html);
lowlight.register("markdown", markdown);

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
      ListKeymap,
      TaskList.configure({
        itemTypeName: "taskItem",
      }),
      TaskItem.configure({
        nested: true,
      }),
      Text,
      Document,
      History,
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
      CodeBlockLowlight.configure({
        lowlight,
      }),
    ],
    content: contentNotes,
    onUpdate: ({ editor }) => {
      const jsonContent = editor.getJSON();
      const selection = editor.state.selection;

      setContentNotes(jsonContent);

      invoke("update_content_note", {
        fileName,
        newContent: jsonContent,
      }).catch(toast.error);

      requestAnimationFrame(() => {
        if (editor.view.hasFocus()) {
          editor.commands.focus(selection.anchor);
        }
      });
    },
  });

  if (!editor) {
    return null;
  }

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
