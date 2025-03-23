import "./styles.css";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useEditor, EditorContent, FloatingMenu } from "@tiptap/react";
import {
  DropdownMenu,
  DropdownMenuPortal,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
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

  const HEADING_OPTIONS = [
    { level: 0, label: "Texto", icon: <TextT size={24} /> },
    { level: 1, label: "H1", icon: <TextHOne size={24} /> },
    { level: 2, label: "H2", icon: <TextHTwo size={24} /> },
    { level: 3, label: "H3", icon: <TextHThree size={24} /> },
  ];

  const currentHeading =
    HEADING_OPTIONS.find((option) =>
      option.level === 0
        ? editor.isActive("paragraph")
        : editor.isActive("heading", { level: option.level })
    ) || HEADING_OPTIONS[0];

  return (
    <div id="editor">
      <div className="toolbar">
        <DropdownMenu>
          <DropdownMenuTrigger asChild className="btn-action">
            <button>{currentHeading.icon}</button>
          </DropdownMenuTrigger>
          <DropdownMenuPortal>
            <DropdownMenuContent asChild sideOffset={4} align="start">
              <motion.ul
                initial={{ opacity: 0.3, y: -24 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.8,
                  ease: [0, 0.71, 0.2, 1.01],
                }}
              >
                {HEADING_OPTIONS.map(({ level, icon }) => (
                  <DropdownMenuItem
                    key={level}
                    asChild
                    onSelect={() => {
                      if (level === 0) {
                        editor.chain().focus().setParagraph().run();
                      } else {
                        editor
                          .chain()
                          .focus()
                          .toggleHeading({ level: level as Level })
                          .run();
                      }
                    }}
                  >
                    <li
                      className="btn-action"
                      data-row-active={
                        editor.isActive("heading", { level }) ||
                        (level === 0 && editor.isActive("paragraph"))
                      }
                    >
                      {icon}
                    </li>
                  </DropdownMenuItem>
                ))}
              </motion.ul>
            </DropdownMenuContent>
          </DropdownMenuPortal>
        </DropdownMenu>

        <button
          onClick={() => {
            editor?.chain().focus().toggleBold().run();
          }}
          data-row-active={editor.isActive("bold")}
          className="btn-action"
        >
          <TextB size={24} />
        </button>
        <button
          onClick={() => {
            editor?.chain().focus().toggleItalic().run();
          }}
          data-row-active={editor.isActive("italic")}
          className="btn-action"
        >
          <TextItalic size={24} />
        </button>
        <button
          onClick={() => {
            editor?.chain().focus().toggleUnderline().run();
          }}
          data-row-active={editor.isActive("underline")}
          className="btn-action"
        >
          <TextUnderline size={24} />
        </button>
        <button
          onClick={() => {
            editor?.chain().focus().toggleStrike().run();
          }}
          data-row-active={editor.isActive("strike")}
          className="btn-action"
        >
          <TextStrikethrough size={24} />
        </button>
        <button
          onClick={() => {
            editor?.chain().focus().toggleCode().run();
          }}
          data-row-active={editor.isActive("code")}
          className="btn-action"
        >
          <CodeBlock size={24} />
        </button>
        <button
          onClick={() => setShowLinkInput(!showLinkInput)}
          data-row-active={editor.isActive("link")}
          className="btn-action"
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
          onClick={() => {
            editor?.chain().focus().toggleBulletList().run();
          }}
          data-row-active={editor.isActive("bulletList")}
          className="btn-action"
        >
          <ListBullets size={24} />
        </button>
        <button
          onClick={() => {
            editor?.chain().focus().toggleOrderedList().run();
          }}
          data-row-active={editor.isActive("orderedList")}
          className="btn-action"
        >
          <ListNumbers size={24} />
        </button>
        <button
          onClick={() => {
            editor?.chain().focus().toggleTaskList().run();
          }}
          data-row-active={editor.isActive("taskList")}
          className="btn-action"
        >
          <ListChecks size={24} />
        </button>
      </div>

      {editor && (
        <FloatingMenu
          editor={editor}
          shouldShow={({ state }) => {
            const { $from } = state.selection;
            const currentLineText = $from.nodeBefore?.textContent;
            return currentLineText === "/";
          }}
        >
          <button
            onClick={() => {
              editor?.chain().focus().toggleBold().run();
            }}
            data-row-active={editor.isActive("bold")}
            className="btn-action"
          >
            <TextB size={24} />
          </button>
          <button
            onClick={() => {
              editor?.chain().focus().toggleItalic().run();
            }}
            data-row-active={editor.isActive("italic")}
            className="btn-action"
          >
            <TextItalic size={24} />
          </button>
          <button
            onClick={() => {
              editor?.chain().focus().toggleUnderline().run();
            }}
            data-row-active={editor.isActive("underline")}
            className="btn-action"
          >
            <TextUnderline size={24} />
          </button>
          <button
            onClick={() => {
              editor?.chain().focus().toggleStrike().run();
            }}
            data-row-active={editor.isActive("strike")}
            className="btn-action"
          >
            <TextStrikethrough size={24} />
          </button>
          <button
            onClick={() => {
              editor?.chain().focus().toggleCode().run();
            }}
            data-row-active={editor.isActive("code")}
            className="btn-action"
          >
            <CodeBlock size={24} />
          </button>
        </FloatingMenu>
      )}
      <EditorContent id="box-tiptap" editor={editor} />
    </div>
  );
};
