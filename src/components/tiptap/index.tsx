import "./styles.css";

import { useState, useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";

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
  const [content, setContent] = useState<any>();
  const [selectedHeading, setSelectedHeading] = useState<Level>();
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");
  const [linkText, setLinkText] = useState("");

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
      TaskList,
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
          if (node.type.name === "heading") {
            return "Digite um Título";
          }

          return "Adicione sua nota!";
        },
      }),
      Link.configure({
        openOnClick: false,
        autolink: true,
        defaultProtocol: "https",
        protocols: ["http", "https", "ftp", "git"],
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      const jsonContent = editor.getJSON();
      setContent(jsonContent);

      invoke("update_content_note", {
        fileName,
        newContent: jsonContent,
      }).catch(console.error);
    },
  });

  const fetchNote = async () => {
    try {
      const data = await invoke("get_content_note", { fileName });

      if (editor && data) {
        editor.commands.setContent(data);
      }
    } catch (error) {
      console.error("Erro ao carregar a nota:", error);
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

  function setLink() {
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
  }

  function handlePaste(event: any) {
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
    if (editor) {
      if (level < 1) {
        editor.chain().focus().setParagraph().run();
      } else {
        editor.chain().focus().toggleHeading({ level }).run();
      }
    }
    setSelectedHeading(level);
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
    <div>
      <div>
        <select
          value={selectedHeading}
          onChange={(e) => setHeading(Number(e.target.value) as Level)}
          className={
            editor.isActive("heading", { level: selectedHeading })
              ? "is-active"
              : ""
          }
        >
          <option
            value="0"
            style={{ width: "24px", height: "24px", color: "#f5f5f5" }}
          >
            <TextT size={20} />
          </option>
          <option
            value="1"
            style={{ width: "24px", height: "24px", color: "#f5f5f5" }}
          >
            <TextHOne size={20} />
          </option>
          <option
            value="2"
            style={{ width: "24px", height: "24px", color: "#f5f5f5" }}
          >
            <TextHTwo size={20} />
          </option>
          <option
            value="3"
            style={{ width: "24px", height: "24px", color: "#f5f5f5" }}
          >
            <TextHThree size={20} />
          </option>
        </select>

        <button
          onClick={toggleBold}
          className={editor.isActive("bold") ? "is-active" : ""}
        >
          <TextB size={20} />
        </button>
        <button
          onClick={toggleItalic}
          className={editor.isActive("italic") ? "is-active" : ""}
        >
          <TextItalic size={20} />
        </button>
        <button
          onClick={toggleUnderline}
          className={editor.isActive("underline") ? "is-active" : ""}
        >
          <TextUnderline size={20} />
        </button>
        <button
          onClick={toggleStrike}
          className={editor.isActive("strike") ? "is-active" : ""}
        >
          <TextStrikethrough size={20} />
        </button>
        <button
          onClick={() => toggleCode()}
          className={editor.isActive("code") ? "is-active" : ""}
        >
          <CodeBlock size={20} />
        </button>
        <button
          onClick={() => setShowLinkInput(!showLinkInput)}
          className={editor.isActive("link") ? "is-active" : ""}
        >
          <LinkSimple size={20} />
        </button>
        {showLinkInput && (
          <div className="link-input">
            <input
              type="text"
              placeholder="URL"
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
            />
            <input
              type="text"
              placeholder="Texto do Link"
              value={linkText}
              onChange={(e) => setLinkText(e.target.value)}
            />
            <button onClick={setLink}>Inserir</button>
          </div>
        )}

        <button
          onClick={toggleBulletList}
          className={editor.isActive("bulletList") ? "is-active" : ""}
        >
          <ListBullets size={20} />
        </button>
        <button
          onClick={toggleOrderedList}
          className={editor.isActive("orderedList") ? "is-active" : ""}
        >
          <ListNumbers size={20} />
        </button>
        <button
          onClick={toggleTaskList}
          className={editor.isActive("taskList") ? "is-active" : ""}
        >
          <ListChecks size={20} />
        </button>
      </div>
      <EditorContent editor={editor} onPaste={handlePaste} />
    </div>
  );
};
