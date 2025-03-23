import "./styles.css";

import { useState, useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import { toast } from "react-toastify";

import { invoke } from "@tauri-apps/api/core";
import { listen } from "@tauri-apps/api/event";

import {
  CodeBlock,
  LinkSimple,
  ListBullets,
  ListChecks,
  ListNumbers,
  TextB,
  TextHOne,
  TextHThree,
  TextHTwo,
  TextItalic,
  TextStrikethrough,
  TextT,
  TextUnderline,
} from "@phosphor-icons/react";

import { fetchNotes } from "../../functions";

import { Input } from "../input";
import { Button } from "../button";

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

type Level = 1 | 2 | 3 | 4 | 5 | 6;

export const EditorTiptap = ({ fileName }: { fileName: string }) => {
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");
  const [linkText, setLinkText] = useState("");

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
        protocols: ["http", "https", "ftp", "git"],
        HTMLAttributes: {
          class: "tiptap-link",
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
    if (!editor) return;

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

  const handleSetLink = () => {
    if (!editor || !linkUrl) return;
    const hasSelection = !editor.state.selection.empty;

    if (hasSelection) {
      editor
        .chain()
        .focus()
        .extendMarkRange("link")
        .setLink({ href: linkUrl })
        .run();
    } else {
      editor
        .chain()
        .focus()
        .insertContent(`<a href="${linkUrl}">${linkText || linkUrl}</a>`)
        .setLink({ href: linkUrl })
        .run();
    }

    setShowLinkInput(false);
    setLinkUrl("");
    setLinkText("");
  };

  function handlePaste(event: React.ClipboardEvent<HTMLDivElement>) {
    const text = event.clipboardData.getData("text");
    if (/https?:\/\/[^\s]+/g.test(text)) {
      event.preventDefault();
      editor
        ?.chain()
        .focus()
        .insertContent(`<a href="${text}">${text}</a>`)
        .setLink({ href: text })
        .run();
    }
  }

  if (!editor) {
    return null;
  }

  function setHeading(level: Level) {
    if (level < 1) {
      editor?.chain().focus().setParagraph().run();
    } else {
      editor?.chain().focus().toggleHeading({ level }).run();
    }
  }

  function toggleBold() {
    editor?.chain().focus().toggleBold().run();
  }

  function toggleItalic() {
    editor?.chain().focus().toggleItalic().run();
  }

  function toggleUnderline() {
    editor?.chain().focus().toggleUnderline().run();
  }

  function toggleStrike() {
    editor?.chain().focus().toggleStrike().run();
  }

  function toggleCode() {
    editor?.chain().focus().toggleCode().run();
  }

  function toggleBulletList() {
    editor?.chain().focus().toggleBulletList().run();
  }

  function toggleOrderedList() {
    editor?.chain().focus().toggleOrderedList().run();
  }

  function toggleTaskList() {
    editor?.chain().focus().toggleTaskList().run();
  }

  return (
    <div id="editor">
      <div className="toolbar">
        <select onChange={(e) => setHeading(Number(e.target.value) as Level)}>
          <option value="0">
            Text
            <TextT size={24} />
          </option>
          <option value="1">
            H1
            <TextHOne size={24} />
          </option>
          <option value="2">
            H2
            <TextHTwo size={24} />
          </option>
          <option value="3">
            H3
            <TextHThree size={24} />
          </option>
        </select>

        <button
          onClick={toggleBold}
          className={editor.isActive("bold") ? "is-active" : ""}
        >
          <TextB size={24} />
        </button>
        <button
          onClick={toggleItalic}
          className={editor.isActive("italic") ? "is-active" : ""}
        >
          <TextItalic size={24} />
        </button>
        <button
          onClick={toggleUnderline}
          className={editor.isActive("underline") ? "is-active" : ""}
        >
          <TextUnderline size={24} />
        </button>
        <button
          onClick={toggleStrike}
          className={editor.isActive("strike") ? "is-active" : ""}
        >
          <TextStrikethrough size={24} />
        </button>
        <button
          onClick={() => toggleCode()}
          className={editor.isActive("code") ? "is-active" : ""}
        >
          <CodeBlock size={24} />
        </button>
        <button
          onClick={() => setShowLinkInput(!showLinkInput)}
          className={editor.isActive("link") ? "is-active" : ""}
        >
          <LinkSimple size={24} />
        </button>
        {showLinkInput && (
          <div className="drop-link">
            <form className="form-link" onSubmit={handleSetLink}>
              <Input
                type="text"
                placeholder="URL"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
              />
              <Input
                type="text"
                placeholder="Texto do Link"
                value={linkText}
                onChange={(e) => setLinkText(e.target.value)}
              />
              <Button full styles="brand">
                Inserir
              </Button>
            </form>
          </div>
        )}

        <button
          onClick={toggleBulletList}
          className={editor.isActive("bulletList") ? "is-active" : ""}
        >
          <ListBullets size={24} />
        </button>
        <button
          onClick={toggleOrderedList}
          className={editor.isActive("orderedList") ? "is-active" : ""}
        >
          <ListNumbers size={24} />
        </button>
        <button
          onClick={toggleTaskList}
          className={editor.isActive("taskList") ? "is-active" : ""}
        >
          <ListChecks size={24} />
        </button>
      </div>
      <EditorContent id="box-tiptap" editor={editor} onPaste={handlePaste} />
    </div>
  );
};
